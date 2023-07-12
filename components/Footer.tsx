import { Dispatch, SetStateAction } from "react";

export default function Footer({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t border-black/20 flex sm:flex-row flex-col justify-between items-center px-3 sm:mb-0 mb-3 max-w-6xl">
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
        className="text-center mt-2 sm:mt-0 underline"
        onClick={() => setShowModal(true)}
      >
        Submit Feedback
      </button>
    </footer>
  );
}
