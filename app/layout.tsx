import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
// import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Mystery Hack - Gravity Falls Hackathon",
  description: "A mysterious hackathon inspired by Gravity Falls",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black flex justify-center items-center mx-auto">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

