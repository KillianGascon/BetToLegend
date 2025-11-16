// components/matchs/UserHeader.tsx
"use client";

export default function UserHeader({
  displayName,
  balance,
  copy = {
    greetingWithName: "Bonjour, {name} !",
    welcome: "Bienvenue sur BetToLegend",
    balanceLabel: "Solde disponible",
    currencySuffix: "€",
  },
}: Readonly<{
  displayName?: string;
  balance: number;
  copy?: {
    greetingWithName: string; // contains {name}
    welcome: string;
    balanceLabel: string;
    currencySuffix: string;
  };
}>) {
  const greeting = copy.greetingWithName.replace("{name}", displayName || "");
  return (
    <div className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{greeting}</h1>
            <p className="text-gray-300">{copy.welcome}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{copy.balanceLabel}</p>
            <p className="text-2xl font-bold text-green-400">
              {Number(balance).toFixed(2)}
              {copy.currencySuffix}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


