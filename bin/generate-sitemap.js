const {writeFileSync} = require('fs');
const {default: slugify} = require('slugify');
const cities = require('../src/city.json');

const DOMAIN = 'https://magic-events.gg';

const pages = ['/', '/accedi', '/contatti'];

cities.forEach((c) => pages.push(`/italia/${slugify(c.name, {lower: true})}`));

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
