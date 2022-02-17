import type {NextApiRequest, NextApiResponse} from 'next';
import {withSentry} from '@sentry/nextjs';
import {
  fetchUser,
  initUser,
  verifyAuthToken,
} from '../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;

  if (auth === undefined) {
    res.status(401).end();
    return;
  }

  const [, token] = auth.split(' ');

  try {
    const decoded = await verifyAuthToken(token);

    let user = await fetchUser(decoded.uid);

    if (user === null) {
      user = await initUser(decoded.uid, decoded.email!);
    }

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(401).json({
      error: 'Unauthenticated',
    });
  }
};

export default withSentry(handler);
