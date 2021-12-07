import NextAuth from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import prisma from '../../../lib/prisma'
import { compare } from 'bcrypt'

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: {email: credentials?.email },
        })
        if (!user) {
          return null
        }
        
        const checkPassword = await compare(credentials?.password, user.password)

        console.log (user.password);

        if(checkPassword){
          return user
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user}) => {
      if(user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({session, token}) => {
      if(token) {
        session.id = token.id; 
      }
      return session;
    },
  }, 
  secret: "test",
  jwt: {
    secret: "test", 
    encryption: true,
  },
});