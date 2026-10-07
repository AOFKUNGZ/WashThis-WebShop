import type { Metadata } from "next";
import { auth } from "@/auth";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudsap Laundry | ระบบจองเครื่องซักผ้า",
  description: "Modern laundromat booking system",
};

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  return (
    <html
      lang="th"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
