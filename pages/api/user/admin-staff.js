import { getAdminsTable } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res) {
  const result = await getAdminsTable()
  res.json( result )
}
