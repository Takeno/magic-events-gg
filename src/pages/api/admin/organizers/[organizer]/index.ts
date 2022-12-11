import type {NextApiRequest, NextApiResponse} from 'next';

import {isAdmin} from '../../../../../utils/acl';
import {
  fetchUser,
  updateOrganizer,
  verifyAuthToken,
} from '../../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {updateOrganizerConstraints} from '../../../../../utils/validation';

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

  const organizer = req.query.organizer;

  if (typeof organizer !== 'string') {
    res.status(400).end();
    return;
  }

  if (!user.storeManagerOf.includes(organizer)) {
    res.status(403).end();
    return;
  }

  if (req.method === 'POST') {
    const validationErrors = validate(req.body, updateOrganizerConstraints);

    if (validationErrors !== undefined) {
      res.status(400).json(validationErrors);
      return;
    }

    const event = await updateOrganizer(organizer, req.body);

    res.revalidate(`/to/${organizer}`);

    res.json(event);
    return;
  }
};

export default handler;
