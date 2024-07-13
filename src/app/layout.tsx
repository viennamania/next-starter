import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

import { Toaster } from "react-hot-toast";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WEB3 Starter",
  description:
    "Starter for  WEB3 Wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ThirdwebProvider>
          <Toaster />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
