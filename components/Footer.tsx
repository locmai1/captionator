export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t border-black/20 flex sm:flex-row flex-col justify-between items-center px-3 space-y-2 sm:mb-0 mb-3">
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
    </footer>
  );
}
