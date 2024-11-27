import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/UI/Navbar/Navbar";
import { metadata } from "@/components/Metadata";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="pt-16">{children}</main> {/* Skapa utrymme för navbar */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
