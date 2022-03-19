import { useSession } from "next-auth/react"
import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Layout from '@layouts/default'
// import listStyle from '@/styles/list.scss'

function Appointments() {
  // const { data: session, status } = useSession({  required: true })
  // const user = session && session.user
  const pastApts = [{
    id: 12,
    doctor: {
      name: "Dr. Kervorkian"
    },
    date: new Date().toLocaleString()
  }] // TODO: get appointments from endpoint
  const futureApts = [{
    id: 12,
    doctor: {
      name: "Dr. Kervorkian"
    },
    date: new Date().toLocaleString()
  }] // TODO: get appointments from endpoint
  return (
    <Layout title="Appointments">
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
               <ListItemText primary={ `${ apt.doctor.name } at ${ apt.date }` } />
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
               <ListItemText primary={ `${ apt.doctor.name } at ${ apt.date }` } />
             </ListItem>
           ))
           : 'You have no upcoming appointments'
      }
      </List>
      
      <Link href="/appointments/new" passHref>
        <Fab variant="extended" className="fab">
          <AddIcon sx={{ mr: 1 }} />
          Make Appointment
        </Fab>
      </Link>
    </Layout>
  )
}
// Appointments.auth = true

export default Appointments
