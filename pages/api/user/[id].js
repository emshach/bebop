import { getUser, updateUser } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res ) {
  const { id } = req.query
  if ( req.method === 'GET' ) {
    const result = await getUser( id )
    res.status( 200 ).json( result )
  } else if ( req.method === 'POST' ) {
    const result = await updateUser( req.body )
    res.status( 200 ).json( result )
  } else {
    // TODO: accept-headers
  }
}
