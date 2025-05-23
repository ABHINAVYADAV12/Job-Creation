import type { Metadata } from "next";
import{Poppins} from "next/font/google"
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import Toastprovider from "@/providers/toast-provider";
const poppins=Poppins({
  subsets :["latin"],
  weight :["100","200","300","400","500","600","700","800","900"],
})
export const metadata: Metadata = {
  title: "Online Job Portal",
  description: "Create job portal application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={poppins.className} >
        {children}
        <Toastprovider/>
      </body>
    </html>
    </ClerkProvider>
  );
}
