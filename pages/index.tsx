import Head from "next/head";
import Image from "next/image";
import { NextPage } from "next";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import useSWR from "swr";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import GoogleIcon from "../components/GoogleIcon";
import copyToClipboard from "../utils/copyToClipboard";
import { OpenAIChatMessage } from "../types/OpenAI";

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
    if (res.status !== 200) {
      setError(response.error);
    } else {
      setContext(response.context);
      setCaption(response.caption);
      mutate();
    }
    setLoading(false);
    console.log(response);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>captionator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
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
              <>
                <p className="text-slate-500">
                  You have{" "}
                  <span className="font-semibold">
                    {data.remaining} generations
                  </span>{" "}
                  left today.
                </p>
                <UploadDropZone />
              </>
            ) : (
              data.remaining != 0 &&
              !photo && (
                <Button
                  text="Sign in with Google"
                  icon={<GoogleIcon />}
                  onClick={() => signIn("google")}
                />
              )
            )}
            {caption && photo && (
              <div className="flex flex-col h-full">
                <div>
                  <p className="mx-auto w-72 sm:w-96 text-xs sm:text-base text-slate-500 leading-7 sm:mb-1">
                    Click on the{" "}
                    <span className="relative font-bold">caption</span> below to
                    copy it to clipboard
                  </p>
                  <button
                    className="border border-dashed border-black rounded-lg w-72 sm:w-96 p-2 h-14 sm:h-20 mb-4"
                    onClick={() => copyToClipboard(caption, setCaption)}
                  >
                    <h2 className="font-medium text-sm sm:text-lg">
                      {caption}
                    </h2>
                  </button>
                  <Image
                    alt="photo"
                    src={photo}
                    className="rounded-2xl max-w-[300px] sm:max-w-[500px] shadow-lg"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            )}
            {loading && (
              <button
                disabled
                className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 hover:bg-black/80 w-40"
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
            className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 hover:bg-black/80 w-40"
          >
            <span className="pt-4">
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
