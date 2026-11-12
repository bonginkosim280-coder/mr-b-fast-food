"use client";

import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const statuses = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  cooking: "Cooking",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_price: number | string;
  order_status: string;
  fulfillment_type: string;
};

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isAdmin = session?.user.app_metadata?.role === "admin";
  const adminId = isAdmin ? session?.user.id : undefined;

  useEffect(() => {
    // INITIAL_SESSION runs on page load. The listener also handles sign-in,
    // sign-out, and token refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setCheckingSession(false);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setOrders([]);
    if (!adminId) return;

    let cancelled = false;
    setLoadingOrders(true);
    setError("");

    async function loadOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, customer_phone, total_price, order_status, fulfillment_type")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError("Could not load orders.");
      } else {
        setOrders(data ?? []);
      }
      setLoadingOrders(false);
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [adminId]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSigningIn(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      });

      if (error) setError("Could not sign in with those credentials.");
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }

  async function signOut() {
    setError("");
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) setError("Could not sign out. Please try again.");
  }

  async function saveStatus(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    if (!isAdmin || savingId) return;

    const status = new FormData(event.currentTarget).get("status");
    if (typeof status !== "string" || !Object.hasOwn(statuses, status)) return;

    setSavingId(id);
    setError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ order_status: status })
        .eq("id", id)
        .select("id, order_status")
        .maybeSingle();

      if (error || !data) {
        setError("Could not save the order status.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, order_status: data.order_status } : order,
        ),
      );
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  const inputClass = "block rounded border px-3 py-2";
  const buttonClass =
    "rounded bg-orange-700 px-4 py-2 text-white disabled:opacity-60";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {isAdmin ? "Orders" : "Admin sign-in"}
        </h1>
        {session && (
          <button type="button" onClick={signOut} className="underline">
            Sign out
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}

      {checkingSession ? (
        <p className="mt-6">Checking your session…</p>
      ) : !session ? (
        <form onSubmit={signIn} className="mt-6 max-w-sm space-y-4">
          <label className="block">
            Email
            <input name="email" type="email" autoComplete="username"
              required className={`${inputClass} mt-1 w-full`} />
          </label>
          <label className="block">
            Password
            <input name="password" type="password" autoComplete="current-password"
              required className={`${inputClass} mt-1 w-full`} />
          </label>
          <button type="submit" disabled={signingIn} className={buttonClass}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : !isAdmin ? (
        <p className="mt-6">Access denied. Sign out and use your admin account.</p>
      ) : loadingOrders ? (
        <p className="mt-6">Loading orders…</p>
      ) : orders.length === 0 ? (
        !error && <p className="mt-6">No orders yet.</p>
      ) : (
        <ul className="mt-6 divide-y rounded-lg border">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap justify-between gap-4 p-4">
              <div>
                <p className="font-semibold">{order.customer_name}</p>
                <p>{order.customer_phone}</p>
                <p className="capitalize">
                  {order.fulfillment_type} · {currency.format(Number(order.total_price))}
                </p>
                <p>
                  Current status:{" "}
                  {statuses[order.order_status as keyof typeof statuses] ?? order.order_status}
                </p>
              </div>

              <form
                onSubmit={(event) => saveStatus(event, order.id)}
                className="flex flex-wrap items-end gap-2"
              >
                <label>
                  Status
                  <select
                    key={order.order_status}
                    name="status"
                    defaultValue={order.order_status}
                    className={inputClass}
                  >
                    {Object.entries(statuses).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" disabled={savingId !== null} className={buttonClass}>
                  {savingId === order.id ? "Saving…" : "Save status"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}