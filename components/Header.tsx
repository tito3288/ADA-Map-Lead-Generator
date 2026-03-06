"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `transition-colors hover:text-white ${
      pathname === href ? "text-white" : "text-zinc-400"
    }`;

  return (
    <header className="border-b border-zinc-800 px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <Image
            src="/ada-logo.png"
            alt="Alphadog Agency"
            width={200}
            height={56}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>
        <nav className="flex gap-4 text-sm sm:gap-6 sm:text-base">
          <Link href="/bookmarks" className={linkClass("/bookmarks")}>
            Bookmarks
          </Link>
          <Link href="/history" className={linkClass("/history")}>
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
