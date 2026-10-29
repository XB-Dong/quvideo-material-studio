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
import { api } from "../lib/api";
import {
  advanceSessionGeneration,
  currentSessionGeneration,
} from "../lib/session-generation";
import type { Session } from "../lib/types";
type Identity = {
  session: Session | null;
  error: string | null;
  retry: () => void;
  epoch: React.RefObject<number>;
};
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
      <IdentityProvider>{children}</IdentityProvider>
    </QueryClientProvider>
  );
}
function IdentityProvider({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const epoch = useRef(0);
  const retry = useCallback(() => setAttempt((x) => x + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const generation = advanceSessionGeneration();
    epoch.current = generation;
    setSession(null);
    setError(null);
    client.cancelQueries({ queryKey: ["personal"] });
    client.removeQueries({ queryKey: ["personal"] });
    api<Session>("/api/session", { method: "POST", signal: controller.signal })
      .then((s) => {
        if (epoch.current === generation && !controller.signal.aborted)
          setSession(s);
      })
      .catch((e) => {
        if (!controller.signal.aborted && epoch.current === generation)
          setError(e.message);
      });
    const expire = (event: Event) => {
      if (
        (event as CustomEvent<{ generation: number }>).detail?.generation !==
        currentSessionGeneration()
      )
        return;
      epoch.current = advanceSessionGeneration();
      setSession(null);
      setError("会话已失效，请重新连接身份");
      client.cancelQueries({ queryKey: ["personal"] });
      client.removeQueries({ queryKey: ["personal"] });
    };
    window.addEventListener("session-expired", expire);
    return () => {
      advanceSessionGeneration();
      controller.abort();
      window.removeEventListener("session-expired", expire);
    };
  }, [attempt, client]);
  return (
    <IdentityContext.Provider value={{ session, error, retry, epoch }}>
      {children}
    </IdentityContext.Provider>
  );
}
export function useIdentity() {
  const identity = useContext(IdentityContext);
  if (!identity) throw Error("Missing identity provider");
  return identity;
}
