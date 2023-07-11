import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import LoadingDots from "./LoadingDots";
import useSWR from "swr";
import { useSession } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const fetcher = () => fetch("/api/remaining").then((res) => res.json());
  const { data, isLoading } = useSWR("/api/remaining", fetcher);
  const { status } = useSession();

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>captionator</title>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      {status === "authenticated" && !isLoading ? (
        <Header remaining={data.remaining} />
      ) : (
        <Header remaining={undefined} />
      )}

      <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 sm:mb-10 mt-10 mb-5">
        {!isLoading ? (
          children
        ) : (
          <button
            disabled
            className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 w-40"
          >
            <span className="my-auto">
              <LoadingDots color="white" />
            </span>
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}
