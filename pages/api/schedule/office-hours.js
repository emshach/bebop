// api/schedule/office-hours
// return a list of { start-time, end-time } or null for each day of the week
// 
import { getOfficeHours } from '@lib/queries'

export default async function handler( req, res ) {
  // TODO: get from database
  let hours
  try {
    hours = await getOfficeHours({})
  } catch( error ) {
    // TODO: return error with status etc
    console.error( error )
  }
  console.log({ getOfficeHours, hours })
  res.status( 200 ).json( hours )
}
