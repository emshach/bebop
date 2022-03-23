import Link from 'next/link'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Layout from '@layouts/default'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout className={ styles.container }>
      <main className={ styles.main }>
        <h1 className={ styles.title }>
          Welcome to Bebop Doc
        </h1>
        <Box className={ styles.description}>
          We are happy to have you! <br/>
          Make an appointment with one of our doctors, and track your upcoming and
          past appointments here. Click/tap below to get started. You will need to
          log in to keep track of your appointmetns.
        </Box>
        <Box>
          <Link href="/my-account/appointments" passHref>
            <Button variant="contained" size="large">
              View my appointments
            </Button>
          </Link>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href="/my-account/schedule" passHref>
            <Button variant="contained" size="large">
              Make an appointment
            </Button>
          </Link>
        </Box>
      </main>

      <footer className={ styles.footer }>
      </footer>
    </Layout>
  )
}
