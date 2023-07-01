export default function Button({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="my-2 py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-black font-semibold text-black hover:text-white hover:bg-black hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all text-md"
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  );
}
