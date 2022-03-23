import { getSession } from "next-auth/react"
import { getUser, deleteUser } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res ) {
  const session = await getSession({ req })
  const { id } = req.query
  if ( req.method === 'GET' ) {
    const result = await getUser( id )
    res.status( 200 ).json( result )
  } else if ( req.method === 'POST' ) {
    const result = await updateUser( req.body )
    res.status( 200 ).json( result )
  } else if ( req.method === 'DELETE' ) {
    if ( id !== session.user.id &&
         !session.user.roles.find( x => x === 'admin' || x === 'superuser' )) {
      res.status( 401 ).json({
        ok: false,
        error: 'You do not have sufficiont permissions to delete this account'
      });
    } else {
      const result = await deleteUser( id )
      res.status( 200 ).json({ ok: true, result })
    }
  } else {
    res.setHeader( 'Allow', ['GET', 'POST' ]);
    res.status( 405 ).json({
      ok: false,
      error: `Method ${ req.method } Not Allowed`
    });
  }
}
