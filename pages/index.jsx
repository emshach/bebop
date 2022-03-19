import Link from 'next/link'
import Button from '@material-ui/core/Button'
import Layout from '@layouts/default'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout className={ styles.container }>
      <main className={ styles.main }>
        <h1 className={ styles.title }>
          Welcome to Bebop Doc
        </h1>
        <Link href="/appointments" passHref>
          <Button variant="contained" size="large">
            Make an appointment
          </Button>
        </Link>
      </main>

      <footer className={ styles.footer }>
      </footer>
    </Layout>
  )
}
