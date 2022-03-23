import React from 'react'
import { useFetch } from 'react-async'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { format } from 'date-fns'
import Button from '@mui/material/Button'
import ConfirmationDialog from '@components/ConfirmationDialog'
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui'
import { styled, alpha } from '@mui/material/styles'
import DoctorSelect from '@components/DoctorSelect'
import api from '@lib/api'

const PREFIX = 'Bebop'

const classes = {
  cell: `${ PREFIX}-cell`,
  todayCell: `${ PREFIX }-todayCell`,
  closedCell: `${ PREFIX }-closedCell`,
  closedDayCell: `${ PREFIX }-closedDayCell`,
  today: `${ PREFIX }-today`,
  closed: `${ PREFIX }-closed`,
  label: `${ PREFIX }-label`,
  // title: `${ PREFIX }-title`,
}

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
  [`&.${ classes.cell }`]: {
    [` .${ classes.label }`]: {
      textAlign: 'center',
      color: alpha( theme.palette.primary.main, 0.5 )
    },
    '&:hover': {
      backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
      [` .${ classes.label }`]: {
        color: theme.palette.primary.main,
      },
    },
    '&:focus': {
      backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
      [` .${ classes.label }`]: {
        color: theme.palette.primary.main,
      },
    },
    [`&.${ classes.todayCell }`]: {
      backgroundColor: alpha( theme.palette.primary.main, 0.1 ),
      '&:hover': {
        backgroundColor: alpha( theme.palette.primary.main, 0.14 ),
      },
      '&:focus': {
        backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
      },
    },
    [`&.${ classes.closedCell }`]: {
      backgroundColor: alpha( theme.palette.action.disabledBackground, 0.1 ),
      [` .${ classes.label }`]: {
        display: 'none',
      },
      '&:hover': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.1 ),
        [` .${ classes.label }`]: {
          display: 'none',
        },
      },
      '&:focus': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.1 ),
        [` .${ classes.label }`]: {
          display: 'none',
        },
      }
    },
    [`&.${ classes.closedDayCell }`]: {
      [` .${ classes.label }`]: {
        display: 'none',
      },
      backgroundColor: alpha( theme.palette.action.disabledBackground, 0.2 ),
      '&:hover': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.2 ),
        [` .${ classes.label }`]: {
          display: 'none',
        },
      },
      '&:focus': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.2 ),
        [` .${ classes.label }`]: {
          display: 'none',
        },
      },
    },
  },
}));

const StyledWeekViewDayScaleCell = styled( WeekView.DayScaleCell )(({ theme }) => ({
  [`&.${ classes.today }`]: {
    backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
  },
  [`&.${ classes.closed }`]: {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.08),
  }
}))

const CellTitle = styled( 'div' )(({ theme }) => ({
  // [`&.${ classes.title }`]: {
  position: 'relative',
  textAlign: 'center',
  // verticalAlign: 'middle',
  height: '100%',
  fontWeight: 'bold',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  '>div': {
    position: 'relative',
    flex: '1'
  }
  // }
}))

function toAppointments( start, hours, title = 'Open' ) {
  const appointments = []
  for ( const day of [ 0, 1, 2, 3, 4, 5, 6 ]) {
    for ( const h in hours[ day ]) {
      if ( hours[ day ][h] ) {
        const startDate = new Date( start )
        startDate.setDate( start.getDate() + day )
        startDate.setHours(parseInt(h))
        const endDate = new Date( startDate )
        endDate.setHours( parseInt(h) + 1 )
        appointments.push({
          startDate: format( startDate, "yyyy-MM-dd'T'HH:mm:ss" ),
          endDate: format( endDate, "yyyy-MM-dd'T'HH:mm:ss" ),
          title })
      }
    } 
  }
  return appointments
}

function makeFullDay( start, end ) {
  const day = {}
  for ( let i = start; i <= end; i++ ) {
    day[ i ] = true
  }
  return day
}

function filterHours( available, doctorIds ) {
  return !doctorIds || !doctorIds.length ? available : available.map( day => {
    const filtered = {}
    for ( const h in day ) {
      const hour = day[h]
      if ( hour.find(({ doctor: { id }}) => doctorIds.indexOf( id ) > -1 )) {
        filtered[h] = hour
      }
    }
    return filtered
  })
}

