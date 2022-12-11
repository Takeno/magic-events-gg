import type {NextApiHandler} from 'next';

import {
  fetchUser,
  updateUserEvents,
  verifyAuthToken,
} from '../../utils/firebase-server';

const handler: NextApiHandler = async (req, res) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    res.status(401).end();
    return;
  }

  const cities: string[] = ([] as string[]).concat(req.body.cities);
  const formats: Format[] = ([] as Format[]).concat(req.body.formats);

  const [, token] = auth.split(' ');

  try {
    const decoded = await verifyAuthToken(token);

    const user = await fetchUser(decoded.uid);

    if (user === null) {
      res.status(401).end();
      return;
    }

    await updateUserEvents(user.id, cities, formats);

    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(401).json({
      error: 'Unauthenticated',
    });
  }
};

export default handler;
