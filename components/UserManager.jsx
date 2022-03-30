import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AllUsersList from '@components/AllUsersList'
import PatientList from '@components/PatientList'
import DoctorList from '@components/DoctorList'
import AdminList from '@components/AdminList'
import UserForm from '@components/UserForm'
import PatientForm from '@components/PatientForm'
import DoctorForm from '@components/DoctorForm'
import AdminForm from '@components/AdminForm'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import ConfirmationDialog from '@components/ConfirmationDialog'
import api from '@lib/api'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={`full-width-tabpanel-${ index }`}
      aria-labelledby={`full-width-tab-${ index }`}
      { ...other }
    >
      { value === index && (
        <Box sx={{ marginTop: 3 }}>{ children }</Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${ index }`,
    'aria-controls': `full-width-tabpanel-${ index }`,
  }
}

export default function UserManager() {
  const theme = useTheme()
  const [ value, setValue ] = useState(0)
  const [ editing, setEditing ] = useState( null )
  const [ confirmOpen, setConfirmOpen ] = useState( false )
  const [ confirm, setConfirm ] = useState( null )
  const [ lastAction, setLastAction ] = useState( new Date().valueOf())

  const handleChange = ( event, newValue ) => {
    setValue( newValue )
    setEditing( null )
  }

  const onLoad = () => {
  }

  const onEdit = ( obj ) => {
    setEditing( obj || {})
  }

  const cancelEdit = (e) => {
    setEditing( null )
  }

  const handleChangeIndex = ( index ) => {
    setValue( index )
  }

  const onDelete = ( data ) => {
    setConfirm({
      title: `Really delete '${ data.name }'?`,
      content: "All user data including appointments will be permanently erased. This cannot be undone. Are you sure?",
      actions: [
        {
          label: "No",
          handler: () => onCloseConfirm(),
        },
        {
          label: 'Yes',
          handler: () => onConfirmDelete( data.id ),
        },
      ]
    })
    setConfirmOpen( true )
  }

  const onCloseConfirm = () => {
    setConfirmOpen( false )
  }

  const onConfirmDelete = async ( id ) => {
    const res = await api._delete( `user/${ id }`)
    onCloseConfirm()
    setLastAction( new Date().valueOf() )
  }

  const updateUser = async ( e, data ) => {
    const result = await api.updateUser( data )
    setEditing( null )
  }

  const updatePatient = async ( e, data ) => {
    const result = await api.updatePatient( data )
    setEditing( null )
  }

  const updateDoctor = async ( e, data ) => {
    const creating = !editing || !editing.id
    const result = await api.updateDoctor( data )
    if ( creating ) {
      setEditing( result )
    } else {
      setEditing( null )
    }
  }

  const updateAdmin = async ( e, data ) => {
    const result = await api.updateAdmin( data )
    setEditing( null )
  }

  return (
    <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={ value }
        onChange={ handleChange }
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="full width tabs example"
        sx={{ '&.MuiTabs-root': {
          color: 'white',
          '& .MuiButtonBase-root': {
            color: 'white',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'white'
          }}}}
      >
        <Tab label="All Users" { ...a11yProps(0) } />
        <Tab label="Patients" { ...a11yProps(1) } />
        <Tab label="Doctors" { ...a11yProps(2) } />
        <Tab label="Admin Staff" { ...a11yProps(3) } />
      </Tabs>
      <SwipeableViews
        axis={ theme.direction === 'rtl' ? 'x-reverse' : 'x' }
        index={ value }
        onChangeIndex={ handleChangeIndex }
        style={{ flex: '1' }}
      >
        <TabPanel value={ value } index={0} dir={ theme.direction }>{
          editing
             ? <UserForm onCommit={ updateUser }
                         onCancel={ cancelEdit }
                         data={ editing }/>
             : <AllUsersList key={ lastAction }
                             onLoad={ onLoad }
                             onEdit={ onEdit }
                             onDelete={ onDelete }/>
        }</TabPanel>
        <TabPanel value={ value } index={1} dir={ theme.direction }>{
          editing
             ? <PatientForm onCommit={ updatePatient }
                            onCancel={ cancelEdit }
                            data={ editing }/>
          : <PatientList key={ lastAction }
                         onLoad={ onLoad }
                         onEdit={ onEdit }
                         onDelete={ onDelete }/>
        }</TabPanel>
        <TabPanel value={ value } index={2} dir={ theme.direction }>{
          editing
             ? <DoctorForm onCommit={ updateDoctor }
                           onCancel={ cancelEdit }
                           data={ editing }/>
             : <DoctorList key={ lastAction }
                           onLoad={ onLoad }
                           onEdit={ onEdit }
                           onDelete={ onDelete }/>
        }</TabPanel>
        <TabPanel value={ value } index={3} dir={ theme.direction }>{
          editing
             ? <AdminForm onCommit={ updateAdmin }
                          onCancel={ cancelEdit }
                          data={ editing }/>
             : <AdminList key={ lastAction }
                          onLoad={ onLoad }
                          onEdit={ onEdit }
                          onDelete={ onDelete }/>
        }</TabPanel>
      </SwipeableViews>
      { editing ? null
        : <Fab variant="extended"
               sx={{
                 position: 'fixed',
                 bottom: '1rem',
                 right: '1rem',
               }}
               onClick={ onEdit }>
            <AddIcon sx={{ mr: 1 }} />
            { value === 0 ? 'Add User'
              : value === 1 ? 'Add Patient'
              : value === 2 ? 'Add Doctor'
              : 'Add Admin Staff'
            }
          </Fab>
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
    </Box>
  )
}
