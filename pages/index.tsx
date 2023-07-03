import Head from "next/head";
import Image from "next/image";
import { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { OpenAIChatMessage } from "../types/openai";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import useSWR from "swr";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import LoginButton from "../components/LoginButton";
import copyToClipboard from "../utils/copyToClipboard";

// Configuration for the uploader
const uploader = Uploader({
  apiKey: process.env.UPLOADER_API_KEY ? process.env.UPLOADER_API_KEY : "free",
});
const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#000000", // Primary buttons & links
      active: "#000000cc", // Primary buttons & links (hover). Inferred if undefined.
      shade400: "#999999", // Welcome text
      shade600: "#999999", // Border
      shade700: "#ffffff", // Progress indicator background
      shade800: "#fafafa", // File item background
      shade900: "#ffffff", // Various (draggable crop buttons, etc.)
    },
  },
};

const Home: NextPage = () => {
  const fetcher = () => fetch("/api/remaining").then((res) => res.json());
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<OpenAIChatMessage[]>([]);
  const [guide, setGuide] = useState<boolean>(false);
  const { data, mutate, isLoading } = useSWR("/api/remaining", fetcher);
  const { status } = useSession();

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={async (file) => {
        if (file.length !== 0) {
          setPhoto(file[0].fileUrl);
          generatePhoto(file[0].fileUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    const response = await res.json();
    console.log(response);
    if (res.status !== 200) {
      setError(response.error);
    } else {
      setContext(response.context);
      setCaption(response.caption);
      mutate();
    }
    setLoading(false);
  }

  async function refreshCaption() {
    if (data.remaining == 0) {
      setPhoto(null);
      setCaption(null);
      setError(null);
    } else {
      setLoading(true);
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context: context }),
      });

      const response = await res.json();
      console.log(response);
      if (res.status !== 200) {
        setError(response.error);
      } else {
        setContext(response.context);
        setCaption(response.caption);
        mutate();
      }
      setLoading(false);
    }
  }

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
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 sm:mb-10 mt-10 mb-5">
        {!isLoading ? (
          <div className="flex justify-between items-center w-full flex-col">
            <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-7xl mb-7 sm:mb-20">
              Translating all photos{" "}
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#E1306C] to-[#833AB4]">
                using AI
              </span>{" "}
              into captions.
            </h1>
            {data.remaining == 0 && !photo && (
              <div
                className="mx-auto w-64 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">
                  Your generations will reset on{" "}
                  <span className="font-semibold">{data.reset}</span>
                </span>
              </div>
            )}
            {status === "authenticated" && !photo && data.remaining != 0 ? (
              <UploadDropZone />
            ) : (
              data.remaining != 0 && !photo && <LoginButton />
            )}
            {caption && photo && (
              <div className="flex flex-col h-full">
                <div>
                  <p className="mx-auto w-72 sm:w-96 text-xs sm:text-base leading-7 text-slate-500 sm:mb-2">
                    Click{" "}
                    <span
                      className="relative font-bold underline cursor-pointer"
                      onClick={() => refreshCaption()}
                    >
                      here
                    </span>{" "}
                    to generate a new caption below.
                  </p>
                  <button
                    className="relative group border border-dashed border-black rounded-lg w-72 sm:w-96 p-3 items-center mb-4"
                    onMouseEnter={() => setGuide(true)}
                    onMouseLeave={() => setGuide(false)}
                    onClick={() => {
                      copyToClipboard(caption, setCaption);
                      setGuide(false);
                    }}
                  >
                    {loading ? (
                      <LoadingDots color="black" />
                    ) : (
                      <>
                        {guide && (
                          <span className="absolute -top-1/4 w-44 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-2 text-xs transition-opacity duration-300 rounded-md">
                            Click to copy to clipboard
                          </span>
                        )}
                        <h2 className="font-medium text-sm sm:text-lg">
                          {caption}
                        </h2>
                      </>
                    )}
                  </button>
                  <Image
                    alt="photo"
                    src={photo}
                    className="mx-auto rounded-2xl max-w-[300px] sm:max-w-[500px] shadow-lg"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            )}
            {loading && !caption && (
              <button
                disabled
                className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 w-40"
              >
                <span className="pt-4">
                  <LoadingDots color="white" />
                </span>
              </button>
            )}
            <div className="flex space-x-2 justify-center">
              {photo && !loading && !error && (
                <button
                  onClick={() => {
                    setPhoto(null);
                    setCaption(null);
                    setError(null);
                  }}
                  className="bg-black rounded-full text-white font-medium px-4 py-2 hover:bg-black/80 transition mt-6"
                >
                  Upload New Photo
                </button>
              )}
            </div>
            {error && (
              <div>
                <div
                  className="mx-auto w-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
                <p className="mx-auto sm:w-96 text-slate-500 leading-7 mt-1">
                  Click{" "}
                  <button
                    className="relative font-bold underline"
                    onClick={() => {
                      setPhoto(null);
                      setCaption(null);
                      setError(null);
                    }}
                  >
                    here
                  </button>{" "}
                  to retry
                </p>
              </div>
            )}
          </div>
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
      </main>
      <Footer />
    </div>
  );
};

export default Home;