function getDoctors( available ) {
  const memo = {}
  const doctors = []
  for ( const day of available ) {
    for ( const hour of Object.values( day )) {
      for ( const doctor of hour ) {
        if ( !memo[ doctor.doctor.id ] ) {
          memo[ doctor.doctor.id ] = doctor
          doctors.push( doctor.doctor )
        }
      }
    }
  }
  return doctors
}

export default class Schedule extends React.PureComponent {

  constructor( props ) {
    super( props )
    const {
      query,
      maskQuery,
      maskId,
      startDayHour,
      endDayHour,
      cellTitle,
      appointments,
    } = props
    // this.auth = true
    const today = new Date()
    const start = new Date()
    start.setDate( start.getDate() - start.getDay() )
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)
    this.start = start
    this._isMounted = false

    this.state = {
      availableHours: [ {}, {}, {}, {}, {}, {}, {} ],
      filteredHours: [ {}, {}, {}, {}, {}, {}, {} ],
      availableFetched: new Date().toISOString(),
      hours: [ {}, {}, {}, {}, {}, {}, {} ],
      appointments: ( appointments || [] ).map( data => {
        const endDate = new Date( data.date )
        endDate.setHours( endDate.getHours() + 1 )
        return {
          startDate: data.date,
          endDate,
          title: data.hour.doctor.title,
          data,
        }
      }),
      dirty: false,
      busy: 0,
      startDayHour: startDayHour || 6,
      endDayHour: endDayHour || 21,
      cellTitle: cellTitle || 'Open',
      currentDate: format( today, 'yyyy-MM-dd' ),
      query: query || 'schedule/open-slots',
      doctors: [],
      doctorIds: [],
      confirmOpen: false,
      confirm: false
    }

    this.getSlots = ( currentDate ) => {
      const { query, id } = this.state
      const startDate = new Date( currentDate )
      startDate.setDate( startDate.getDate() - startDate.getDay() )
      const endDate = new Date( startDate )
      endDate.setDate( startDate.getDate() + 7 )
      const start = format( startDate, 'yyyy-MM-dd' )
      const end = format( endDate, 'yyyy-MM-dd' )
      fetch( `/api/${ query }?start=${ start }&end=${ end }`)
         .then( res => res.json() )
         .then( res => {
           if ( res.ok ) {
             const { doctorIds } = this.state
             if ( this._isMounted ) {
               this.setState({
                 availableHours: res.result,
                 doctors: getDoctors( res.result ),
                 filteredHours: filterHours( res.result, doctorIds ),
                 availableFetched: new Date().toISOString(),
               })
             } else {
               Object.assign(this.state, {
                 availableHours: res.result,
                 doctors: getDoctors( res.result ),
                 filteredHours: filterHours( res.result, doctorIds ),
                 availableFetched: new Date().toISOString(),
               })
             }
           }
         })
    }

    this.currentDateChange = ( currentDate ) => {
      this.setState({ currentDate })
      this.getSlots( currentDate )
    }

