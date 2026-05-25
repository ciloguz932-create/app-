import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumina Lingua",
    short_name: "Lumina",
    description: "Learn languages with AI-powered spaced repetition",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FEF9F0",
    theme_color: "#A51C30",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Study Cards",
        url: "/vocabulary/study",
        description: "Start a spaced repetition session",
      },
      {
        name: "Conversation",
        url: "/conversation",
        description: "Chat with your AI tutor",
      },
    ],
  };
}
