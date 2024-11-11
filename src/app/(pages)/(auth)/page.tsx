"use client";

import Link from "next/link";
import useAuth from "@/app/data/hooks/useAuth";
import { useState, FormEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, error } = useAuth();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    await login(email, password);
  }

  return (
    <section className="container h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">Finans Flow</h1>
      <p className="mb-4 text-slate-500">Seja bem-vindo de volta!</p>
      <form
        onSubmit={handleLogin}
        className="w-[600px] max-w-full flex flex-col gap-4"
      >
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Digite seu Email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Digite sua Senha"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="button">
          Entrar
        </button>
      </form>
      <Link href={"/register"} className="mt-4 text-slate-500">
        Ainda não tem Cadastro?{" "}
        <span className="font-bold text-slate-300">Cadastre-se</span>
      </Link>
    </section>
  );
}
