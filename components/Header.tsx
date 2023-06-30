import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center h-16 w-full mt-5 border-b border-black/20 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/headerIcon.png"
          className="sm:w-14 sm:h-14 w-9 h-9"
          width={36}
          height={36}
        />
        <h1 className="sm:text-5xl text-3xl font-bold ml-2 tracking-tight">
          captionator
        </h1>
      </Link>
      {session && (
        <button
          type="button"
          className="my-2 py-3 px-6 inline-flex justify-center items-center gap-2 rounded-md border-2 border-black/80 font-semibold text-black hover:text-white hover:bg-black/80 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all text-md"
          onClick={() => signOut()}
        >
          Logout
        </button>
      )}
    </header>
  );
}
