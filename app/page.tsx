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
          <h1>MISEZ SUR VOS ÉQUIPES, DEVENEZ UNE LÉGENDE</h1>
          <h2>Paris E-Sport en direct, rapide et sécurisés.</h2>
        </div>
        <div>
          <button>Commencer à parier</button>
          <button>Voir les matchs</button>
        </div>
      </div>
    </body>
  );
}
