import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fopdop.xyz';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
