import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {fetchEventByCoords} from '../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const radius = req.query.radius || '30';

  if (typeof latitude !== 'string') {
    res.status(400).end();
    return;
  }

  if (typeof longitude !== 'string') {
    res.status(400).end();
    return;
  }

  if (typeof radius !== 'string' || isNaN(+radius)) {
    res.status(400).end();
    return;
  }

  const tournaments = await fetchEventByCoords(
    +latitude,
    +longitude,
    Math.min(parseInt(radius), 30)
  );

  res.status(200).send(tournaments);
};

export default withSentry(handler);
