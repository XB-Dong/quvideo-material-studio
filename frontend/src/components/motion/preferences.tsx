"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Preferences = {
  enabled: boolean;
  systemReduced: boolean;
  manualStatic: boolean;
  setStatic: (value: boolean) => void;
};
const Context = createContext<Preferences>({
  enabled: false,
  systemReduced: false,
  manualStatic: false,
  setStatic: () => {},
});
export function MotionPreferences({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false),
    [systemReduced, setReduced] = useState(false),
    [manualStatic, setManual] = useState(false),
    [visible, setVisible] = useState(true);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      setReady(true);
      return;
    }
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    const visibility = () => setVisible(document.visibilityState !== "hidden");
    sync();
    visibility();
    try {
      setManual(localStorage.getItem("yingzuo-static") === "true");
    } catch {}
    setReady(true);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const setStatic = (value: boolean) => {
    setManual(value);
    try {
      localStorage.setItem("yingzuo-static", String(value));
    } catch {}
  };
  return (
    <Context
      value={{
        enabled: ready && !systemReduced && !manualStatic && visible,
        systemReduced,
        manualStatic,
        setStatic,
      }}
    >
      <div
        className={
          !ready || systemReduced || manualStatic || !visible
            ? "motion-static"
            : ""
        }
      >
        {children}
      </div>
    </Context>
  );
}
export function useMotionPreferences() {
  return useContext(Context);
}
export function MotionToggle() {
  const p = useMotionPreferences();
  return (
    <button
      className="motion-toggle"
      aria-pressed={!p.manualStatic && !p.systemReduced}
      disabled={p.systemReduced}
      onClick={() => p.setStatic(!p.manualStatic)}
    >
      {p.manualStatic || p.systemReduced ? "静态模式" : "动态效果"}
    </button>
  );
}
