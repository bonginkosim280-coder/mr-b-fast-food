import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Thank you!</h1>
      <p className="mt-3">We've received your order.</p>
      <Link href="/" className="mt-6 inline-block font-semibold underline">
        Back to the menu
      </Link>
    </main>
  );
}