import React, { createContext, useEffect } from "react";
import { useMiddleware } from "@/hooks/useMiddleware";

export const MiddlewareContext = createContext<undefined>(undefined);

type MiddlewareProviderProps = { children: React.ReactNode };

export function MiddlewareProvider({ children }: MiddlewareProviderProps) {
  const { checkAuth, defineListeners, pathname } = useMiddleware();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => defineListeners(), []);

  return (
    <MiddlewareContext.Provider value={undefined}>
      {children}
    </MiddlewareContext.Provider>
  );
}
