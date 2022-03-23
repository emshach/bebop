// api/schedule/office-hours
// GET:  return a list of { start-time, end-time } or null for each day of the week
// POST: set offfice hours
import { getOfficeHours, updateOfficeHours } from '@lib/queries'

export default async function handler( req, res ) {
  if ( req.method === 'GET' ) {
    let hours
    try {
      hours = await getOfficeHours({})
      console.log({ hours })
      res.status( 200 ).json({ ok: true, hours })
    } catch( error ) {
      console.error( error )
      res.status( 500 ).json({
        ok: false,
        error: "Database query failed",
        details: `${ error }`
      })
    }
  } else if ( req.method === 'POST' ) {
    console.log( 'post office-hours', req.body )
    try {
      const currentHours = req.body
      const hours = await updateOfficeHours({
        hours: currentHours,
        deactivateAbsent: true
      })
      if ( hours ) {
        res.status( 200 ).json({ ok: true, hours })
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
  } else {
    res.setHeader( 'Allow', ['GET', 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
