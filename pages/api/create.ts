import prisma from "../../lib/prisma"
import axios from 'axios';

export default async function handle(req, res) {
  const { fromUserId, toUserId, val, currency } = req.body
  const response = await prisma.transaction.create({
    data: {
      fromUserId: fromUserId,
      toUserId: toUserId,
      value: val,
      currency: currency,
    },
  })

  res.status(200).send({message: 'Transaction created', user: response})
  return 
}