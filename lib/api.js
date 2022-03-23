// class Api {
  const apiRoot = '/api/'

//   const apiUrl = `/api/${ query }${ id? '/' + id : '' }`
//   fetch( apiUrl, {
//     headers: { accept: 'application/json' },
//   })
//      .then( res => res.json() )
//      .then(({ ok, hours })=> {
//        if ( this._isMounted ) {
//          this.setState({ busy: false })
//        } else {
//          this.state.busy = false
//        }
//        if ( hours ) {
//          hours = hours.map( day => {
//            const dayObj = {}
//            for ( const hour of day ) {
//              dayObj[ hour.start ] = hour.active
//            }
//            return dayObj
//          })
//          const appointments = toAppointments( this.start, hours )
//          if ( this._isMounted ) {
//            this.setState({ hours, appointments })
//          } else {
//            Object.assign(this.state, { hours, appointments })
//          }
//        } // TODO: else
//      })

  // const apiUrl = `/api/${ query }${ id? '/' + id : '' }`
async function get( url ) {
  const res = await fetch( `${ apiRoot }${ url }`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
  })
  return res.json()
  // TODO: catch error
}

async function post( url, data ) {
  const res = await fetch( `${ apiRoot }${ url }`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( data )
  })
  return res.json()
  // TODO: catch error
}

async function _delete( url, data ) {
  const res = await fetch( `${ apiRoot }${ url }`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return res.json()
  // TODO: catch error
}

export default {
  get,
  post,
  _delete,
  async updateUser( data ) {
    console.log( 'updateUser', data )
    return post( data.id ? `user/${ data.id }`: 'users', data )
  },
  async updateDoctor( data ) {
    return this.updateUser( data ) // TODO: for now
  },
  // async updateAdmin( data ) {
  //   console.log( 'updateAdmin', data )
  //   return []
  // },
}
