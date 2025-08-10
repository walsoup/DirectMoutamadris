import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Direct Moutamadris",
  description: "Comprehensive MoutaMadris student portal - access grades, attendance, schedule, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
