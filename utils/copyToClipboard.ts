import { Dispatch, SetStateAction } from "react";

export default function copyToClipboard(
  caption: string,
  setCaption: Dispatch<SetStateAction<string | null>>
) {
  navigator.clipboard.writeText(caption);
  setCaption("copied");
  setTimeout(() => setCaption(caption), 2000);
}
