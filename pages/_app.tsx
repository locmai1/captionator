import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import "../styles/globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
