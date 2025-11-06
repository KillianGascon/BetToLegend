// app/results/page.tsx
import Navbar from "@/components/Navbar";
import { MatchCard, EmptyState, SmartMatchesView } from "@/components/results";
import { toView } from "@/utils/results";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { RawMatch, ViewMatch } from "@/types/results";

export const metadata: Metadata = { title: "Résultats" };

// ----- Server helpers -----
async function fetchMatches(): Promise<ViewMatch[]> {
  // Construct absolute URL for server-side fetch
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
  
  const res = await fetch(`${baseUrl}/api/matches`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/matches failed: ${res.status}`);
  const data = (await res.json()) as RawMatch[];
  return data.map(toView).sort((a, b) => {
    const ta = a.date?.getTime() ?? 0;
    const tb = b.date?.getTime() ?? 0;
    return tb - ta; // desc
  });
}

// ----- Server component -----
export default async function ResultsPage() {
  const matches = await fetchMatches();

  const top3 = matches.slice(0, 3);
  const remaining = matches.slice(3);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold">Résultats</h1>
          <p className="text-gray-400 text-sm">Les 3 derniers matchs + vue intelligente (carousel / calendrier / liste).</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* TOP 3 */}
        <section aria-label="Trois derniers matchs" className="space-y-4">
          <h2 className="text-lg font-semibold">Derniers matchs</h2>
          {top3.length === 0 ? (
            <EmptyState label="Aucun match pour le moment." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </section>

        {/* DECISION VIEW */}
        <section aria-label="Vue intelligente">
          <SmartMatchesView matches={remaining} />
        </section>
      </main>
    </div>
  );
}
