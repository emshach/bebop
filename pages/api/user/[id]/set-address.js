import { setUserAddress } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res ) {
  const { id } = req.query
  if ( req.method === 'POST' ) {
    const result = await setUserAddress ( id, req.body )
    if ( result ) {
      res.status( 200 ).json({ ok: true, result })
    } else {
      res.status( 500 ).json({
        ok: false,
        error: "Database error creating address"
      })
    }
  } else {
    res.setHeader( 'Allow', [ 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
