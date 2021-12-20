import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react"

export default async function handle(req: any, res: any) {
  const session = await getSession({ req })
  if (!session) {
    res.status(401)
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
