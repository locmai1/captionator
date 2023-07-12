import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import LoadingDots from "./LoadingDots";

const Remaining = ({ generations }: { generations: number | undefined }) => {
  return (
    <p className="text-slate-500 mr-1 sm:text-base text-xs">
      You have <span className="font-semibold">{generations} generations</span>{" "}
      left today
    </p>
  );
};

export default function Header({
  remaining,
}: {
  remaining: number | undefined;
}) {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center h-16 w-full mt-5 border-b border-black/20 pb-7 sm:px-4 px-2 max-w-6xl">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/headerIcon.png"
          className="sm:w-14 sm:h-14 w-9 h-9"
          width={36}
          height={36}
        />
        <h1 className="text-5xl hidden sm:inline-flex font-bold ml-2 tracking-tight">
          captionator
        </h1>
      </Link>
      {session && session.user && (
        <div className="flex flex-row items-center">
          {!remaining && remaining != 0 ? (
            <LoadingDots color="black" />
          ) : remaining != 0 ? (
            <Remaining generations={remaining} />
          ) : (
            <Remaining generations={0} />
          )}
          <LogoutButton />
        </div>
      )}
    </header>
  );
}
