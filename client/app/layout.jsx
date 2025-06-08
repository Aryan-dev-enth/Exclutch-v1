import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider";
import { AuthContextProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NotesProvider } from "@/context/NotesContext";
import ApiStatusFloater from "@/components/api-floater";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Exclutch - SRM University Delhi-NCR",
  description: "A platform for SRM University Delhi-NCR, Sonepat students to share and access study materials, notes, and resources for better learning and collaboration.",
  openGraph: {
    title: "SRM Study Material Sharing Platform - SRM University Delhi-NCR",
    description: "A platform for SRM University Delhi-NCR, Sonepat students to share and access study materials, notes, and resources for better learning and collaboration.",
    url: "https://exclutch.vercel.app/", // Replace with actual URL
    siteName: "SRM Study Material Sharing Platform",
    images: [
      {
        url: "/exclutch.png", // Replace with a relevant image for the platform
        width: 800,
        height: 600,
        alt: "SRM Study Material Sharing Platform Logo",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ff6600" /> {/* Match your platform's theme */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthContextProvider>
            <NotesProvider>
              <div className="flex min-h-screen flex-col overflow-x-hidden">
                <Navbar />
                <main className="flex-1">
                  <Toaster/>
                  {children}
                  <ApiStatusFloater />
                </main>
                <Footer />
              </div>
            </NotesProvider>
          </AuthContextProvider>
        </Providers>
      </body>
    </html>
  );
}
