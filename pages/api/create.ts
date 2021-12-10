import prisma from "../../lib/prisma"
import axios from 'axios';

export default async function handle(req, res) {
  const { fromId, fromEmail, toId, toEmail, val, currency } = req.body
  const response = await prisma.transaction.create({
    data: {
      fromId: fromId,
      fromEmail: fromEmail,
      toId: toId,
      toEmail: toEmail,
      value: val,
      currency: currency,
    },
  })

  res.status(200).send({message: 'Transaction created', user: response})
  return 
}