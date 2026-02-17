import { createContext, useState, ReactNode } from "react";

type AuthState = {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
};

type AuthContextType = {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
};

export const AuthContext = createContext<AuthContextType>({
  auth: { token: null, role: null, isAuthenticated: false },
  setAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem("token"),
    role: null,
    isAuthenticated: !!localStorage.getItem("token"),
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
