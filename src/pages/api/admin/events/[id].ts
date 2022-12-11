import type {NextApiRequest, NextApiResponse} from 'next';
import {isAdmin} from '../../../../utils/acl';
import {
  fetchAllEventsByOrganizer,
  fetchEventById,
  fetchUser,
  saveNewEvent,
  updateEvent,
  verifyAuthToken,
} from '../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {
  newEventConstraints,
  updateEventConstraints,
} from '../../../../utils/validation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

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

  const eventId = req.query.id;

  if (typeof eventId !== 'string') {
    res.status(400).end();
    return;
  }

  const event = await fetchEventById(eventId);

  if (event === null) {
    res.status(404).end();
    return;
  }

  if (!user.storeManagerOf.includes(event.organizer.id)) {
    res.status(403).end();
    return;
  }

  const validationErrors = validate(req.body, updateEventConstraints);

  if (validationErrors !== undefined) {
    res
      .status(400)
      .json({...validationErrors, location: validationErrors.location?.[0]});
    return;
  }

  await updateEvent(event.id, req.body);

  res.revalidate(`/tournament/${event.id}`);

  res.json(event);
  return;
};

export default handler;
