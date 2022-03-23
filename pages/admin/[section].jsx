import { useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import SettingsIcon from '@mui/icons-material/Settings'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import ScheduleIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import { styled } from '@mui/material/styles'

import Layout from '@layouts/admin'
import Schedule from '@components/Schedule'
import HoursPicker from '@components/HoursPicker'
import UserManager from '@components/UserManager'
import Settings from '@components/Settings'

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
  hours: 'Click/tap hour slots to set office hours'
}

function Admin() {
  const { data: session, status } = useSession({ required: true })
  const user = session && session.user

  const router = useRouter()
  const { section } = router.query

  const onNavigate = ( link ) => {
    router.push( link.startsWith ('/') ? link : `/admin/${ link }` )
  }

  return (
    <Layout
      title="Administration"
      help={ sectionHelp[ section ]}
      menu={[
        {
          title: 'Schedule',
          link: 'schedule',
          icon: <ScheduleIcon/>
        },
        {
          title: 'Office Hours',
          link: 'hours',
          icon: <CalendarIcon/>
        },
        {
          title: 'Users',
          link: 'users',
          icon: <PersonIcon/>
        },
        {
          title: 'Settings',
          link: 'settings',
          icon: <SettingsIcon/>
        },
      ]}
      current={ section }
      onNavigate={ onNavigate }
    >
      { section === 'schedule' ?
        <Schedule />
        : section === 'settings' ?
        <Settings />
        : section === 'hours' ?
        <Paper sx={{ overflow: 'hidden' }}>
          <HoursPicker query="schedule/office-hours"/>
        </Paper>
        : section === 'users' ?
        <UserManager />
        :<Grid container spacing={2}>
            <Grid item xs={4}>
              <Link href="/admin/office-hours">
                <Item>{
                  'Office Hours'
                }</Item>
              </Link>
            </Grid>
          </Grid>
      }
    </Layout>
  )
}
Admin.auth = { roles: [ 'admin' ]}

export default Admin
