// login( email, password )
import prisma from '@lib/prisma'

export default function handler(req, res) {
  
  res.status(200).json({ name: 'John Doe' })
}
