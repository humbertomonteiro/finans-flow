"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import useAuth from "@/app/data/hooks/useAuth";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, error } = useAuth();

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    await register(name, email, password);
  }
  return (
    <section className="container h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4 text-textPrimary">Finans Flow</h1>

      <p className="mb-4 text-textSecondary">
        Seja bem-vindo! Aproveite nossos serviços.
      </p>

      <form
        onSubmit={handleRegister}
        className="w-[600px] max-w-full flex flex-col gap-4"
      >
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Digite seu Nome"
          required
        />
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

      <Link href={"/"} className="mt-4 text-textSecondary">
        Já tem uma conta?{" "}
        <span className="font-bold text-textPrimary">Faça login</span>
      </Link>
    </section>
  );
}
