export const siteConfig = {
  name: 'OpenIndoorMaps',
  url: 'https://openindoormaps.vercel.app',
  aboutMe: {
    altName: 'OIM',
    fullName: 'OpenIndoorMaps',
    shortName: 'OIM',
    socials: {
      email: 'mark@knotzer.io',
      github: 'https://github.com/openindoormaps',
    },
  },
  description:
    'Open source platform for creating and using 3D indoor maps with integrated navigation – for universities, schools, shopping centers, and more.',
  keywords: [
    'Indoor Navigation',
    'Indoor Maps',
    'Open Source',
    '3D Maps',
    'MapLibre',
    'Indoor Routing',
    'Floor Plans',
    'Wayfinding',
  ],
  ogImage: '/og-image.png',
};

export type SiteConfig = typeof siteConfig;
