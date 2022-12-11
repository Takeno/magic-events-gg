import type {NextApiRequest, NextApiResponse} from 'next';

import {isAdmin} from '../../../../../utils/acl';
import {
  fetchUser,
  saveNewEvent,
  verifyAuthToken,
} from '../../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {newEventConstraints} from '../../../../../utils/validation';
import {fetchAllEventsByLeague} from '../../../../../utils/firebase-server';

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

  const league = req.query.league;

  if (typeof league !== 'string') {
    res.status(400).end();
    return;
  }

  if (!user.leagueManagerOf.includes(league)) {
    res.status(403).end();
    return;
  }

  if (req.method === 'GET') {
    const events = await fetchAllEventsByLeague(league);

    res.json(events);
    return;
  }

  res.status(405).end();
};

export default handler;
