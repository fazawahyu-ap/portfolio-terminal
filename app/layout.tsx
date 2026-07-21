import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

// Font untuk tampilan web utama
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Font monospace untuk kesan terminal (opsional)
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Faza Wahyu Adi Putra | Terminal Portfolio",
  description: "Portofolio interaktif milik Faza Wahyu Adi Putra, mahasiswa D3 Teknik Informatika UDINUS. Menampilkan karya dan keahlian di bidang Web Development serta Infrastruktur Jaringan.",
  keywords: ["Faza Wahyu Adi Putra", "Portfolio", "Web Developer", "Network Engineer", "Next.js", "Terminal Portfolio"],
  openGraph: {
    title: "Faza_OS | Faza Wahyu Adi Putra",
    description: "Interactive macOS Terminal Portfolio.",
    url: "https://faza-dev.vercel.app/",
    siteName: "Faza Portfolio",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}