import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Link
        href="/original"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Original Page
      </Link>
      <Link
        href="/option1"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 1 Page
      </Link>
      <Link
        href="/option2"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 2 Page
      </Link> 
      <Link
        href="/option3"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 3 Page
      </Link>
    </main>
  );
}
