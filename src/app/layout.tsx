import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/provider";
import Setup from "@/components/utils/Setup";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata = {
    title: 'eCEP - Plateforme d\'apprentissage CM2',
    description: 'Plateforme d\'apprentissage interactive pour les élèves de CM2',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider>
                        <Setup />
                        <Header />
                        {children}
                        <ThemeToggle />
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
            `
        </Provider>
    );
}
