import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "./Button";

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
      {session && session.user && (
        <Button text="Logout" icon={null} onClick={() => signOut()} />
      )}
    </header>
  );
}
