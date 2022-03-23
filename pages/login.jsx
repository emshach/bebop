import Layout from '@layouts/minimal'
import { getProviders, signIn } from 'next-auth/react'


// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps( context ) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default function SignIn({ providers }) {
  if ( !providers ) providers = {}
  return (
    <Layout>{
      Object.values( providers ).map( provider => {
        return (
          <div key={ provider.name }>
            <button onClick={() => signIn( provider.id )}>
              Sign in with { provider.name }
            </button>
          </div>
        )
      })
    }</Layout>
  )
}
