import type {NextApiRequest, NextApiResponse} from 'next';
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
    return res.status(401).end();
  }

  const [, token] = auth.split(' ');

  const decoded = await verifyAuthToken(token);

  const user = await fetchUser(decoded.uid);

  if (user === null || !isAdmin(user)) {
    return res.status(401).end();
  }

  const organizer = req.query.organizer;

  if (typeof organizer !== 'string') {
    return res.status(400).end();
  }

  if (!user.storeManagerOf.includes(organizer)) {
    return res.status(403).end();
  }

  if (req.method === 'GET') {
    const events = await fetchAllEventsByOrganizer(organizer);

    return res.json(events);
  }

  if (req.method === 'POST') {
    const event = await saveNewEvent(organizer, req.body);

    return res.json(event);
  }
};

export default handler;
