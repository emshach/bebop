import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@lib/prisma'


export default NextAuth({
  // Configure one or more authentication providers
  // pages: {
  //   signIn: '/login',
  //   signOut: '/logout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/welcome' // New users will be directed here on first sign
  // },
  adapter: PrismaAdapter( prisma ),
  session: { jwt: true },
  callbacks: {
    async jwt({ token, user }) {
      token.roles = []
      if ( user?.admin ) {
        token.roles.push( 'admin' )
      }
      if ( user?.superuser ) {
        token.roles.push( 'superuser' )
      }
      return token;
    },
    async session({ session, token, user }) {
      if ( token ) {
        if ( token?.roles ) {
          session.user.roles = token.roles;
        }
      } else if ( user ) {
        session.user.roles = []
        if ( user.admin ) {
          session.user.roles.push( 'admin' )
        }
        if ( user.superuser ) {
          session.user.roles.push( 'superuser' )
        }
      }
      if ( user && session && !session.user.id ) {
        session.user.id = user.id
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // CredentialsProvider({
    //   name: 'Email and password',
    //   credentials: {
    //     email: { label: 'Email', type: 'text', placeholder: 'email@foo.com' },
    //     password: {  label: 'Password', type: 'password' }
    //   },
    //   async authorize(credentials, req) {
    //     const res = await fetch( '/api/login', {
    //       method: 'POST',
    //       body: JSON.stringify( credentials ),
    //       headers: { 'Content-Type': 'application/json' }
    //     })
    //     const user = await res.json()
    //     if ( res.ok && user ) {
    //       return user
    //     }
    //     return null
    //   }
    // })
    // TODO: implement above
  ],
})
