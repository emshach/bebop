// api/schedule/appointments
// GET:  get user appointments
// POST: create/update an appointment
import { getSession } from "next-auth/react"
import { getAppointments, createAppointment, updateAppointment } from '@lib/queries'

export default async function handler( req, res ) {
  const session = await getSession({ req })
  if ( req.method === 'GET' ) {
    try {
      const result = await getAppointments( session.user.id )
      res.status( 200 ).json( result )
    } catch( error ) {
      console.error( error )
      res.status( 500 ).json({
        ok: false,
        error: "Database query failed",
        details: `${ error }`
      })
    }
  } else if ( req.method === 'POST' ) {
    try {
      console.log( 'scheduling', { session })
      const result = await (
        req.body.id ?
           updateAppointment({
             patientId: session.user.id,
             ...req.body
           })
           : createAppointment({
             patientId: session.user.id,
             ...req.body
           }))
      if ( result ) {
        res.status( 200 ).json({ ok: true, result })
      } else {
        res.status( 500 ).json({ ok: false, error: "Database update failed" })
      }
    } catch( error ) {
      console.log( error )
      res.status( 500 ).json({
        ok: false,
        error: "Database update failed",
        details: `${ error }`})
    }
  }
}
