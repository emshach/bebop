import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import useFetch from 'use-http'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
// import Fab from '@mui/material/Fab'
import SettingsIcon from '@mui/icons-material/Settings'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import ScheduleIcon from '@mui/icons-material/CalendarToday'
import ListIcon from '@mui/icons-material/List'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'

import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import Layout from '@layouts/admin'
import MyAccountSettings from '@components/MyAccountSettings'
import Appointments from '@components/Appointments'
import MySchedule from '@components/MySchedule'
import ConfirmationDialog from '@components/ConfirmationDialog'
import { styled } from '@mui/material/styles'

const drawerWidth = 360

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const sectionHelp = {
  main: 'Browse the dashboard or select a section from the menu',
  info: 'View or update your personal info',
  appointments: 'View your past and upcoming appointments below',
  schedule: 'Select an available appointment slot'
}

function MyAccount() {
  const { data: session, status } = useSession({  required: true })
  const user = session && session.user
  const [ confirmOpen, setConfirmOpen ] = useState( false )
  const [ confirm, setConfirm ] = useState( false )
  const [ request ] = useFetch( `api/user/${ user.id }` )

  const router = useRouter()
  const { section } = router.query

  useEffect(() => {
    request.get()
  }, [])

  if ( request.loading) {
    return 'Loading...'
  }

  const userData = request.data || {}

  const actions = {
    delete: () => {
    },
    logout: () => {
      setConfirm({
        title: "Leaving so soon?",
        content: "Sure you want to sign out? It's fine. It's fine.",
        actions: [
            {
              label: "Nevermind, I'll stay",
              handler: () => onConfirmLogout(),
            },
            {
              label: 'I just need space',
              handler: () => onConfirmLogout( true ),
            },
          ]
      })
      setConfirmOpen( true )
    }
  }

  const onCloseConfirm = () => {
    setConfirmOpen( false )
  }

  const onConfirmLogout = ( response ) => {
    if ( response ) {
      signOut({ callbackUrl: '/' })
    } else {
      onCloseConfirm()
    }
  }

  const onNavigate = ( link ) => {
    if ( actions[ link ] ) {
      return actions[ link ]()
    } else {
      router.push( link.startsWith ('/') ? link : `/my-account/${ link }` )
    }
  }

  const handleConfirm = async ( action ) => {
    let result
    if ( action ) {
      result = await action( confirm )
    }
    setConfirm( false )
    return result
  }

  const menu = [
    {
      title: 'Manage Account',
      link: 'settings',
      icon: <SettingsIcon/>
    },
    {
      title: 'Appointments',
      link: 'appointments',
      icon: <ListIcon/>
    },
    {
      title: 'Make Appointment',
      link: 'schedule',
      icon: <CalendarIcon/>
    },
  ]

  if ( userData.admin || userData.superuser ) {
    menu.push({
      title: 'Manage Site',
      link: '/admin',
      icon: <PersonIcon/>
    })
  }

  menu.push({
    title: 'Sign Out',
    link: 'logout',
    icon: <LogoutIcon/>
  })

  return (
    <Layout
      title="My Account"
      help={ sectionHelp[ section ]}
      menu={ menu }
      current={ section }
      onNavigate={ onNavigate }
    >
      { section === 'settings' ?
        <MyAccountSettings user={ userData } />
        : section === 'appointments' ?
        <Appointments />
        : section === 'schedule' ?
        <MySchedule />
        :<Grid container spacing={2}>
            <Grid item xs={4}>
              <Item>{
                'Info'
              }</Item>
            </Grid>
          </Grid>
      }
      <ConfirmationDialog
        open={ confirmOpen }
        onClose={ onCloseConfirm }
        title={ confirm && confirm.title }
        content={ confirm && confirm.content }
        actions={ confirm && confirm.actions }
      >{
        confirm ? confirm.children : null
      }</ConfirmationDialog>
    </Layout>
  )
}
MyAccount.auth = true

export default MyAccount
