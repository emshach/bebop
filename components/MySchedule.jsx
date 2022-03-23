import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from 'use-http'
import Schedule from '@components/Schedule'

export default function MySchedule() {
  const [ request ] = useFetch( '/api/schedule/appointments',
                                { cachePolicy: 'no-cache' })
  useEffect(() => {
    request.get()
  }, [ request ])

  if ( request.loading ) {
    return 'Loading...'
  }

  return (
    <Schedule appointments={ request.data } />
  )
}
