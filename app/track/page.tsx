"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  cooking: "Cooking",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function TrackPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function trackOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    const id = String(form.get("orderId") ?? "").trim();

    setBusy(true);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || typeof result?.status !== "string") {
        setError(result?.error ?? "Could not check the order. Please try again.");
        return;
      }

      setStatus(statusLabels[result.status] ?? result.status);
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-3xl font-bold">Track your order</h1>
      <p className="mt-2">Enter the order number from your confirmation page.</p>

      <form onSubmit={trackOrder} className="mt-6 space-y-4">
        <label className="block">
          Order number
          <input
            name="orderId"
            type="text"
            required
            disabled={busy}
            spellCheck={false}
            autoCapitalize="none"
            className="mt-1 block w-full rounded border px-3 py-2 font-mono"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded bg-orange-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Checking…" : "Track"}
        </button>
      </form>

      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {status && (
        <p role="status" className="mt-4 rounded bg-gray-100 p-4">
          Current status: <strong>{status}</strong>
        </p>
      )}

      <Link href="/" className="mt-6 inline-block underline">
        Back to the menu
      </Link>
    </main>
  );
}