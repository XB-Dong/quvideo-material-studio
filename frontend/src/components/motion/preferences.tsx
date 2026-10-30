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
};
const Context = createContext<Preferences>({
  enabled: false,
  systemReduced: false,
});
export function MotionPreferences({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false),
    [systemReduced, setReduced] = useState(false),
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
      localStorage.removeItem("yingzuo-static");
    } catch {}
    setReady(true);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <Context
      value={{
        enabled: ready && !systemReduced && visible,
        systemReduced,
      }}
    >
      <div
        className={!ready || systemReduced || !visible ? "motion-static" : ""}
      >
        {children}
      </div>
    </Context>
  );
}
export function useMotionPreferences() {
  return useContext(Context);
}
