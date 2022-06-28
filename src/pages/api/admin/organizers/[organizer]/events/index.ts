import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {isAdmin} from '../../../../../../utils/acl';
import {
  fetchAllEventsByOrganizer,
  fetchUser,
  saveNewEvent,
  verifyAuthToken,
} from '../../../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {newEventConstraints} from '../../../../../../utils/validation';

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
    const validationErrors = validate(req.body, newEventConstraints);

    if (validationErrors !== undefined) {
      res
        .status(400)
        .json({...validationErrors, location: validationErrors.location?.[0]});
      return;
    }

    const event = await saveNewEvent(organizer, req.body);

    res.revalidate('/');

    res.json(event);
    return;
  }
};

export default withSentry(handler);
