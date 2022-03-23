import { useState, useEffect } from 'react'
import useFetch from 'use-http'
import UserList from '@components/UserList'

export default function PatientList({ onLoad, onEdit, ...props }) {
  const [ columns, setColumns ] = useState([])
  const [ rows, setRows ] = useState([])
  // const [ loaded, setLoaded ] = useState( !refresh )
  const [ request ] = useFetch( '/api/user/patients', { cachePolicy: 'no-cache' })
  useEffect(() => initData(), [])

  async function initData() {
    const data = await request.get()
    if ( data ) {
      if ( data.columns ) {
        setColumns( data.columns )
      }
      setRows( data.rows || [] )
    }
  }
  
  return (
    request.loading ?
       'Loading...' // TODO: loading spinner
       : <UserList columns={ columns }
                   rows={ rows }
                   onRefresh={ initData }
                   onEdit={ onEdit } />
  )
}