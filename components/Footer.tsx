import { Dispatch, SetStateAction } from "react";

export default function Footer({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t border-black/20 flex sm:flex-row flex-col justify-between items-center px-3 sm:mb-0 mb-5 max-w-6xl">
      <div>
        Powered by{" "}
        <a
          href="https://upload.io/"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition underline-offset-2"
        >
          Upload
        </a>
        ,{" "}
        <a
          href="https://huggingface.co/"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition underline-offset-2"
        >
          Hugging Face
        </a>
        , &{" "}
        <a
          href="https://openai.com/blog/openai-api"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline transition underline-offset-2"
        >
          OpenAI
        </a>
        .
      </div>
      <button
        className="mt-2 sm:mt-0 px-3 py-0 sm:py-1 inline-flex justify-center items-center rounded-md border-2 border-black font-semibold text-black hover:text-white hover:bg-black hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all text-md"
        onClick={() => setShowModal(true)}
      >
        Contact
      </button>
    </footer>
  );
}
