import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Irfan Noor Hidayat — Cloud Engineer & DevOps Developer",
  description:
    "Portfolio of Irfan Noor Hidayat, Cloud Engineer and DevOps Developer. Specializing in AWS, GCP, Docker, Cloudflare Zero Trust, .NET, Node.js microservices, and AI Bedrock integrations.",
  keywords: [
    "Irfan Noor Hidayat",
    "Cloud Engineer",
    "DevOps",
    "AWS Bedrock",
    "Docker",
    "Google Cloud",
    "Cloudflare Tunnel",
    "SATUSEHAT HL7 FHIR",
    "Next.js",
  ],
  authors: [{ name: "Irfan Noor Hidayat" }],
  openGraph: {
    title: "Irfan Noor Hidayat — Cloud Engineer & DevOps Developer",
    description:
      "Enterprise experience in Cloud Infrastructure, Automation, Microservices, and AI integrations.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a192f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
        />
      </head>
      <body className="bg-navy-800 text-cyber-light selection:bg-cyber-teal selection:text-navy-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
