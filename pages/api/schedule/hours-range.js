// api/schedule/open-slots
// return a list of { start-time, end-time, [ doctor, doctor... ]}
// given a start date-time and end date-time

import { getHoursRange } from '@lib/queries'

export default async function handler( req, res ) {
  let result
  try {
    result = await getHoursRange()
    res.status( 200 ).json({ ok: true, result })
  } catch( error ) {
    res.status( 500 ).json({ ok: false, error: "Error getting data" })
  }
}
