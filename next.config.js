/** @type {import('next').NextConfig} */
const path = require( 'path' )
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePath: [ path.join( __dirname, 'styles' )]
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/main',
        permanent: true,
      },
      {
        source: '/my-account',
        destination: '/my-account/main',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
