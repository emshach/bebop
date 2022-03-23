import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

export default function UserForm({ onCommit, onCancel, data, ...props }) {
  if ( !data ) {
    data = {}
  }
  const [ name, setName ] = useState( data.name || '' )
  const [ email, setEmail ] = useState( data.email || '' )
  const [ sendEmail, setSendEmail ] = useState( true )
  const [ admin, setAdmin ] = useState( data.admin || false )
  const [ superuser, setSuperuser ] = useState( data.superuser || false )
  const [ doctor, setDoctor ] = useState( !!data.doctorProfile || false )
  const [ doctorTitle, setDoctorTitle ] = useState(
    ( data.doctorProfile && data.doctorProfile.title ) || '' )

  const updateName = (e) => {
    setName( e.target.value )
  }

  const updateEmail = (e) => {
    setEmail( e.target.value )
  }

  const updateSendEmail = (e) => {
    setSendEmail( e.target.checked )
  }

  const updateDoctor = (e) => {
    setDoctor( e.target.checked )
  }

  const updateDoctorTitle = (e) => {
    setDoctorTitle( e.target.value )
  }

  const updateAdmin = (e) => {
    setAdmin( e.target.checked )
  }

  const updateSuperuser = (e) => {
    setSuperuser( e.target.checked )
  }

  return (
    <Paper sx={{ width: '640px', maxWidth: '100%' }}>
      <Box>
        <Box sx={{ p: 1 }}>
          <TextField id="user-name"
                     name="name"
                     label="Name"
                     variant="outlined"
                     value={ name }
                     onChange={ updateName }
                     fullWidth />
        </Box>
        <Box sx={{ p: 1 }}>
          <TextField id="user-email"
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
            <Checkbox checked={ sendEmail } onChange={ updateSendEmail } />
          }
          label={ `Send ${ data.id ? 'update' : 'sign-up' } email`} />
        <FormControlLabel
          control={
            <Checkbox checked={ doctor } onChange={ updateDoctor } />
          }
          label="Doctor" />
        { doctor ?
          <FormGroup sx={{ m: 2, ml: 0 }}>
            <TextField id="user-doctor-title"
                       name="doctor-title"
                       label="Title"
                       variant="outlined"
                       value={ doctorTitle }
                       onChange={ updateDoctorTitle }
                       fullWidth />
          </FormGroup>
          : null
        }
        <FormControlLabel
          control={
            <Checkbox checked={ admin } onChange={ updateAdmin } />
          }
          label="Admin" />
        <FormControlLabel
          control={
            <Checkbox checked={ superuser } onChange={ updateSuperuser } />
          }
          label="Superuser" />
      </FormGroup>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={ e => { onCommit( e, {
          id: data.id,
          name,
          email,
          doctor,
          doctorTitle,
          admin,
          superuser,
          sendEmail
        })}}>Save</Button>
        <Button onClick={ onCancel }>Cancel</Button>
      </Box>
    </Paper>
  )
}
