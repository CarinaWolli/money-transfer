import prisma from "../../lib/prisma"

export default async function handle(req, res) {
  const { fromUserId, toUserId, val, currency } = req.body
  const response = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      currency,
      value: val,
    },
  })
  res.status(200).send({ message: "Transaction created", user: response })
  return
}
