import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const { fromUserId, toUserId, value, sourceCurrency, targetCurrency } = req.body;
  const response = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      value,
      sourceCurrency,
      targetCurrency
    },
  });
  res.status(200).send({ message: "Transaction created", user: response });
  return;
}
