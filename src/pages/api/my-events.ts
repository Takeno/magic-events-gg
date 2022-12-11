import type {NextApiHandler} from 'next';

import {fetchEventByCoords} from '../../utils/firebase-server';

import data from '../../city.json';

const handler: NextApiHandler = async (req, res) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    res.status(401).end();
    return;
  }

  const cities: string[] = ([] as string[]).concat(req.body.cities).slice(0, 4);
  const formats: string[] = ([] as string[]).concat(req.body.formats);

  try {
    const promises = await Promise.all(
      cities.map((c) => {
        const city = data.find((d) => d.name === c);

        if (city === undefined) {
          return [];
        }

        return fetchEventByCoords(+city.latitude, +city.longitude, 30);
      })
    );

    const events = promises.flat().filter((e) => formats.includes(e.format));

    const m = new Map(events.map((t) => [t.id, t]));

    res.status(200).json([...m.values()]);
  } catch (e) {
    console.error(e);
    res.status(401).json({
      error: 'Unauthenticated',
    });
  }
};

export default handler;
