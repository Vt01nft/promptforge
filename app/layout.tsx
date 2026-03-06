import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "promptforge — turn rough ideas into production-grade prompts",
  description:
    "Describe what you want to build. Get a perfectly structured prompt that any LLM will execute flawlessly. Free and open source.",
  keywords: [
    "prompt engineering",
    "prompt generator",
    "ai prompt builder",
    "claude prompt",
    "chatgpt prompt",
    "prompt template",
    "free prompt tool",
  ],
  openGraph: {
    title: "promptforge",
    description: "Turn rough ideas into production-grade prompts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "promptforge",
    description: "Turn rough ideas into production-grade prompts",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0e0e18",
              border: "1px solid #1e1e2e",
              color: "#e4e4e7",
            },
          }}
        />
      </body>
    </html>
  );
}
