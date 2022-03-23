import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@material-ui/core/Button'

export default function AdminForm({ onCommit, onCancel, data, ...props }) {
  if ( !data ) {
    data = {}
  }
  const [ name, setName ] = useState( data.name || '' )
  const [ email, setEmail ] = useState( data.email || '' )
  const [ sendEmail, setSendEmail ] = useState( true )

  const updateName = (e) => {
    setName( e.target.value )
  }

  const updateEmail = (e) => {
    setEmail( e.target.value )
  }

  const updateSendEmail = (e) => {
    setSendEmail( e.target.value )
  }

  return (
    <Paper sx={{ width: '640px', maxWidth: '100%' }}>
      <Box>
        <Box sx={{ p: 1 }}>
          <TextField id="pacient-name"
                     name="name"
                     label="Name"
                     variant="outlined"
                     value={ name }
                     onChange={ updateName }
                     fullWidth />
        </Box>
        <Box sx={{ p: 1 }}>
          <TextField id="pacient-email"
                     name="email"
                     label="Email Address"
                     variant="outlined"
                     value={ email }
                     onChange={ updateEmail }
                     fullWidth />
        </Box>
      </Box>
      <FormGroup sx={{ m: 1, ml: 3 }}>
        <FormControlLabel
          control={
            <Checkbox checked={ sendEmail} onChange={ updateSendEmail } />
          }
          label={ `Send ${ data.id ? 'update' : 'sign-up' } email`} />
      </FormGroup>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={ e => { onCommit( e, {
          id: data.id,
          name,
          email,
          sendEmail
        })}}>Save</Button>
        <Button onClick={ onCancel }>Cancel</Button>
      </Box>
    </Paper>
  )
}
