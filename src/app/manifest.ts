import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WC2026',
    short_name: 'WC2026',
    description: 'Acompanhe a Copa do Mundo 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#110F14',
    theme_color: '#110F14',
    icons: [
      {
        src: '/logo/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/logo/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
