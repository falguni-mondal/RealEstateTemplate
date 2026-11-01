import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Aurelia Estates | Modern Flats & Land Plots in Durgapur",
  description:
    "Spacious 1, 2 & 3 BHK residences and gated residential plots in City Centre and Bidhannagar, Durgapur.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="bg-white font-sans font-normal text-ink antialiased selection:bg-accent selection:text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}