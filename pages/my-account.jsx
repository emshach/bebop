import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from 'use-http'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
// import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import Layout from '@layouts/default'

function MyAccount() {
  const { data: session, status } = useSession({  required: true })
  const user = session && session.user
  const [ confirm, setConfirm ] = useState( false )
  const [ request ] = useFetch( `api/user/${ user.id }` )

  useEffect(() => {
    request.get()
  }, [])

  if ( request.loading) {
    return 'Loading...'
  }

  const userData = request.data || {}

  const handleConfirm = async ( action ) => {
    let result
    if ( action ) {
      result = await action( confirm )
    }
    setConfirm( false )
    return result
  }

  return (
    <Layout title="My Account">
      <h1>Welcome { (userData.name || '').split(/\s+/)[0] }</h1>
    </Layout>
  )
}
MyAccount.auth = true

export default MyAccount
