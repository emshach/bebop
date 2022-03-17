import Head from 'next/head'
import Image from 'next/image'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import styles from '../styles/layouts/Default.module.scss'

export default function DefaultLayout({ title, children }) {
  const pageTitle = 'Bebop Doc' + ( title ? `: ${title}` : '' )
  return (
    <div className="page">
      <Head>
        <title>{ pageTitle }</title>
        <meta name="description" content="Make your doctors' appointments here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="absolute" color="default" className="appbar">
        <Toolbar className="toolbar">
          <Typography variant="h6" color="inherit" noWrap>
            { pageTitle }
          </Typography>
        </Toolbar>
      </AppBar>
      
      <main className="layout l-default">
        { children }
      </main>
    </div>
  )
}
