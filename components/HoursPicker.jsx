import React from 'react'
import { useFetch } from 'react-async'
import Paper from '@mui/material/Paper'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { format } from 'date-fns'
import Button from '@material-ui/core/Button'
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui'
import { styled, alpha } from '@mui/material/styles'


const hours = [ {}, {}, {}, {}, {}, {}, {} ]

const PREFIX = 'Bebop'

const classes = {
  todayCell: `${ PREFIX }-todayCell`,
  weekendCell: `${ PREFIX }-weekendCell`,
  today: `${ PREFIX }-today`,
  weekend: `${ PREFIX }-weekend`,
  override: `${ PREFIX}-override`,
}

const StyledWeekViewDayScaleCell = styled( WeekView.DayScaleCell )(({ theme }) => ({
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

const DayScaleCell = ( props ) => {
  return <StyledWeekViewDayScaleCell { ...props } className={ classes.override } />
}

function toAppointments( start, hours ) {
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
          title: 'Office Hours' })
      }
    } 
  }
  return appointments
}

export default function HoursPicker({ query, id }) {

  // this.auth = true
  const start = new Date()
  start.setDate( start.getDate() - start.getDay() )
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)

  const [ appointments, setAppointments  ] = React.useState([])
  const [ dirty,        setDirty         ] = React.useState( false )
  const [ busy,         setBusy          ] = React.useState( false )
  const startDate = format( start, 'yyyy-MM-dd' )

  // const { data, error } = useFetch( `/api/${ query }${ id? '/'+id : '' }`, {
  //   headers: { accept: "application/json" },
  // })
  // if ( data ) {
  //   setAppointments( data )
  // }

  const TimeTableCell = ( props ) => (
    <WeekView.TimeTableCell { ...props } onClick={ e => {
      const startDate = format( start, 'yyyy-MM-dd' )
      const date = props.startDate
      const d = date.getDay()
      const h = date.getHours()
      /* console.log( 'clicked cell', d, h, hours ) */
      hours[d][h] = !hours[d][h]
      setData( toAppointments( start, hours ))
    }}/>
  )

  return (
    <Paper>
      <Scheduler
        data={ appointments } >
        <ViewState />
        {/* <Toolbar/> */}
        <Button>{ 'Save Changes' }</Button>
        <WeekView
          startDayHour={ 6 }
          endDayHour={ 21 }
          cellDuration={ 60 }
          timeTableCellComponent={ TimeTableCell }
          dayScaleCellComponent={ DayScaleCell }
        />
        <Appointments />
      </Scheduler>
    </Paper>
  )
}
