// api/schedule/doctor-hours
// return a list of { start-time, end-time } or null for each day of the week
// 
import { getDoctorHours, updateDoctorHours } from '@lib/queries'

export default async function handler( req, res ) {
  const { id } = req.query
  // TODO: get from database
  if ( req.method === 'GET' ) {
    let hours
    try {
      hours = await getDoctorHours({ id })
      res.status( 200 ).json({ ok: true, hours })
    } catch( error ) {
      // TODO: return error with status etc
      console.error( error )
      res.status( 500 ).json({
        ok: false,
        error: "Database query failed",
        details: `${ error }`
      })
    }
  } else if ( req.method === 'POST' ) {
    try {
      const currentHours = req.body
      const hours = await updateDoctorHours({
        id,
        hours: currentHours,
        deactivateAbsent: true
      })
      if ( hours ) {
        res.status( 200 ).json({ ok: true, hours })
      } else {
        res.status( 500 ).json({ ok: false, error: "Database update failed" })
      }
    } catch( error ) {
      console.error( error )
      res.status( 500 ).json({
        ok: false,
        error: "Database update failed",
        details: `${ error }`})
    }
  } else {
    res.setHeader( 'Allow', ['GET', 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
