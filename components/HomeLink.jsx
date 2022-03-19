import Link from 'next/link'

export default function HomeLink() {
  const siteTitle = 'Bebop Doc'
  return (
    <Link href="/">{ siteTitle }</Link>
  )
}
