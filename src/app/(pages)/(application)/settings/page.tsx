"use client";

import useAuth from "@/app/data/hooks/useAuth";

export default function Settings() {
  const { logout, user, setUser } = useAuth();

  async function handleLogout() {
    console.log("clicou");
    await logout();
    setUser(null);
    console.log(user);
  }

  return (
    <div>
      <section>
        <button className="button" onClick={handleLogout}>
          Sair da aplicação
        </button>
      </section>
    </div>
  );
}
