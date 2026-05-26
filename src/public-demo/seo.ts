import { useEffect } from "react";
import type { PublicArticle } from "./data/articles";

const siteUrl = "https://niq.synkos.net";

type PublicMeta = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  article?: PublicArticle;
};

export function usePublicMeta({ title, description, path = "/demo", type = "website", article }: PublicMeta) {
  useEffect(() => {
    const canonical = `${siteUrl}${path}`;
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", type, "property");
    upsertMeta("og:url", canonical, "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertCanonical(canonical);
    upsertJsonLd(article ? articleJsonLd(article, canonical) : websiteJsonLd(canonical));
  }, [article, description, path, title, type]);
}

function upsertMeta(name: string, content: string, key = "name") {
  let tag = document.head.querySelector(`meta[${key}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(key, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let tag = document.head.querySelector('script[data-json-ld="niq"]');
  if (!tag) {
    tag = document.createElement("script");
    tag.setAttribute("type", "application/ld+json");
    tag.setAttribute("data-json-ld", "niq");
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

function websiteJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "NarrativeIQ",
        url: "https://niq.synkos.net"
      },
      {
        "@type": "WebSite",
        name: "NarrativeIQ",
        url,
        description: "Longitudinal cognition infrastructure for complex human systems."
      },
      {
        "@type": "SoftwareApplication",
        name: "NarrativeIQ",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Contextual AI infrastructure for narrative continuity, workflow cognition, semantic coordination, and cross-system context preservation."
      }
    ]
  };
}

function articleJsonLd(article: PublicArticle, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: "NiQ" },
    publisher: { "@type": "Organization", name: "NiQ" },
    mainEntityOfPage: url
  };
}
