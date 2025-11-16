"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Navbar() {
  const [role, setRole] = useState<string>("user");

  const params = useParams();
  const rawLocale = typeof params?.locale === "string" ? params.locale : undefined;
  const locale = ["fr", "en", "ko"].includes(rawLocale || "") ? rawLocale! : "fr";

  const basePath = `/${locale}`;

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setRole(data.role ?? "user"))
      .catch(() => setRole("user"));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 relative h-auto">
      {/* Logo */}
      <div className="flex items-center justify-between w-1/12 relative h-10">
        <Link href={basePath} className="relative w-full h-full">
          <Image
            src="/logoBTL.ico"
            alt="Mon icône"
            fill
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-2/12" />

      {/* Navbar links */}
      <nav className="w-6/12 bg-[#111461]/30 rounded-xl px-6 py-3 flex justify-center space-x-16">
        <Link
          href={`${basePath}/matchs`}
          className="text-white text-lg font-medium hover:text-red-400 transition-colors"
        >
          Matchs
        </Link>

        <Link
          href={`${basePath}/results`}
          className="text-white text-lg font-medium hover:text-red-400 transition-colors"
        >
          Results
        </Link>

        <Link
          href={`${basePath}/about`}
          className="text-white text-lg font-medium hover:text-red-400 transition-colors"
        >
          About
        </Link>

        {role === "admin" && (
          <Link
            href={`${basePath}/admin`}
            className="text-red-400 text-lg font-bold hover:text-white transition-colors"
          >
            Gestion
          </Link>
        )}
      </nav>

      <div className="w-1/12" />

      {/* Auth buttons */}
      <div className="flex w-2/12 justify-center items-center gap-3">
        <SignedOut>
          <SignInButton>
            <button
              type="button"
              className="bg-[#2621BF] w-full text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 cursor-pointer hover:bg-[#3c36e0] transition-colors"
            >
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
