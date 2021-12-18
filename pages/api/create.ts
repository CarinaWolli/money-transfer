import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const { fromUserId, toUserId, sourceValue, sourceCurrency, targetCurrency } = req.body;
  const response = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      sourceValue, 
      targetValue: 0.00,
      sourceCurrency,
      targetCurrency
    },
  });
  res.status(200).send({ message: "Transaction created", user: response });
  return;
}
