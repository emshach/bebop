import Layout from '@layouts/default'
import styles from '../styles/Home.module.css'
import Button from '@material-ui/core/Button'

export default function Home() {
  return (
    <Layout className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Bebop Doc
        </h1>
      </main>

      <footer className={styles.footer}>
      </footer>
    </Layout>
  )
}
