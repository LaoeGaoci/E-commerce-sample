// app/layout.tsx
import type { Metadata } from "next";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { LocalInitWrapper } from './components/LocalInitWrapper';
import "./globals.scss";



export const metadata: Metadata = {
  title: "Mobile E-commerce App",
  description: "Built with Next.js and PrimeReact",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocalInitWrapper>
          <main className="pt-16 pb-16 bg-gray-50 min-h-screen">{children}</main>
        </LocalInitWrapper>
      </body>
    </html>
  );
}
