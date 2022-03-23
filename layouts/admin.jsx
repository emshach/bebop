import { Fragment, useState, useEffect } from 'react'
import { getSession } from "next-auth/react"
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Box from '@mui/material/Box'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ResponsiveDrawer from '@components/ResponsiveDrawer'
import IconButton from '@mui/material/IconButton'
import UserIcon from  '@mui/icons-material/Person'
import HomeLink from '@components/HomeLink/'
import styles from '../styles/layouts/Admin.module.scss'

export default function AdminLayout({
  title,
  help,
  children,
  menu,
  current,
  onNavigate
}) {
  const siteTitle = 'Bebop Doc'
  const pageTitle = title ? `: ${ title }` : ''
  const [ session, setSession ] = useState( false )

  useEffect(() => {
    getSession().then( res => {
      setSession( res )
    }).catch( err => {
      setSession( null )
    })
  }, [])
        
  return (
    <ResponsiveDrawer
      appBarContent={
        <Fragment>
          <Typography variant="h6" color="inherit" noWrap>
            <HomeLink />{ pageTitle }
          </Typography>
          <Box sx={{ flex: 1 }}/>
          { session === false ? null
            : <Link href="/my-account/main" passHref>
                { session && session.user ?
                  <IconButton sx={{ color: 'white' }}>
                    <UserIcon/>
                  </IconButton>
                  : 'Sign In'
                }
              </Link>
          }
        </Fragment>
      }
      menu={ menu }
      current={ current }
      navigate={ onNavigate }
      pageClass={ styles.layout }
      mainClass={` l-default ${ styles.layoutMain }`}
      mainContent={
        <Box className="page" sx={{ minHeight: '100%' }}>
          {
            help ? <div className={ styles.help }>{ help }</div> : ''
          }
          { children }
        </Box>
      }
      sx={{
        minHeight: '100vh',
        '& > .layout > .page': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
      <Head>
        <title>{ siteTitle + pageTitle }</title>
        <meta name="description" content="Make your doctors' appointments here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </ResponsiveDrawer>
  )
}
