import { MetadataRoute } from 'next';
import { getAllCveRecords } from '@/lib/cve-directory';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://exultia.tech';
  const cves = await getAllCveRecords();

  const cveUrls: MetadataRoute.Sitemap = cves.map((item) => ({
    url: `${baseUrl}/cve/${item.cveId.toLowerCase()}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'weekly',
    priority: item.severity === 'CRITICAL' ? 0.9 : 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cve`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/app/uvi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/app/praxis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/account/subscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...cveUrls];
}
