import { useState, useEffect } from 'react'
import { getSession } from "next-auth/react"
import Head from 'next/head'
import Link from 'next/link'
import Box from '@mui/material/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@mui/material/IconButton'
import UserIcon from  '@mui/icons-material/Person'
import HomeLink from '@components/HomeLink/'
import styles from '../styles/layouts/Default.module.scss'

export default function DefaultLayout({ title, help, children }) {
  const siteTitle = 'Bebop Doc'
  const pageTitle = title ? `: ${title}` : ''
  const [ session, setSession ] = useState( false )

  useEffect(() => {
    getSession().then( res => {
      setSession( res )
    }).catch( err => {
      setSession( null )
    })
  }, [])
        
  return (
    <div className={ `page ${ styles.layout }` }>
      <Head>
        <title>{ siteTitle + pageTitle }</title>
        <meta name="description" content="Make your doctors' appointments here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="fixed" className="appbar" elevation={0}>
        <Toolbar className="toolbar">
          <Typography variant="h6" color="inherit" noWrap>
            <HomeLink />{ pageTitle }
          </Typography>
          <Box sx={{ flex: 1 }}/>
          { session === false ? null
            : <Link href={
              session && session.user ? '/my-account'
                 : '/api/auth/signin'
            } passHref>
                { session && session.user ?
                  <IconButton sx={{ color: 'white' }}>
                    <UserIcon/>
                  </IconButton>
                  : 'Sign In'
                }
              </Link>
          }
        </Toolbar>
      </AppBar>
      
      <main className={`l-default ${ styles.layoutMain }`}>
        {
          help ? <div className={ styles.help }>{ help }</div> : ''
        }
        { children }
      </main>
    </div>
  )
}
