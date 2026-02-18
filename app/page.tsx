import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div>Preferred</div>
      <Link
        href="/option10"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 10 Page
      </Link>


      <Link
        href="/option9"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 9 Page
      </Link>

      <Link
        href="/option11"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 11 Page
      </Link>

      <Link
        href="/game"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Play Skip Roo Runner
      </Link>

      <Link
        href="/button-demo"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        View Animated Caret Button Demo
      </Link>

      <div>other options</div>
      <Link
        href="/option8"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 8 Page
      </Link>
      <Link
        href="/option1"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 1 Page
      </Link>
      
      <Link
        href="/option12"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 12 Page
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
      <Link
        href="/option4"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 4 Page
      </Link>
      <Link
        href="/option5"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 5 Page
      </Link>
      <Link
        href="/option6"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 6 Page
      </Link>
      <Link
        href="/option7"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 7 Page
      </Link>
      <Link
        href="/option14"
        className="text-lg text-blue-600 underline hover:text-blue-800"
      >
        Go to Option 14 Page
      </Link>
    </main>
  );
}
