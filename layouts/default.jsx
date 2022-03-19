import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import HomeLink from '@components/HomeLink/'
import styles from '../styles/layouts/Default.module.scss'

export default function DefaultLayout({ title, help, children }) {
  const siteTitle = 'Bebop Doc'
  const pageTitle = title ? `: ${title}` : ''

  return (
    <div className="page">
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
        </Toolbar>
      </AppBar>
      
      <main className={`layout l-default ${ styles.layoutMain }`}>
        {
          help ? <div className={ styles.help }>{ help }</div> : ''
        }
        { children }
      </main>
    </div>
  )
}
