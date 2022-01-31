import prisma from "../../lib/prisma";
import { hashSync } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;
  const findUser = await prisma.user.findFirst({
    where: { email: email },
  });

  if (findUser) {
    throw new Error("User already exists");
  }

  const responseUserCreate = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: await hashSync(password, 10),
    },
  });

  let adminUser = await prisma.user.findFirst({
    where: {
      email: "money@transfer.com",
    },
  });

  await prisma.transaction.create({
    data: {
      fromUserId: adminUser!.id,
      toUserId: responseUserCreate.id,
      sourceCurrency: "USD",
      targetCurrency: "USD",
      sourceValue: 1000.0,
      targetValue: 1000.0,
    },
  });

  res.status(200).send({ message: "User and transcatioion created" });

  return;
}
