import Link from "next/link";

export const instant = false;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[], total?: string | string[] }>;
}) {
  const { id, total } = await searchParams;

  const orderId =
    typeof id === "string" &&
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)
      ? id
      : null;

  const orderTotal = typeof total === "string" ? total : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-green-600">Thank you!</h1>
      <p className="mt-2 text-lg">We have received your order.</p>

      {orderId ? (
        <div className="mt-8 rounded-lg border-2 border-green-200 bg-green-50 p-6 text-left shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete your payment</h2>
          
          <p className="mb-4 text-gray-700">
            Please click the button below to pay securely with your card.
            {orderTotal && (
              <span className="block mt-2 font-bold text-xl text-gray-900">
                Amount to pay: R{orderTotal}
              </span>
            )}
          </p>

          <a 
            href="https://pay.yoco.com/mr-b-fast-food" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center rounded-md bg-[#00A3FF] px-4 py-3 font-bold text-white hover:bg-blue-600 transition text-lg shadow-md"
          >
            Pay Now with Card
          </a>
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            You will be redirected to Yoco to complete your secure payment.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-red-600">No order number was provided.</p>
      )}

      <div className="mt-8 flex justify-center gap-6">
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