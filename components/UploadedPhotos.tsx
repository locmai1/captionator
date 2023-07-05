import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

type UploadedPhotosProps = {
  fileUrls: string[];
  setFileUrls: Dispatch<SetStateAction<string[]>>;
  remove: boolean;
};

const DeleteIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-80"
    >
      <path
        d="M5 6H19L18.1245 19.133C18.0544 20.1836 17.1818 21 16.1289 21H7.87111C6.81818 21 5.94558 20.1836 5.87554 19.133L5 6Z"
        stroke="red"
        strokeWidth="2"
      />
      <path
        d="M9 6V3H15V6"
        stroke="red"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M3 6H21" stroke="red" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 10V17" stroke="red" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10V17" stroke="red" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const UploadedPhotos: React.FC<UploadedPhotosProps> = ({
  fileUrls,
  setFileUrls,
  remove,
}) => {
  const handleRemove = (index: number) => {
    const updatedUrls = [...fileUrls];
    updatedUrls.splice(index, 1);
    setFileUrls(updatedUrls);
  };

  return (
    <div className="flex flex-col gap-4">
      {fileUrls.map((fileUrl: string, i: number) => (
        <div className="relative" key={i}>
          <Image
            alt="photo"
            src={fileUrl}
            className="mx-auto rounded-2xl max-w-[300px] sm:max-w-[500px] shadow-lg"
            width={500}
            height={500}
          />
          {remove && (
            <button
              className="absolute top-1 right-1 text-black/80 rounded-full p-2"
              onClick={() => handleRemove(i)}
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadedPhotos;
