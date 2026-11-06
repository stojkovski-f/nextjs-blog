import Image from "next/image";

export const aboutCtaClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-900";

export function PayPalLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#003087"
        d="M18.92 8.17C17.7 6.72 15.6 6 12.86 6H7.62c-.7 0-1.3.5-1.41 1.2L3.5 21.17c-.08.5.3.96.8.96h3.42l.86-5.46.03-.16c.1-.7.7-1.2 1.41-1.2h1.64c3.96 0 7.06-1.61 7.97-6.27.03-.14.05-.28.08-.42.4-2.1-.1-3.67-1.79-4.45z"
      />
      <path
        fill="#009cde"
        d="M19.86 7.05c-.22-.06-.45-.12-.7-.16.9 1.29 1.08 3.13.5 5.42-.86 4.4-3.75 6-7.43 6h-1.87l-.84 5.32h3.26c.5 0 .92-.36 1-.85l.02-.13.7-4.42.05-.24c.09-.49.51-.85 1.01-.85h.4c3.22 0 5.74-1.31 6.48-5.1.3-1.57.14-2.9-.46-3.8-.27-.42-.64-.77-1.12-1.04z"
      />
      <path
        fill="#012169"
        d="M8.55 8.17c.12-.7.71-1.2 1.42-1.2h5.54c.9 0 1.66.12 2.27.37-1.22-1.45-3.32-2.17-6.06-2.17H7.48c-.7 0-1.3.5-1.41 1.2L3.36 20.34h3.26l1.93-12.17z"
      />
    </svg>
  );
}

export function SwishLogo() {
  return (
    <Image
      src="/swish-logo.png"
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 shrink-0 rounded-[3px]"
    />
  );
}
