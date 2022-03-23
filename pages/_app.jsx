import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSession, SessionProvider, signIn } from 'next-auth/react'
// import { StyledEngineProvider } from '@mui/material/styles'
import Head from 'next/head';
// import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
// import theme from '../src/theme'
import createEmotionCache from '@lib/emotion-cache'

import '../styles/globals.scss'

function Auth({ roles, children }) {
  const { data: session, status } = useSession()

  const authenticated = session && session.user && (
    !roles || (session.user.roles && roles.find(
      r => session.user.roles.indexOf(r) > -1 )))
  useEffect(() => {
    if ( status == 'loading' ) return // Do nothing while loading
    if (!authenticated) signIn() // If not authenticated, force log in
  }, [ authenticated, status ])

  if ( authenticated ) {
    return children
  }
  
  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

const clientSideEmotionCache = createEmotionCache();

function Bebop({
  Component,
  emotionCache = clientSideEmotionCache, 
  pageProps: { session, ...pageProps },
}) {
  return (
    // <StyledEngineProvider injectFirst>
    <CacheProvider value={ emotionCache }>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline/>
      <SessionProvider session={ session }>{
        Component.auth
           ? ( Component.auth === true || !Component.auth.roles
               ? <Auth>
                   <Component { ...pageProps } />
                 </Auth>
               : <Auth roles={ Component.auth.roles }>
                   <Component { ...pageProps } />
                 </Auth> ) // TODO: redirect and better error
           : <Component { ...pageProps } />
      }</SessionProvider>
    </CacheProvider>
    // </StyledEngineProvider>
  )
}

Bebop.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
export default Bebop
