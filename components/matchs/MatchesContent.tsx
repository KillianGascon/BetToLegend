// components/matchs/MatchesContent.tsx
"use client";
import { MatchList } from ".";

export default function MatchesContent({
  userBalance,
  onBalanceUpdate,
  listCopy,
  cardCopy,
  betModalCopy,
  locale,
}: Readonly<{
  userBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
  listCopy?: any;
  cardCopy?: any;
  betModalCopy?: any;
  locale?: string;
}>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MatchList
        userBalance={userBalance}
        onBalanceUpdate={onBalanceUpdate}
        copy={listCopy}
        cardCopy={cardCopy}
        betModalCopy={betModalCopy}
        locale={locale}
      />
    </div>
  );
}


