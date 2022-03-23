import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from 'use-http'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import Box from '@mui/material/Box'
import Layout from '@layouts/default'
import Schedule from '@components/Schedule'

export default function NewAppointment() {
  const { data: session, status } = useSession({  required: true })
  const user = session && session.user
  // TODO: get current appointments
  const [ request ] = useFetch( '/api/schedule/appointments' )
  useEffect(() => {
    request.get()
  }, [])

  if ( request.loading ) {
    return 'Loading...'
  }

  return (
    <Layout title="Make an Appointment" help="Select an available appointment slot">
      <Box>
        <Link href="/appointments" passHref>
          <Button variant="contained" size="large">
            Back to my appointments
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Schedule appointments={ request.data } />
      </Box>
    </Layout>
  )
}
