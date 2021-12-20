import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const { fromUserId, toUserId, sourceValue, sourceCurrency, targetValue, targetCurrency } = req.body;
  const response = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      sourceValue, 
      targetValue,
      sourceCurrency,
      targetCurrency
    },
  });
  res.status(200).send({ message: "Transaction created", user: response });
  return;
}
