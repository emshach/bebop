import { getUsersTable, createUser } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res ) {
  if ( req.method === 'GET' ) {
    const result = await getUsersTable()
    res.status( 200 ).json( result )
  } else if ( req.method === 'POST' ) {
    const result = await createUser( req.body )
    res.status( 200 ).json( result )
  } else {
    res.setHeader( 'Allow', ['GET', 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
