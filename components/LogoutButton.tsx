import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut()}>
      <svg
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="sm:w-14 sm:h-14 w-9 h-9 p-1 sm:p-2"
      >
        <path d="M17 16l4-4m0 0l-4-4 m4 4h-14m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"></path>
      </svg>
    </button>
  );
}
