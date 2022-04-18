const {initializeApp, cert, getApps} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {writeFileSync} = require('fs');
const {default: slugify} = require('slugify');
const cities = require('../src/city.json').slice(0, 20);

function init() {
  if (process.env.GSERVICE_ACCOUNT_SECRETS) {
    const serviceAccount = JSON.parse(process.env.GSERVICE_ACCOUNT_SECRETS);

    initializeApp({
      credential: cert(serviceAccount),
    });
    return;
  }

  initializeApp({
    projectId: process.env.FIRESTORE_PROJECT_ID,
  });
}

function getDatabase() {
  if (getApps().length === 0) {
    init();
  }

  return getFirestore();
}

async function fetchAllOrganizers() {
  const db = getDatabase();

  const results = await db.collection('organizers').orderBy('name').get();

  const organizers = [];

  results.forEach((doc) => {
    const d = doc.data();

    organizers.push({
      id: doc.id,
      name: d.name,
      logo: d.logo || null,
      description: d.description || null,
      facebook: d.facebook || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      discord: d.discord || null,
      location: d.location && {
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
    });
  });
  return organizers;
}

const DOMAIN = 'https://magic-events.gg';

const pages = [
  '/',
  '/login',
  '/signup',
  '/organizzatori',
  '/leghe-e-circuiti',
  '/contatti',
];

cities.forEach((c) => pages.push(`/italia/${slugify(c.name, {lower: true})}`));

fetchAllOrganizers()
  .then((organizers) => {
    organizers.forEach((c) => pages.push(`/to/${c.id}`));
  })
  .then(() => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) =>
        `<url><loc>${`${DOMAIN}${page}`}</loc><changefreq>weekly</changefreq></url>`
    )
    .join('\n')}
</urlset>
`;

    writeFileSync('public/sitemap.xml', sitemap);
  });
