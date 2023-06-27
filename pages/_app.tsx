import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="bg-[#f5f5f5]">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
