import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Tracks whether the Virtual Try-On mirror is open.
 *
 * The mirror is a modal, not a route, so the URL stays on the product page
 * while it is open. IdleDetector's path-based exclusion (/camera, /admin)
 * therefore never fired for it, and the idle ad would interrupt a live try-on
 * after 30s of no face detection. This flag gives the modal a way to tell the
 * detector to stand down.
 */
interface TryOnActivityValue {
  isTryOnActive: boolean;
  setTryOnActive: (active: boolean) => void;
}

const TryOnActivityContext = createContext<TryOnActivityValue>({
  isTryOnActive: false,
  setTryOnActive: () => {},
});

export function TryOnActivityProvider({ children }: { children: ReactNode }) {
  const [isTryOnActive, setActive] = useState(false);

  // Stable identity so consumers can safely put it in effect dependencies.
  const setTryOnActive = useCallback((active: boolean) => setActive(active), []);

  return (
    <TryOnActivityContext.Provider value={{ isTryOnActive, setTryOnActive }}>
      {children}
    </TryOnActivityContext.Provider>
  );
}

export function useTryOnActivity() {
  return useContext(TryOnActivityContext);
}
