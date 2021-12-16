import prisma from "../../lib/prisma";
import { hashSync } from "bcrypt";

export default async function handle(req, res) {
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

  console.log(responseUserCreate);
  debugger;
  //create initial transaction
  const responseTransactionCreate = await prisma.transaction.create({
    data: {
      fromUserId: 1, //User 1 is Admin account from Money Transfer App
      toUserId: responseUserCreate.id,
      currency: "USD",
      value: 1000.0,
    },
  });

  res.status(200).send({ message: "User and transcatioion created" });

  return;
}
