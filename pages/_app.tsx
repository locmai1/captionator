import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="bg-[#f5f5f5]">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
