import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Vicaran",
    default: "Vicaran: AI-Powered Investigation Assistant for Journalists",
  },
  description:
    "AI-powered investigation assistant for journalists. Investigate stories 2x faster with recursive gap-driven search, source credibility scoring, and atomic fact-checking.",
  keywords: [
    "AI Investigation",
    "Journalist Research Tool",
    "Fact Checking",
    "Source Credibility",
    "Investigative Journalism",
    "Research Assistant",
    "News Verification",
    "Bias Detection",
    "Evidence Analysis",
    "Gap-Driven Search",
    "Vicaran",
    "AI Research",
  ],
  openGraph: {
    title: "Vicaran: AI-Powered Investigation Assistant for Journalists",
    description:
      "AI-powered investigation assistant for journalists. Investigate stories 2x faster with recursive gap-driven search, source credibility scoring, and atomic fact-checking.",
    url: new URL(defaultUrl),
    siteName: "Vicaran",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Vicaran - AI-powered investigation assistant showing source credibility scoring and fact verification.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vicaran: AI-Powered Investigation Assistant for Journalists",
    description:
      "AI-powered investigation assistant. Investigate stories 2x faster with source credibility scoring and atomic fact-checking.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const generateLegalMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `${title} | Vicaran`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | Vicaran`,
      description,
      type: "website",
    },
  };
};
