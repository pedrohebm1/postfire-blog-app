import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./styles/globals.css";

const roboto = Roboto({ weight: ["400","300", "100"], subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Postfire",
  description: "Blog site for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
