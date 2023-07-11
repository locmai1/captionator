import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
// import Script from "next/script";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      {/* <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}');
          `}
      </Script> */}

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
