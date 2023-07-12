import React from "react";

export default function Modal({
  isVisible,
  onClose,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex jusitfy-center items-center z-50">
      <div className="m-auto flex flex-col">
        <button className="place-self-end" onClick={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#F44336"
              d="M21.5 4.5H26.501V43.5H21.5z"
              transform="rotate(45.001 24 24)"
            />
            <path
              fill="#F44336"
              d="M21.5 4.5H26.5V43.501H21.5z"
              transform="rotate(135.008 24 24)"
            />
          </svg>
        </button>
        <div className="bg-white p-6 rounded-md">{children}</div>
      </div>
    </div>
  );
}
