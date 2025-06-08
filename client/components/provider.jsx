'use client'
import { ThemeProvider } from "./theme-provider";

import { RecoilRoot } from "recoil";
export function Providers({ children, ...props }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <RecoilRoot>{children}</RecoilRoot>
    </ThemeProvider>
  );
}
