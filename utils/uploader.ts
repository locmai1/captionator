import { Uploader } from "uploader";

export const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOADER_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOADER_API_KEY
    : "free",
});

export const options = {
  maxFileCount: 5,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  multi: true,
  styles: {
    colors: {
      primary: "#000000",
      active: "#000000cc",
      shade400: "#999999",
      shade600: "#999999",
      shade700: "#ffffff",
      shade800: "#ffffff",
      shade900: "#ffffff",
    },
  },
};
