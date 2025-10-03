import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="">
      <Navbar />

      <div>
        <div>
          <h1 className="text-6xl">MISEZ SUR VOS ÉQUIPES, DEVENEZ UNE LÉGENDE</h1>
          <h2 className="text-xl">Paris E-Sport en direct, rapide et sécurisés.</h2>
        </div>
        <div>
          <button className="text-xl">Commencer à parier</button>
          <button className="text-xl">Voir les matchs</button>
        </div>
      </div>
    </body>
  );
}
