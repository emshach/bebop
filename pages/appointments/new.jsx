import React from 'react'
import { useSession } from "next-auth/react"
import Layout from '@layouts/default'
import Schedule from '@components/Schedule'

export default function NewAppointment() {
  // const { data: session, status } = useSession({  required: true })
  // const user = session && session.user
  return (
    <Layout title="Make an Appointment" help="Select an available appointment slot">
      <Schedule />
    </Layout>
  )
}
