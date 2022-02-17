import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {
  fetchOrganizerManagedBy,
  verifyAuthToken,
} from '../../../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    res.status(401).end();
    return;
  }

  const [, token] = auth.split(' ');

  const decoded = await verifyAuthToken(token);

  const organizers = await fetchOrganizerManagedBy(decoded.uid);

  res.json(organizers);
};

export default withSentry(handler);
