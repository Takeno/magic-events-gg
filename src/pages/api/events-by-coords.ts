import type {NextApiRequest, NextApiResponse} from 'next';
import {fetchEventByCoords} from '../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const radius = req.query.radius || '30';

  if (typeof latitude !== 'string') {
    return res.status(400).end();
  }

  if (typeof longitude !== 'string') {
    return res.status(400).end();
  }

  if (typeof radius !== 'string' || isNaN(+radius)) {
    return res.status(400).end();
  }

  const tournaments = await fetchEventByCoords(
    +latitude,
    +longitude,
    Math.max(parseInt(radius), 50)
  );

  res.status(200).send(tournaments);
};

export default handler;
