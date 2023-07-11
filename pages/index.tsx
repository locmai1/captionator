import { NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UploadDropzone } from "react-uploader";
import { OpenAIChatMessage } from "../utils/types";
import { uploader, options } from "../utils/uploader";
import copyToClipboard from "../utils/copy";
import LoadingDots from "../components/LoadingDots";
import LoginButton from "../components/LoginButton";
import UploadedPhotos from "../components/UploadedPhotos";
import useSWR from "swr";

const Home: NextPage = () => {
  const fetcher = () => fetch("/api/remaining").then((res) => res.json());
  const { data, mutate } = useSWR("/api/remaining", fetcher);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<OpenAIChatMessage[]>([]);
  const [guide, setGuide] = useState<boolean>(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const { status } = useSession();

  const UploadDropZone: React.FC = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={async (files) => {
        if (files.length !== 0) {
          const urls = files.map((file) => file.fileUrl);
          setFileUrls(urls);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generateCaption() {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrls: fileUrls }),
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
      setFileUrls([]);
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
    <main className="flex justify-between items-center w-full flex-col">
      <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-7xl mb-7 sm:mb-20">
        Translating all photos{" "}
        <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#E1306C] to-[#833AB4]">
          using AI
        </span>{" "}
        into captions.
      </h1>
      {data.remaining == 0 && !caption && (
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
      {status === "authenticated" && data.remaining != 0 ? (
        fileUrls.length == 0 ? (
          <UploadDropZone />
        ) : (
          !caption &&
          !loading &&
          !error && (
            <div>
              <UploadedPhotos
                fileUrls={fileUrls}
                setFileUrls={setFileUrls}
                remove={true}
              />
              <button
                className="bg-black rounded-full text-white font-medium px-4 py-2 hover:bg-black/80 transition mt-6"
                onClick={() => generateCaption()}
              >
                Generate Caption
              </button>
            </div>
          )
        )
      ) : (
        data.remaining != 0 && <LoginButton />
      )}
      {caption && (
        <div className="flex flex-col h-full">
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
            className="relative group border border-dashed border-black rounded-lg w-72 sm:w-96 p-3 items-center mb-4 mx-auto"
            onMouseEnter={() => setGuide(true)}
            onMouseLeave={() => setGuide(false)}
            onClick={() => {
              !loading && copyToClipboard(caption, setCaption);
              !loading && setGuide(false);
            }}
          >
            {guide && !loading && (
              <span className="absolute -top-4 w-44 transform -translate-x-1/2 bg-black/70 text-white p-2 text-xs transition-opacity duration-300 rounded-md">
                Click to copy to clipboard
              </span>
            )}
            {loading ? (
              <LoadingDots color="black" />
            ) : (
              <h2 className="font-medium text-sm sm:text-lg">{caption}</h2>
            )}
          </button>
          <UploadedPhotos
            fileUrls={fileUrls}
            setFileUrls={setFileUrls}
            remove={false}
          />
          {!loading && (
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => {
                  setFileUrls([]);
                  setCaption(null);
                  setError(null);
                }}
                className="bg-black rounded-full text-white font-medium px-4 py-2 hover:bg-black/80 transition mt-6"
              >
                Upload New Photos
              </button>
            </div>
          )}
        </div>
      )}
      {loading && (
        <button
          disabled
          className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 w-40 mt-6"
        >
          <span className="pt-4">
            <LoadingDots color="white" />
          </span>
        </button>
      )}
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
                setFileUrls([]);
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
    </main>
  );
};

export default Home;
