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
        <button
          className="text-xl text-red-500 place-self-end"
          onClick={() => onClose()}
        >
          X
        </button>
        <div className="bg-white p-4 rounded">{children}</div>
      </div>
    </div>
  );
}
