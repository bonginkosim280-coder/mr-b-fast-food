import Link from "next/link";

export const instant = false;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[]; total?: string | string[] }>;
}) {
  const { id, total } = await searchParams;

  const orderId =
    typeof id === "string" &&
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)
      ? id
      : null;

  const orderTotal = typeof total === "string" ? total : "0.00";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-green-600">Thank you!</h1>
      <p className="mt-2 text-lg">We have received your order.</p>

      {orderId ? (
        <div className="mt-8 rounded-lg border-2 border-green-200 bg-green-50 p-6 text-left shadow-sm">
          
          {/* ORDER NUMBER BOX */}
          <div className="mb-8 rounded bg-white p-4 border border-gray-200 shadow-sm text-center">
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Your Order Number</p>
            <p className="text-xl font-mono font-bold text-gray-800 break-all">{orderId}</p>
            <p className="text-xs text-gray-500 mt-2">Please take a screenshot or copy this number to track your order later.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Complete your payment</h2>
          
          <div className="mb-6 text-gray-700 space-y-3">
            <p className="font-semibold text-lg">Please follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-2 text-base">
              <li>Click the blue button below.</li>
              <li>
                Enter the exact amount: 
                <strong className="ml-2 text-xl text-gray-900 bg-yellow-200 px-3 py-1 rounded">
                  R{orderTotal}
                </strong>
              </li>
              <li>Complete the payment securely with your card.</li>
            </ol>
          </div>

          <a 
            href="https://pay.yoco.com/mr-b-fast-food" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center rounded-md bg-[#00A3FF] px-4 py-4 font-bold text-white hover:bg-blue-600 transition text-xl shadow-md"
          >
            Pay R{orderTotal} Now
          </a>
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            You will be redirected to Yoco to complete your secure payment.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-red-600">No order number was provided.</p>
      )}

      <div className="mt-8 flex justify-center gap-6">
        <Link href="/track" className="font-semibold text-orange-700 underline text-lg">
          Track your order
        </Link>
        <Link href="/" className="underline text-lg">
          Back to the menu
        </Link>
      </div>
    </main>
  );
}