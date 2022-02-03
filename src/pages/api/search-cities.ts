import type {NextApiRequest, NextApiResponse} from 'next';
import cities from '../../city.json';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const q = req.query.q;

  if (typeof q !== 'string') {
    return res.status(400).end();
  }

  const results = cities.filter((city) =>
    city.name.toLowerCase().startsWith(q.toLowerCase())
  );

  res.send(results);
};

export default handler;
