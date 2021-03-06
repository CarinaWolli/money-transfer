import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    return;
  }

  const {
    fromUserId,
    toUserId,
    sourceValue,
    sourceCurrency,
    targetValue,
    targetCurrency,
  } = req.body;

  if (fromUserId != session.id || sourceValue < 0 || targetValue < 0) {
    res.status(400);
    return;
  }

  const response = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      sourceValue,
      targetValue,
      sourceCurrency,
      targetCurrency,
    },
  });
  res.status(200).send({ message: "Transaction created", user: response });
  return;
}
