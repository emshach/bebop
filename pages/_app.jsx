import { useSession, SessionProvider } from "next-auth/react"

import '../styles/globals.scss'

function Auth({ children }) {
  const { data: session, status } = useSession({  required: true })
  const isUser = session && !!session.user

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

function Bebop({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={ session }>{
      Component.auth ?
         <Auth>
           <Component { ...pageProps } />
         </Auth>
      : <Component { ...pageProps } />
    }</SessionProvider>
  )
}

export default Bebop
