import prisma from '@lib/prisma'

// GET /api/has-superuser
export default async function handle( req, res) {
  const result = await prisma.user.count({
    select: { superuser: true },
  })
  res.json( result )
}
