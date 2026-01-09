import "./globals.css";
import {ReactNode} from "react";
import {Metadata} from "next";
import {MatrixProvider} from "@/context/MatrixContext";

export const metadata: Metadata = {
  title: "Matrix Test Task",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
    <body className="min-h-screen text-white">
    <MatrixProvider>{children}</MatrixProvider>
    </body>
    </html>
  );
}
