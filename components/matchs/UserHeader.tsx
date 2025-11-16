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
    <div className="container mx-auto px-6 lg:px-16 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2">
          <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white">
            {greeting}
          </h1>
          <p className="text-white/80 font-montserrat text-base sm:text-lg lg:text-xl">
            {copy.welcome}
          </p>
        </div>
        <div className="text-left sm:text-right bg-legend-blue/20 border-2 border-legend-blue rounded-[12px] px-6 py-4 sm:px-8 sm:py-5">
          <p className="text-sm sm:text-base text-white/70 font-montserrat mb-1">
            {copy.balanceLabel}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-extrabold text-legend-red">
            {Number(balance).toFixed(2)}
            {copy.currencySuffix}
          </p>
        </div>
      </div>
    </div>
  );
}


