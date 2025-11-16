// components/matchs/SignInPrompt.tsx
"use client";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function SignInPrompt({
  copy = {
    title: "Connexion requise",
    description: "Vous devez être connecté pour accéder aux matchs et placer des paris.",
    signIn: "Sign In",
  },
}: Readonly<{ copy?: { title: string; description: string; signIn: string } }>) {
  return (
    <div className="container mx-auto px-6 lg:px-16 h-full flex items-center justify-center">
      <div className="text-center space-y-6 lg:space-y-8 max-w-2xl">
        <div className="space-y-4 lg:space-y-6">
          <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {copy.title}
          </h1>
          <p className="text-white/80 font-montserrat text-lg sm:text-xl lg:text-2xl">
            {copy.description}
          </p>
        </div>
        <ClerkProvider>
          <SignedOut>
            <SignInButton>
              <button
                type="button"
                className="px-6 lg:px-8 py-3 lg:py-4 rounded-[12px] bg-legend-red text-white font-montserrat font-medium text-base sm:text-lg lg:text-xl hover:bg-legend-red/80 duration-200 hover:scale-105 active:scale-95 transition-transform"
              >
                {copy.signIn}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkProvider>
      </div>
    </div>
  );
}


