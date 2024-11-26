import Pusher from "pusher";
import type { NextApiRequest, NextApiResponse } from "next";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { channel, event, data } = req.body;

    await pusher.trigger(channel, event, data);

    res.status(200).json({ message: "Event triggered" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