    fetch ( '/api/schedule/hours-range' )
       .then( res => res.json())
       .then( res => {
         if ( res.ok ) {
           const[ startDayHour, endDayHour ] = res.result
           if ( this._isMounted ) {
             this.setState({
               startDayHour,
               endDayHour,
               availableHours: [
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
               ]
             })

           } else {
             Object.assign(this.state, {
               startDayHour,
               endDayHour,
               availableHours: [
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
                 makeFullDay( startDayHour, endDayHour ),
               ]
             })
           }
           this.getSlots( today )
         }
       })
    this.onDoctorSelect = ( doctorIds ) => {
      this.setState({
        doctorIds,
        filteredHours: filterHours( this.state.availableHours, doctorIds ),
        // availableFetched: new Date().toISOString(),
      })
    }
    this.handleCloseConfirm = async ( confirmed ) => {
      if ( confirmed ) {
        const { hour: { id }, date } = this.state.confirm
        const res = await api.post( 'schedule/appointments', { hour: { id }, date })
        if ( res && res.ok ) {
          const data =  res.result
          const endDate = new Date( data.date )
          endDate.setHours( endDate.getHours() + 1 )
          console.log( 'added appointment', data )
          this.getSlots( this.state.currentDate )
          this.setState({
            appointments: [
              ...this.state.appointments,
              {
                startDate: data.date,
                endDate,
                title: data.hour.doctor.title,
                data,
              }
            ]
          })
        } // TODO: else
      }
      this.setState({ confirmOpen: false })
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  TimeTableCell = ({ hours, ...props }) => {
    const date = props.startDate
    const now = new Date()
    const today = date.getDate() === now.getDate()
    const d = date.getDay()
    const h = date.getHours()
    const closedDay = date < now
    // const closed = !this.state.availableHours[d][h]
    const closed = !hours[d][h]
    return <StyledWeekViewTimeTableCell
             { ...props }
             className={`${ classes.cell } ${
                            today ? classes.todayCell : '' } ${
                            closed ? classes.closedCell : '' } ${
                            closedDay ? classes.closedDayCell: '' }`}
             onClick={ e => {
               const hours = this.state.filteredHours
               const filter = this.state.doctorIds
               const startDate = format( this.start, 'yyyy-MM-dd' )
               const doctors = hours[d][h]
               const hour = ( filter.length ?
                                doctors.filter(({ doctor: { id }}) =>
                                  filter.indexOf( id ) > -1 )
                                : doctors )[0]
               console.log( 'booking', { date, hour })
               this.setState({ confirm: { date, hour }})
               this.setState({ confirmOpen: true })
             }}>
             <div className={ classes.label }>Select</div>
           </StyledWeekViewTimeTableCell>
  }

  DayScaleCell = ( props ) => {
    const date = props.startDate
    const d = date.getDay()
    const closed = date < new Date()
    return <StyledWeekViewDayScaleCell
             { ...props }
             className={`${ closed ? classes.closed : '' }`} />
  }

  Appointment = ( props ) => {
    return <Appointments.Appointment { ... props } /* onClick={ e => { */
    /*   const hours = this.state.hours */
    /*   const { data } = e */
    /*   const start = new Date( data.startDate ) */
    /*   const d = start.getDate() - this.start.getDate() */
    /*   const h = start.getHours() */
    /*   hours[d][h] = !hours[d][h] */
    /*   const appointments = toAppointments( this.start, hours, this.state.cellTitle ) */
    /*   this.setState({ hours, appointments, dirty: true }) */
    /* }} *//>
  }

  AppointmentContent = ({ data, ...props }) => {
    return (
      <CellTitle>
        <div>{
          data.title
        }</div>
      </CellTitle>
    )
  }

  render() {
    const {
      appointments,
      filteredHours,
      currentDate,
      doctors,
      doctorIds,
      confirm,
      confirmOpen,
    } = this.state
    const { TimeTableCell, handleCloseConfirm } = this
    return (
      <div>
        {/* <Card> */}
        {/*   <CardContent> */}
        <DoctorSelect label="Specific doctor(s)"
                      theme="dark"
                      options={ doctors }
                      selected={ doctorIds }
                      onChange={ this.onDoctorSelect } />
        {/*   </CardContent> */}
        {/* </Card> */}

       <Paper sx={{ overflow: 'hidden'}}>
         <Scheduler data={ appointments }>
          <ViewState currentDate={ currentDate }
                     onCurrentDateChange={ this.currentDateChange }
          />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <WeekView
            /* key={ this.state.availableFetched } */
            startDayHour={ this.state.startDayHour }
            endDayHour={ this.state.endDayHour }
            cellDuration={ 60 }
            timeTableCellComponent={
              ( props ) => <TimeTableCell hours={filteredHours} { ...props } />
            }
            dayScaleCellComponent={ this.DayScaleCell }
          />
          <Appointments
            appointmentComponent={ this.Appointment }
          />
        </Scheduler>
      </Paper>
        <ConfirmationDialog
          open={ confirmOpen }
          onClose={ handleCloseConfirm }
          title="Make Appointment?"
          content={
            `Make Appointment with ${
              confirm && confirm.hour.doctor.title
            } at ${
              confirm && confirm.date.toLocaleString()
            }?`
          }
          actions={[
            {
              label: 'Cancel',
              handler: () => handleCloseConfirm(),
            },
            {
              label: 'Confirm',
              handler: () => handleCloseConfirm( true ),
            },
          ]}
        />
      </div>
    )
  }
}
