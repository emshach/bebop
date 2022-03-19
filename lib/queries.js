import prisma from './prisma'
import { format } from 'date-fns'



function getDaysBetween( start, end ) {
  let day = new Date( start )
  end = new Date( end )
  const days = []
  while ( day <= end ) {
    // days.push( format( day, 'yyyy-MM-dd' ))
    days.push( new Date( day ))
    day.setDate( day.getDate() + 1 )
  }
  return days
}

export async function getOfficeHours({ includeInactive = false }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const query = {
    orderBy: [
      { day: 'asc' },
      { start: 'asc' }
    ]
  }
  if ( !includeInactive ) {
    query.where = { active: true }
  }
  const hours = await prisma.hour.findMany( query )
  for ( const hour of hours ) {
    weekDays[ hour.day ].push( hour )
  }
  return weekDays
}

export async function updateOfficeHours() {
  
}

export async function getOpenSlots({ start, end }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const slots = []
  const daysByDate = {}
  const dates = getDaysBetween( start, end ).map( date => {
    const dateString = format( date, 'yyyy-MM-dd' )
    const item = {
      date,
      dateString,
      day: weekDays[ date.getDay() ],
      slots: [],
      appointments: {},
    }
    daysByDate[ dateString ] = item
    return item
  })
  // TODO: get apts between start and end
  // TODO: get office hours
  const [ appointments, hours ] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        hour: {
          select: {
            id: true,
            hour: {
              select: {
                id: true
              }
            },
            doctor: {
              select: {
                id: true
              }
            }
          }
        }
      },
      where: {
        AND: {
          date: {
            gte: start
          },
          date: {
            lte: end
          }
        }
      }, 
    }),
    prisma.hour.findMany({
      include: {
        doctors: {
          select: {
            doctor: {
              include: {
                user: true
              }
            }
          }
        },
      },
      where: {
        active: true
      },
      orderBy: [
        { day: 'asc' },
        { start: 'asc' }
      ]
    }),
  ])
  for ( const hour of hours ) {
    days[ hour.day ].push( hour )
  }
  for ( const apt of appointments ) {
    const date = format( apt.date, 'yyyy-MM-dd' )
    const hour = apt.hour.hour.id
    const doctor = apt.hour.doctor.id
    // aptsById[ apt.id ] = apt
    const dayApts = dates[ date ].appointments
    if ( !dayApts[ hour ]) {
      dayApts[ hour ] = {}
    }
    dayApts[ hour ][ doctor ] = true
  }
  for ( const date of dates ) {
    const apts = date.appointments
    for ( const hour of date.day ) {
      const freeDoctors = apts[ hour.id ]
            ? hour.doctors.filter( d => (
              !apts[ hour.id ][ d.doctor.id ]
            ))
            : hour.doctors
      if ( freeDoctors.length ) {
        const start = hour.start.length < 2 ? `0${ hour.start }` : hour.start
        const end = hour.start.length < 2 ? `0${ hour.start + 1 }` : (hour.start + 1)
        slots.push({
          startDate: `${ date.date }T${ start }:00`,
          endDate: `${ date.date }T${ end }:00`,
          title: 'Available',
          data: { freeDoctors }
        })
      }
    }
  }
  return slots
}
