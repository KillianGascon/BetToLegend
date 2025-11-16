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
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{copy.title}</h1>
        <p className="text-gray-300 mb-6">{copy.description}</p>
        <ClerkProvider>
          <SignedOut>
            <SignInButton>
              <button
                type="button"
                className="bg-[#2621BF] w-full text-white rounded-xl font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 cursor-pointer hover:bg-[#3c36e0] transition-colors"
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


