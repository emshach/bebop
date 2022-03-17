import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  // Configure one or more authentication providers
  // pages: {
  //   signIn: '/login',
  //   signOut: '/logout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/welcome' // New users will be directed here on first sign
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@foo.com' },
        password: {  label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const res = await fetch( '/api/login', {
          method: 'POST',
          body: JSON.stringify( credentials ),
          headers: { 'Content-Type': 'application/json' }
        })
        const user = await res.json()
        if ( res.ok && user ) {
          return user
        }
        return null
      }
    })

  ],
})
