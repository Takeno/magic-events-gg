import type {NextApiRequest, NextApiResponse} from 'next';
import {
  fetchOrganizerManagedBy,
  verifyAuthToken,
} from '../../../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    return res.status(401).end();
  }

  const [, token] = auth.split(' ');

  const decoded = await verifyAuthToken(token);

  const organizers = await fetchOrganizerManagedBy(decoded.uid);

  res.json(organizers);
};

export default handler;
