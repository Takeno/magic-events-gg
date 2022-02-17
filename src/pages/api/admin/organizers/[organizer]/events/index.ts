import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {isAdmin} from '../../../../../../utils/acl';
import {
  fetchAllEventsByOrganizer,
  fetchUser,
  saveNewEvent,
  verifyAuthToken,
} from '../../../../../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    res.status(401).end();
    return;
  }

  const [, token] = auth.split(' ');

  const decoded = await verifyAuthToken(token);

  const user = await fetchUser(decoded.uid);

  if (user === null || !isAdmin(user)) {
    res.status(401).end();
    return;
  }

  const organizer = req.query.organizer;

  if (typeof organizer !== 'string') {
    res.status(400).end();
    return;
  }

  if (!user.storeManagerOf.includes(organizer)) {
    res.status(403).end();
    return;
  }

  if (req.method === 'GET') {
    const events = await fetchAllEventsByOrganizer(organizer);

    res.json(events);
    return;
  }

  if (req.method === 'POST') {
    const event = await saveNewEvent(organizer, req.body);

    res.json(event);
    return;
  }
};

export default withSentry(handler);
