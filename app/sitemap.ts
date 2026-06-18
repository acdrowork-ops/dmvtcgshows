import type { MetadataRoute } from "next";
import { getAllShows } from "@/lib/supabase";

const BASE_URL = "https://www.dmvtcgshows.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shows = await getAllShows();

  const showUrls: MetadataRoute.Sitemap = shows.map((show) => ({
    url: `${BASE_URL}/shows/${show.id}`,
    lastModified: new Date(show.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...showUrls,
  ];
}
