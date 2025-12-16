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
    <div className="container mx-auto px-6 lg:px-16 py-8 lg:py-12">
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


