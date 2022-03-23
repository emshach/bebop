import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import AddressInput from 'material-ui-address-input'
import ConfirmationDialog from '@components/ConfirmationDialog'
// import { red } from '@mui/material/colors'
import api from '@lib/api'

export default function MyAccountSettings({ user, onUpdateUser, ...props }) {
  if ( !user ) {
    user = {}
  }
  if ( !onUpdateUser ) {
    onUpdateUser = () => {}
  }

  if ( !user.profile )
    return "Loading..."

  const [ address, setAddress ] = useState((( user.profile.addresses || [] ).find(
    a => a.primary
  ) || ( user.profile.addresses.length || [] )[0] || { id: '' }).id )
  const [ addresses, setAddresses ] = useState( user.profile.addresses || [])
  const [ contacts, setContacts ] = useState( user.profile.contacts || [])
  const [ confirmOpen, setConfirmOpen ] = useState( false )
  const [ confirm, setConfirm ] = useState( null )

  const onAddAddress = async ( address ) => {
    address.primary = address.primary || !addresses.length
    setAddresses([ ...addresses, address ])
    setAddress( address )
    api.post( `user/${ user.id }/addresses`, address )
  }

  const onChangeAddress = async ( id ) => {
    const address = addresses.find ( x => x.id === id )
    setAddress( id )
    api.post( `user/${ user.id }/set-address`, id )
  }

  const onClickDelete = () => {
    setConfirm({
      title: "Really really delete?",
      content: "If you delete your account, all your data and appointments will be deleted. Everything - Look at me - Everything will be GONE and you won't get it back. This cannot be undone. Have you thought long and hard about it? Still want to delete?",
      actions: [
        {
          label: "No. Yikes!",
          handler: () => onConfirmDelete(),
        },
        {
          label: 'Yes. Burn it.',
          // props: { sx: { color: red }},
          handler: () => onConfirmDelete( true ),
        },
      ]
    })
    setConfirmOpen( true )
  }

  const onCloseConfirm = () => {
    setConfirmOpen( false )
  }

  const onConfirmDelete = async ( response ) => {
    if ( response ) {
      const res = await api._delete( `user/${ user.id }`)
      if ( res.ok ) {
        signOut({ callbackUrl: '/' })
      }
      onCloseConfirm()
    } else {
      onCloseConfirm()
    }
  }

  return (
    <Box>
      <Box>
        <h2> Personal Info</h2>
        { /* TODO: list addrese */ }
        <Box>
          <h3>Addresses</h3>
          <Paper sx={{ p: 2 }}>
            <AddressInput
              onAdd={ onAddAddress }
              onChange={ onChangeAddress }
              value={ address }
              allAddresses={ addresses }
            />
          </Paper>
        </Box>
        <Box>
          <h3>Contacts</h3>
          <List>{
            contacts.map( contact => (
              <ListItem>{
                contact.type
              }: {
                contact.data
              }</ListItem>
            ))
          }</List>
        </Box>
      </Box>
      <Box>
        <h2>Delete Account</h2>
        <Box>
          <Button variant="contained"
                  onClick={ onClickDelete }>Delete my account</Button>
        </Box>
      </Box>
      <ConfirmationDialog
        open={ confirmOpen }
        onClose={ onCloseConfirm }
        title={ confirm && confirm.title }
        content={ confirm && confirm.content }
        actions={ confirm && confirm.actions }
      >{
        confirm ? confirm.children : null
      }</ConfirmationDialog>
    </Box>
  )
}
