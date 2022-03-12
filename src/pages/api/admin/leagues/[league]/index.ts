import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {isAdmin} from '../../../../../utils/acl';
import {
  fetchUser,
  updateleague,
  verifyAuthToken,
} from '../../../../../utils/firebase-server';
import {validate} from 'validate.js';
import {updateLeagueConstraints} from '../../../../../utils/validation';

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

  const league = req.query.league;

  if (typeof league !== 'string') {
    res.status(400).end();
    return;
  }

  if (!user.leagueManagerOf.includes(league)) {
    res.status(403).end();
    return;
  }

  if (req.method === 'POST') {
    const validationErrors = validate(req.body, updateLeagueConstraints);

    if (validationErrors !== undefined) {
      res.status(400).json(validationErrors);
      return;
    }

    const event = await updateleague(league, req.body);

    res.unstable_revalidate(`/league/${league}`);

    res.json(event);
    return;
  }
};

export default withSentry(handler);
