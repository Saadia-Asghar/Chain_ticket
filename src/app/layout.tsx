

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChainTicket+",
    description: "Pakistan’s On-Chain Anti-Fraud Ticketing Protocol",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <Providers>
                    <Navbar />
                    <div className="flex-grow">
                        {children}
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
