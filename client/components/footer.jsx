"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { DeveloperDialog } from "./developer-dialogue";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-brand"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            <span className="text-lg font-bold">Exclutch</span>
          </div>

          {/* Main Links */}
          <div className="flex items-center space-x-8">
            {/* WhatsApp Community */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center space-x-2"
            >
              <Link
                href="https://chat.whatsapp.com/ChPwEABIUbtEPqTHMH1KP4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>Join Community</span>
              </Link>
            </Button>

            {/* Communities Logos with Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/zero.devs/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                title="Community 1"
              >
                <img
                  src="/zerodev.png"
                  alt="Community 1"
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                />
              </a>
              <a
                href="https://www.instagram.com/webytes_srm/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
                title="Community 2"
              >
                <img
                  src="/webyteslogo.png"
                  alt="Community 2"
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                />
              </a>
            </div>

            {/* Developers */}
            <DeveloperDialog />
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Exclutch. Made with ❤️ for SRMUH
              students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
