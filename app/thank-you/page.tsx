import Link from "next/link";

export const instant = false;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const { id } = await searchParams;

  const orderId =
    typeof id === "string" &&
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)
      ? id
      : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Thank you!</h1>

      {orderId ? (
        <>
          <p className="mt-4 font-semibold">Your Order Number is:</p>
          <p className="mt-2 break-all rounded bg-gray-100 p-3 font-mono">
            {orderId}
          </p>
          <p className="mt-2 text-sm">Save this number to track your order.</p>
        </>
      ) : (
        <p className="mt-4">No order number was provided.</p>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <Link href="/track" className="font-semibold text-orange-700 underline">
          Track your order
        </Link>
        <Link href="/" className="underline">
          Back to the menu
        </Link>
      </div>
    </main>
  );
}