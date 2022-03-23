import React from 'react'
import { useFetch } from 'react-async'
import Paper from '@mui/material/Paper'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { format } from 'date-fns'
import Button from '@mui/material/Button'
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui'
import { styled, alpha } from '@mui/material/styles'


const PREFIX = 'Bebop'

const classes = {
  cell: `${ PREFIX}-cell`,
  todayCell: `${ PREFIX }-todayCell`,
  closedCell: `${ PREFIX }-closedCell`,
  closedDayCell: `${ PREFIX }-closedDayCell`,
  today: `${ PREFIX }-today`,
  closed: `${ PREFIX }-closed`,
  override: `${ PREFIX}-override`,
  // title: `${ PREFIX }-title`,
}

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
  [`&.${ classes.cell }`]: {
    '&:hover': {
      backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
    },
    '&:focus': {
      backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
    },
    [`&.${ classes.closedCell }`]: {
      backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
      '&:hover': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
      },
      '&:focus': {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
      },
      [`&.${ classes.closedDayCell }`]: {
        backgroundColor: alpha( theme.palette.action.disabledBackground, 0.08 ),
        '&:hover': {
          backgroundColor: alpha( theme.palette.action.disabledBackground, 0.08 ),
        },
        '&:focus': {
          backgroundColor: alpha( theme.palette.action.disabledBackground, 0.08 ),
        },
      },
    },
  },
}));

const StyledWeekViewDayScaleCell = styled( WeekView.DayScaleCell )(({ theme }) => ({
  [`&.${ classes.closed }`]: {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.08),
  },
  [`&.${ classes.override }`]: {
    [`.Cell-highlightedText`]: {
      // backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
      backgroundColor: 'inherit',
      color: theme.palette.text.secondary,
      fontWeight: 'inherit',
    },
    [`.Cell-dayOfWeek`]: {
      fontSize: '1.5rem',
    },
    [`.Cell-dayOfMonth`]: {
      display: 'none',
    }
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

export default class HoursPicker extends React.PureComponent {

  constructor( props ) {
    super( props )
    const { query,
            maskQuery,
            id,
            maskId,
            startDayHour,
            endDayHour,
            cellTitle,
          } = props
    // this.auth = true
    const start = new Date()
    start.setDate( start.getDate() - start.getDay() )
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)
    this.start = start
    this._isMounted = false

    this.state = {
      availableHours: [ {}, {}, {}, {}, {}, {}, {} ],
      availableFetched: new Date().toISOString(),
      hours: [ {}, {}, {}, {}, {}, {}, {} ],
      appointments: [],
      dirty: false,
      busy: 0,
      startDayHour: startDayHour || 6,
      endDayHour: endDayHour || 21,
      cellTitle: cellTitle || 'Open'
    }

    const apiUrl = `/api/${ query }${ id? '/' + id : '' }`
    fetch( apiUrl, {
      headers: { accept: 'application/json' },
    })
       .then( res => res.json() )
       .then(({ ok, hours })=> {
         if ( this._isMounted ) {
           this.setState({ busy: this.state.busy - 1 })
         } else {
           --this.state.busy
         }
         if ( hours ) {
           hours = hours.map( day => {
             const dayObj = {}
             for ( const hour of day ) {
               dayObj[ hour.start ] = hour.active
             }
             return dayObj
           })
           const appointments = toAppointments( this.start, hours, cellTitle )
           if ( this._isMounted ) {
             this.setState({ hours, appointments })
           } else {
             Object.assign(this.state, { hours, appointments })
           }
         } // TODO: else
       }) // TODO: .catch( error )
    if ( maskQuery ) {
      ++this.state.busy
      const apiUrl = `/api/${ maskQuery }${ maskId? '/' + maskId : '' }`
      fetch( apiUrl, {
        headers: { accept: 'application/json' },
      })
         .then( res => res.json() )
         .then(({ ok, hours })=> {
           if ( this._isMounted ) {
           this.setState({ busy: this.state.busy - 1 })
         } else {
           --this.state.busy
           }
           if ( hours ) {
             const availableHours = hours.map( day => {
               const dayObj = {}
               for ( const hour of day ) {
                 dayObj[ hour.start ] = hour.active
               }
               return dayObj
             })
             if ( this._isMounted ) {
               this.setState({
                 availableHours,
                 availableFetched: new Date().toISOString()
               })
             } else {
               Object.assign(this.state, {
                 availableHours,
                 availableFetched: new Date().toISOString()
               })
             }
           } // TODO: else
         }) // TODO: .catch( error )
    } else {
      this.state.availableHours = [
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
        makeFullDay( this.state.startDayHour, this.state.endDayHour ),
      ]
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  TimeTableCell = ( props ) => {
    const date = props.startDate
    const d = date.getDay()
    const h = date.getHours()
    const closedDay = !Object.keys( this.state.availableHours[d] ).length
    const closed = !this.state.availableHours[d][h]
    return <StyledWeekViewTimeTableCell
             { ...props }
             className={`${ classes.cell } ${
                            closed ? classes.closedCell : '' } ${
                            closedDay ? classes.closedDayCell: '' }`}
             onClick={ e => {
               if ( !this.state.availableHours[d][h] ) return
               const hours = this.state.hours
               const startDate = format( this.start, 'yyyy-MM-dd' )
               hours[d][h] = !hours[d][h]
               const appointments = toAppointments(
                 this.start,
                 hours,
                 this.state.cellTitle )
               this.setState({ hours, appointments, dirty: true })
             }}/>
  }

  DayScaleCell = ( props ) => {
    const date = props.startDate
    const d = date.getDay()
    const closed = !Object.keys( this.state.availableHours[d] ).length
    console.log({ hours: this.state.availableHours, closed })
    return <StyledWeekViewDayScaleCell
             { ...props }
             className={`${ classes.override } ${ closed ? classes.closed : '' }`} />
  }

  Appointment = ( props ) => {
    return <Appointments.Appointment { ... props } onClick={ e => {
      const hours = this.state.hours
      const { data } = e
      const start = new Date( data.startDate )
      const d = start.getDate() - this.start.getDate()
      const h = start.getHours()
      hours[d][h] = !hours[d][h]
      const appointments = toAppointments( this.start, hours, this.state.cellTitle )
      this.setState({ hours, appointments, dirty: true })
    }}/>
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
    return (
      <Scheduler data={ this.state.appointments }>
        <ViewState />
        {/* <Toolbar/> */}
        { this.state.dirty ?
          <Button onClick={ e => {
            const { query, id } = this.props
            const apiUrl = `/api/${ query }${ id? '/' + id : '' }`
            fetch( apiUrl, {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify( this.state.hours )
            })
               .then( res => res.json() )
               .then( res => {
                 if ( res.ok ) {
                   this.setState({ dirty: false })
                 }
               })
          }} >{
            'Save Changes'
          }</Button> : '' }
        <WeekView
          key={ this.state.availableFetched }
          startDayHour={ this.state.startDayHour }
          endDayHour={ this.state.endDayHour }
          cellDuration={ 60 }
          timeTableCellComponent={ this.TimeTableCell }
          dayScaleCellComponent={ this.DayScaleCell }
        />
        <Appointments
          appointmentComponent={ this.Appointment }
          appointmentContentComponent={ this.AppointmentContent }
        />
      </Scheduler>
    )
  }
}
