import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-brand">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              <span className="text-lg font-bold">Exclutch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate platform for sharing and discovering high-quality study notes.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Github">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/notes" className="text-muted-foreground hover:text-foreground">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-muted-foreground hover:text-foreground">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-muted-foreground hover:text-foreground">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-foreground">
                  Give Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 md:flex md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Exclutch. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

