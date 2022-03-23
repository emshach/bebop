import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useFetch from 'use-http'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import AddIcon from '@mui/icons-material/Add'

function Appointments() {
  const [ confirm, setConfirm ] = useState( false )
  const pastApts = []
  const futureApts = []
  const [ request ] = useFetch( 'api/schedule/appointments' )
  useEffect(() => {
    request.get()
  }, [])

  if ( request.loading) {
    return 'Loading...'
  }

  const now = new Date()
  if ( request.data ) {
    for ( const { id, date, hour } of request.data ) {
      const apt = {
        id,
        date: new Date( date ),
        hour
      }
      apt.dateStr = apt.date.toLocaleString();
      ( apt.date > now ? futureApts : pastApts ).push( apt )
    }
    console.log({ pastApts, futureApts })
  }
  return (
    <Box sx={{ p: 2 }}>
      <List sx={{ width: '100%' }}
            subheader={
              <ListSubheader component="div" id="list-appointments-past"
                             sx={{ background: 'transparent', color: 'white' }}>
                Past Appointments
              </ListSubheader>
            }
      >{
        pastApts.length
           ? pastApts.map( apt => (
             <ListItem
               key={ apt.id }
               disableGutters
             >
               <ListItemText primary={ `${ apt.hour.doctor.title } at ${ apt.dateStr }` } />
             </ListItem>
           ))
           : 'You have no past appointments'
      }
      </List>
      <List sx={{ width: '100%' }}
            subheader={
              <ListSubheader component="div" id="list-appointments-future"
                             sx={{ background: 'transparent', color: 'white' }}>
                Upcoming Appointment(s)
              </ListSubheader>
            }
      >{
        futureApts.length
           ? futureApts.map( apt => (
             <ListItem
               key={ apt.id }
               disableGutters
             >
               <ListItemText primary={ `${ apt.hour.doctor.title } at ${ apt.dateStr }` } />
             </ListItem>
           ))
           : 'You have no upcoming appointments'
      }
      </List>
    </Box>
  )
}
// Appointments.auth = true

export default Appointments
