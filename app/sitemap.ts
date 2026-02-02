import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://stateside.app";
  const lastModified = new Date();

  return [
    // Main app
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    // Processing times (updates frequently)
    {
      url: `${siteUrl}/processing-times`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // FAQ
    {
      url: `${siteUrl}/faq`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Guides index
    {
      url: `${siteUrl}/guides`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Individual guides
    {
      url: `${siteUrl}/guides/h1b-to-green-card`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/tn-to-green-card`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/eb2-niw`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/perm-process`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/india-green-card-backlog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/china-green-card-backlog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
