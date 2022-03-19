// api/schedule/open-slots
// return a list of { start-time, end-time, [ doctor, doctor... ]}
// given a start date-time and end date-time

import { getOpenSlots } from '@lib/queries'

export default async function handler( req, res ) {
  const start = req.query.start
  const end = req.query.end
  let slots
  try {
    slots = getOpenSlots({ start, end })
  } catch( error ) {
    
  }
  res.status( 200 ).json({ name: 'John Doe' })
}
