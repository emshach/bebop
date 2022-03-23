import { getPatientsTable } from '@lib/queries'

// GET /api/has-superuser
export default async function handle( req, res) {
  const result = await getPatientsTable()
  res.json( result )
}
