import type {NextApiRequest, NextApiResponse} from 'next';

import {isAdmin} from '../../../../../../utils/acl';
import {
  fetchUser,
  linkEventToLeague,
  saveNewEvent,
  unlinkEventFromLeague,
  verifyAuthToken,
} from '../../../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {newEventConstraints} from '../../../../../../utils/validation';
import {fetchAllEventsByLeague} from '../../../../../../utils/firebase-server';

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
  const tournament = req.query.tournament;

  if (typeof league !== 'string') {
    res.status(400).end();
    return;
  }

  if (typeof tournament !== 'string') {
    res.status(400).end();
    return;
  }

  if (!user.leagueManagerOf.includes(league)) {
    res.status(403).end();
    return;
  }

  if (req.method === 'DELETE') {
    await unlinkEventFromLeague(league, tournament);

    res.status(204).end();
    return;
  }

  if (req.method === 'POST') {
    // const validationErrors = validate(req.body, newEventConstraints);
    // if (validationErrors !== undefined) {
    //   res
    //     .status(400)
    //     .json({...validationErrors, location: validationErrors.location?.[0]});
    //   return;
    // }
    await linkEventToLeague(league, tournament);
    res.revalidate('/leagues/' + league);
    res.revalidate('/tournament/' + tournament);

    res.status(204).end();
    return;
  }

  res.status(405).end();
};

export default handler;
