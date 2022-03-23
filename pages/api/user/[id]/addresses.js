import { getAddresses, createAddress } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res ) {
  const { id } = req.query
  if ( req.method === 'GET' ) {
    const result = await getAddresses( id )
    res.status( 200 ).json( result )
  } else if ( req.method === 'POST' ) {
    try {
      const result = await createAddress( id, req.body )
      if ( result ) {
        res.status( 200 ).json({ ok: true, result })
      } else {
        res.status( 500 ).json({
          ok: false,
          error: "Database error creating address"
        })
      }
    } catch ( error ) {
      res.status( 500 ).json({
        ok: false,
        error: "Database error creating address",
        details: `${ error }`
      })
    }
  } else {
    res.setHeader( 'Allow', ['GET', 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
