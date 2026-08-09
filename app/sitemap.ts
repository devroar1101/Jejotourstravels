import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { trips } from '@/content/catalog';

// Static export emits this as /out/sitemap.xml at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${site.url}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...trips.map((t) => ({
      url: `${site.url}/destinations/${t.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
