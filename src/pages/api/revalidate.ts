import {NextApiHandler} from 'next';

const handler: NextApiHandler = async function (req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({message: 'Invalid token'});
  }

  try {
    if (typeof req.query.path === 'string') {
      await res.revalidate(req.query.path);
    } else {
      await res.revalidate('/');
    }
    return res.json({revalidated: true});
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

export default handler;
