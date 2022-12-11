import type {NextApiRequest, NextApiResponse} from 'next';
import {fetchAllEventsByLeague} from '../../../../utils/firebase-server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  if (typeof id !== 'string') {
    res.status(400).end();
    return;
  }

  const tournaments = await fetchAllEventsByLeague(id);

  res
    .status(200)
    .send(
      tournaments
        .filter((a) => a.timestamp > Date.now())
        .sort((a, b) => a.timestamp - b.timestamp)
    );
};

export default handler;
