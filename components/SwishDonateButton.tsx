"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { aboutCtaClassName, SwishLogo } from "@/components/BrandIcons";

export const SWISH_DONATE_URL =
  "https://app.swish.nu/1/p/sw/?sw=0704367665&amt=50&cur=SEK&msg=bostadsklokDontaion&edit=amt&src=qr";

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SwishDonateButton() {
  const t = useTranslations("about");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobileDevice()) return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a
        href={SWISH_DONATE_URL}
        onClick={handleClick}
        className={aboutCtaClassName}
      >
        <SwishLogo />
        {t("donateSwishCta")}
      </a>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[calc(100vh-2rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id={titleId}
                className="text-lg font-semibold text-stone-900"
              >
                {t("donateSwishDialogTitle")}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              >
                {t("donateSwishClose")}
              </button>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              {t("donateSwishDialogHint")}
            </p>
            <Image
              src="/swish-donate-qr.png"
              alt={t("donateSwishQrAlt")}
              width={625}
              height={945}
              className="mt-4 mx-auto h-auto w-full"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
