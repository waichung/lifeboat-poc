import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from 'siwe';

import ironSessionOptions from '@/utils/IronSessionConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      // @ts-ignore
      req.session.nonce = generateNonce();
      await req.session.save();
      res.setHeader('Content-Type', 'text/plain');
      // @ts-ignore
      res.send(req.session.nonce);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironSessionOptions);
