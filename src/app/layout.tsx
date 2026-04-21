import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damin Hub - Admin Workspace",
  description: "Your personal link management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
