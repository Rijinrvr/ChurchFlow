"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        // Next.js 16 / React 19: suppress "script tag in component" warning.
        // type="text/javascript" on the server (runs for FOUC prevention),
        // type="text/plain" on the client (React ignores non-executable scripts).
        // suppressHydrationWarning handles the type attribute mismatch.
        type:
          typeof window === "undefined" ? "text/javascript" : "text/plain",
        suppressHydrationWarning: true,
      }}
    >
      {children}
    </NextThemesProvider>
  )
}

