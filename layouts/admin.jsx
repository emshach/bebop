import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Box from '@mui/material/Box'
import ResponsiveDrawer from '@components/ResponsiveDrawer'
import HomeLink from '@components/HomeLink/'

import styles from '../styles/layouts/Admin.module.scss'

export default function AdminLayout({ title, help, children, menu, onNavigate }) {
  const siteTitle = 'Bebop Doc'
  const pageTitle = title ? `: ${ title }` : ''

  return (
    <ResponsiveDrawer
      appBarContent={
        <Typography variant="h6" color="inherit" noWrap>
          <HomeLink />{ pageTitle }
        </Typography>
      }
      menu={ menu }
      navigate={ onNavigate }
      mainClass={`layout l-default ${ styles.layoutMain }`}
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
