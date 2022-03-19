import React from 'react'
import Paper from '@mui/material/Paper'
import { ViewState } from '@devexpress/dx-react-scheduler'
import { format } from 'date-fns'
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui'
import { styled, alpha } from '@mui/material/styles'

const appointments = [
  // { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  // { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' }
  ,
]

const PREFIX = 'Bebop'

const classes = {
  todayCell: `${ PREFIX }-todayCell`,
  weekendCell: `${ PREFIX }-weekendCell`,
  today: `${ PREFIX }-today`,
  weekend: `${ PREFIX }-weekend`,
}

const StyledWeekViewTimeTableCell = styled( WeekView.TimeTableCell )(({ theme }) => ({
  [`&.${ classes.todayCell }`]: {
    backgroundColor: alpha( theme.palette.primary.main, 0.1 ),
    '&:hover': {
      backgroundColor: alpha( theme.palette.primary.main, 0.14 ),
    },
    '&:focus': {
      backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
    },
  },
  [`&.${ classes.weekendCell }`]: {
    backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
    '&:hover': {
      backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
    },
    '&:focus': {
      backgroundColor: alpha( theme.palette.action.disabledBackground, 0.04 ),
    },
  },
}))

const StyledWeekViewDayScaleCell = styled( WeekView.DayScaleCell )(({ theme }) => ({
  [`&.${ classes.today }`]: {
    backgroundColor: alpha( theme.palette.primary.main, 0.16 ),
  },
  [`&.${classes.weekend}`]: {
    backgroundColor: alpha( theme.palette.action.disabledBackground, 0.06 ),
  },
}))

const TimeTableCell = ( props ) => {
  const { startDate } = props
  const date = new Date( startDate )

  if (date.getDate() === new Date().getDate()) {
    return <StyledWeekViewTimeTableCell { ...props }
                                        className={ classes.todayCell } />
  } if ( date.getDay() === 0 || date.getDay() === 6 ) {
    return <StyledWeekViewTimeTableCell { ...props }
                                        className={ classes.weekendCell } />
  } return <StyledWeekViewTimeTableCell { ...props } />
}

const DayScaleCell = ( props ) => {
  const { startDate, today } = props

  if ( today ) {
    return <StyledWeekViewDayScaleCell { ...props } className={ classes.today } />
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <StyledWeekViewDayScaleCell { ...props } className={ classes.weekend } />
  } return <StyledWeekViewDayScaleCell { ...props } />
}

export default class NewAppointment extends React.PureComponent{
  constructor(props) {
    super(props)

    // this.auth = true

    this.state = {
      data: appointments,
      currentDate: format( new Date(), 'yyyy-MM-dd' ),
    }
    this.currentDateChange = ( currentDate ) => { this.setState({ currentDate }) }
  }

  render() {
    const { data, currentDate } = this.state
    return (
      <Paper>
        <Scheduler
          data={ appointments } >
          <ViewState />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <WeekView
            startDayHour={ 8 }
            endDayHour={ 16 }
            timeTableCellComponent={ TimeTableCell }
            dayScaleCellComponent={ DayScaleCell }
          />
          <Appointments />
        </Scheduler>
      </Paper>
    )
  }}
