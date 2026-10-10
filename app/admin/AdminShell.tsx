"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_NAV, adminRequest } from "./adminApi";

type Props = { children: ReactNode };
type LoginResponse = { success: boolean; token: string };

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAuthenticated(Boolean(localStorage.getItem("adminToken")));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await adminRequest<LoginResponse>("login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("adminToken", data.token);
      setAuthenticated(true);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setAuthenticated(false);
    router.replace("/admin");
  }

  if (!ready) return <main className="min-h-screen bg-zinc-950" />;

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-zinc-100">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">Portfolio admin</p>
          <h1 className="mt-3 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to manage your portfolio content.</p>
          <label className="mt-7 block text-sm text-zinc-300">Email</label>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 outline-none focus:border-orange-400" />
          <label className="mt-4 block text-sm text-zinc-300">Password</label>
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 outline-none focus:border-orange-400" />
          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 md:flex">
      <aside className="border-b border-white/10 bg-zinc-900/70 p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:p-6">
        <Link href="/admin" className="text-lg font-bold tracking-wide">SOHAIB<span className="text-orange-400">.</span></Link>
        <p className="mt-1 text-xs text-zinc-500">PORTFOLIO CONTROL PANEL</p>
        <nav className="mt-7 flex gap-2 overflow-x-auto md:flex-col">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-orange-500/10 font-medium text-orange-300" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
              <span className="w-5 text-center text-lg">{item.icon}</span>{item.label}
            </Link>;
          })}
        </nav>
        <button onClick={logout} className="mt-7 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-white md:absolute md:bottom-6 md:left-6">Sign out</button>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10">{children}</main>
    </div>
  );
}
