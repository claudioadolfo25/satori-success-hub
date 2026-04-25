import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiAuth, auth, type User } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    rut?: string;
    empresa?: string;
    region?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiAuth
      .me()
      .then((res) => setUser(res.user))
      .catch(() => auth.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiAuth.login({ email, password });
    auth.setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (payload: Parameters<AuthContextValue["register"]>[0]) => {
      const res = await apiAuth.register(payload);
      auth.setToken(res.token);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    auth.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
