"use client";

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Authentication } from "@/application";
import { useRouter } from "next/navigation";
import { User } from "@/domain";

interface AuthContextProps {
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  error: string | null;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({} as any);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const auth = new Authentication();

      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao obter usuário atual:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  async function login(email: string, password: string) {
    try {
      const authentication = new Authentication();
      const user = await authentication.login(email, password);
      setUser(user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao logar:", error);
      setError("Erro ao logar, " + error);
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const authentication = new Authentication();
      const user = await authentication.register(name, email, password);
      setUser(user);
      router.push("/dashboard");
    } catch (error) {
      console.log("Erro ao criar conta," + error);
      setError("Error ao criar conta, " + error);
    }
  }

  async function logout() {
    try {
      const authentication = new Authentication();
      await authentication.logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.log("Error ao deslogar, " + error);
      setError("Error ao deslogar, " + error);
    }
  }

  if (loading) return <p className="p-4 text-2xl">Carregando...</p>;

  return (
    <AuthContext.Provider
      value={{ login, register, logout, error, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
