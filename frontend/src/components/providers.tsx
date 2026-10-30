"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { api, ApiError } from "../lib/api";
import {
  advanceSessionGeneration,
  currentSessionGeneration,
} from "../lib/session-generation";
import type { Session } from "../lib/types";
import { MotionPreferences } from "./motion/preferences";

export type AuthAction =
  | "register"
  | "login"
  | "logout"
  | "profile"
  | "password";
type Identity = {
  session: Session | null;
  error: string | null;
  retry: () => void;
  epoch: React.RefObject<number>;
  authBusy: boolean;
  authenticate: (
    action: AuthAction,
    payload?: Record<string, string>,
  ) => Promise<Session>;
};
// Includes initialization and recovery, even across a root remount. A view never owns the cookie write.
let identityTail: Promise<void> = Promise.resolve();
function serialIdentity<T>(work: () => Promise<T>): Promise<T> {
  const result = identityTail.then(work, work);
  identityTail = result.then(
    () => {},
    () => {},
  );
  return result;
}
function normalizeSession(session: Session): Session {
  return {
    ...session,
    kind: session.kind || "GUEST",
    email: session.email || null,
    emailVerified: session.emailVerified === true,
  };
}
const IdentityContext = createContext<Identity | null>(null);
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <IdentityProvider>
        <MotionPreferences>{children}</MotionPreferences>
      </IdentityProvider>
    </QueryClientProvider>
  );
}
function IdentityProvider({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const [session, setSession] = useState<Session | null>(null),
    [error, setError] = useState<string | null>(null),
    [authBusy, setBusy] = useState(true);
  const sessionRef = useRef<Session | null>(null),
    epoch = useRef(0),
    alive = useRef(false),
    busy = useRef(false),
    recoverOnly = useRef(false),
    active = useRef<Promise<Session> | null>(null);
  const invalidate = useCallback(() => {
    const generation = advanceSessionGeneration();
    epoch.current = generation;
    sessionRef.current = null;
    if (alive.current) {
      setSession(null);
      setError(null);
    }
    void client.cancelQueries({ queryKey: ["personal"] });
    client.removeQueries({ queryKey: ["personal"] });
    return generation;
  }, [client]);
  const apply = useCallback((value: Session, generation: number) => {
    const normalized = normalizeSession(value);
    if (alive.current && epoch.current === generation) {
      sessionRef.current = normalized;
      setSession(normalized);
      setError(null);
    }
    return normalized;
  }, []);
  const run = useCallback(
    (work: (generation: number) => Promise<Session>, change: boolean) => {
      if (busy.current)
        return Promise.reject(
          new ApiError(409, "身份操作正在进行，请稍候", "AUTH_BUSY"),
        );
      busy.current = true;
      if (alive.current) setBusy(true);
      const generation = change ? invalidate() : epoch.current;
      const promise = serialIdentity(() => {
        if (!alive.current || epoch.current !== generation)
          throw new DOMException("身份视图已切换", "AbortError");
        return work(generation);
      }).finally(() => {
        busy.current = false;
        active.current = null;
        if (alive.current) setBusy(false);
      });
      active.current = promise;
      return promise;
    },
    [invalidate],
  );
  const connect = useCallback(
    () =>
      run(async (generation) => {
        try {
          const value = await api<Session>("/api/session", {
            method: recoverOnly.current ? "GET" : "POST",
          });
          recoverOnly.current = false;
          return apply(value, generation);
        } catch (e) {
          if (!(e instanceof ApiError) || e.status >= 500) {
            recoverOnly.current = true;
            try {
              return apply(await api<Session>("/api/session"), generation);
            } catch (recovery) {
              if (recovery instanceof ApiError && recovery.status === 401)
                recoverOnly.current = false;
            }
          }
          if (alive.current && epoch.current === generation)
            setError(
              e instanceof Error ? e.message : "身份暂时无法确认，请恢复查询",
            );
          throw e;
        }
      }, true),
    [run, apply],
  );
  const retry = useCallback(() => {
    if (!busy.current) void connect().catch(() => {});
  }, [connect]);
  const authenticate = useCallback(
    (action: AuthAction, payload: Record<string, string> = {}) => {
      const previous = sessionRef.current;
      const change = action !== "profile";
      const paths: Record<AuthAction, string> = {
        register: "/api/auth/register",
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        profile: "/api/account/profile",
        password: "/api/account/password",
      };
      return run(async (generation) => {
        try {
          const value = await api<Session>(paths[action], {
            method: action === "profile" ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          recoverOnly.current = false;
          return apply(value, generation);
        } catch (e) {
          if (!(e instanceof ApiError) || e.status >= 500) {
            recoverOnly.current = true;
            try {
              apply(await api<Session>("/api/session"), generation);
              recoverOnly.current = false;
            } catch (recovery) {
              if (recovery instanceof ApiError && recovery.status === 401)
                recoverOnly.current = false;
              if (alive.current)
                setError("操作结果尚未确认，请恢复身份查询后再操作");
            }
            throw new ApiError(
              0,
              "操作结果尚未确认，已尝试查询当前身份；请核对后继续，不要重复提交",
              "AUTH_OUTCOME_UNKNOWN",
            );
          }
          if (
            change &&
            previous &&
            epoch.current === generation &&
            (e.status !== 401 || e.code === "AUTH_INVALID")
          )
            apply(previous, generation);
          throw e;
        }
      }, change);
    },
    [run, apply],
  );
  useEffect(() => {
    alive.current = true;
    if (active.current) {
      void active.current
        .catch(() => {})
        .then(() => {
          if (alive.current && !sessionRef.current)
            void connect().catch(() => {});
        });
    } else void connect().catch(() => {});
    const expire = (event: Event) => {
      if (
        (event as CustomEvent<{ generation: number }>).detail?.generation !==
        currentSessionGeneration()
      )
        return;
      invalidate();
      setError("会话已失效，请重新连接身份");
    };
    window.addEventListener("session-expired", expire);
    return () => {
      alive.current = false;
      epoch.current = advanceSessionGeneration();
      window.removeEventListener("session-expired", expire);
    };
  }, [client, connect, invalidate]);
  return (
    <IdentityContext.Provider
      value={{ session, error, retry, epoch, authBusy, authenticate }}
    >
      {children}
    </IdentityContext.Provider>
  );
}
export function useIdentity() {
  const identity = useContext(IdentityContext);
  if (!identity) throw Error("Missing identity provider");
  return identity;
}
