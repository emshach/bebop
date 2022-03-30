import prisma from './prisma'
import { format } from 'date-fns'

function getDaysBetween( start, end ) {
  let day = new Date( start )
  const today = new Date()
  if ( day < today ) {
    day = today
  }
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

export async function updateOfficeHours({ hours, keepCurrent = false }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const newHours = []
  const updateClosedHours = []
  const updateOpenHours = []
  const currentHours = await prisma.hour.findMany({
    orderBy: [
      { day: 'asc' },
      { start: 'asc' }
    ]
  })
  const currentWeek = [ [], [], [], [], [], [], [] ]
  for ( const hour of currentHours ) {
    currentWeek[ hour.day ].push( hour )
  }
  for ( const day of [ 0, 1, 2, 3, 4, 5, 6 ]) {
    for ( const hour of currentWeek[ day ]) {
      if ( hours[ hour.day ][ hour.start ]) {
        delete hours[ hour.day ][ hour.start ]
        if ( !hour.active ) {
          updateOpenHours.push( hour.id )
          hour.active = true
        }
        weekDays[ hour.day ].push( hour )
      } else if (( keepCurrent && hour.active)) {
        weekDays[ hour.day ].push( hour )
      } else {
        delete hours[ hour.day ][ hour.start ]
        updateClosedHours.push( hour.id )
      }
    }
  }
  for ( const day of [ 0, 1, 2, 3, 4, 5, 6 ]) {
    for ( let start in hours[ day ]) {
      start = parseInt( start )
      const hour = { day, start }
      newHours.push( hour )
      weekDays[ day ].push( hour )
    }
  }
  const [ updatedClosed, updatedOpen ] = await Promise.all([
    ( !keepCurrent && updateClosedHours.length ) &&
       prisma.hour.updateMany({
         where: { id: { in: updateClosedHours }},
         data: { active: false }
       }),
    // TODO: check updated.count = updatedHours.length
    updateOpenHours.length &&
       prisma.hour.updateMany({
         where: { id: { in: updateOpenHours }},
         data: { active: true }
       })
  ])

  const created = await prisma.hour.createMany({ data: newHours })
  // TODO: check created.count === newHours.length

  return weekDays
}

export async function getDoctorHours({ id, includeInactive = false }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const query = {
    where: { id },
    orderBy: [
      { day: 'asc' },
      { start: 'asc' }
    ]
  }
  if ( !includeInactive ) {
    query.where = {
      AND: [
        query.where,
        { active: true} ,
        {
          hours: {
            active: true
          }
        }
      ]
    }
  }
  const doctor = await prisma.doctorProfile.findUnique({
    select: {
      hours: {
        include: {
          hour: true
        }
      }
    },
    where: { id }
  })
  const hours = doctor.hours
  for ( const hour of hours ) {
    hour.day = hour.hour.day
    hour.start = hour.hour.start
    weekDays[ hour.day ].push( hour )
  }
  return weekDays
}

export async function updateDoctorHours({ id, hours, keepCurrent = true }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const hoursById = {}
  const newHours = []
  const updateClosedHours = []
  const updateOpenHours = []
  const [ currentHours, currentDoctorHours ] = await Promise.all([
    prisma.hour.findMany({
      orderBy: [
        { day: 'asc' },
        { start: 'asc' }
      ]
    }),
    prisma.doctorHour.findMany({
      include: {
        hour: {
          select: {
            id: true,
          }
        }
      },
      where: {
        doctorId: id
      },
      orderBy: [
        {
          hour: {
            day: 'asc' 
          }
        },
        {
          hour: {
            start: 'asc'
          }
        }
      ]
    })
  ])
  const currentWeek = [ {}, {}, {}, {}, {}, {}, {} ]
  for ( const hour of currentHours ) {
    currentWeek[ hour.day ][ hour. start ] = hour
  }
  const currentDoctorWeek = [ [], [], [], [], [], [], [] ]
  for ( const hour of currentDoctorHours ) {
    hour.hour = hoursById[ hour.hour.id ]
    currentDoctorWeek[ hour.day ].push( hour )
  }
  for ( const day of [ 0, 1, 2, 3, 4, 5, 6 ]) {
    for ( const hour of currentDoctorWeek[ day ]) {
      if ( hours[ hour.hour.day ][ hour.hour.start ]) {
        delete hours[ hour.hour.day ][ hour.hour.start ]
          if ( !hour.active ) {
            updateOpenHours.push( hour.id )
            hour.active = true
          }
        if ( hour.hour.active ) {
          weekDays[ hour.day ].push( hour )
        } 
      } else if (( keepCurrent && hour.active)) {
        if ( hour.hour.active ) {
          weekDays[ hour.day ].push( hour )
        }
      } else {
        updateClosedHours.push( hour.id )
      }
    }
  }
  for ( const day of [ 0, 1, 2, 3, 4, 5, 6 ]) {
    for ( let start in hours[ day ]) {
      const officeHour = currentWeek[ day ][ start ]
      if ( officeHour ) {
        start = parseInt( start )
        const hour = { hourId: officeHour.id, doctorId: id }
        newHours.push( hour )
        if ( officeHour.active ) {
          weekDays[ day ].push({ ...hour, hour: officeHour })
        }
      }
    }
  }
  const [ updatedClosed, updatedOpen ] = await Promise.all([
    ( !keepCurrent && updateCloseddHours.length ) &&
       prisma.doctorHour.updateMany({
         where: { id: { in: updateClosedHours }},
         data: { active: false }
       }),
    // TODO: check updated.count = updatedHours.length
    updateOpenHours.length &&
       prisma.doctorHour.updateMany({
         where: { id: { in: updateOpenHours }},
         data: { active: true }
       })
  ])

  const created = await prisma.doctorHour.createMany({ data: newHours })
  // TODO: check created.count === newHours.length

  return weekDays
}

export async function getHoursRange() {
  const [ earliest, latest ] = await Promise.all([
    prisma.hour.findFirst({
      where: {
        active: true
      },
      orderBy: {
        start: 'asc'
      }
    }),
    prisma.hour.findFirst({
      where: {
        active: true
      },
      orderBy: {
        start: 'desc'
      }
    })
  ])
  return [ earliest && earliest.start - 1, latest && latest.start + 2 ]
}

export async function getOpenSlots({ start, end, ids }) {
  const weekDays = [ [], [], [], [], [], [], [] ]
  const slots = [ {}, {}, {}, {}, {}, {}, {} ]
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
        AND: [
          {
            date: {
              gte: new Date( start )
            }
          },
          {
            date: {
              lte: new Date( end )
            }
          }
        ]
      },
    }),
    prisma.hour.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            doctor: true,
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
    weekDays[ hour.day ].push( hour )
  }
  for ( const apt of appointments ) {
    const date = format( apt.date, 'yyyy-MM-dd' )
    const hour = apt.hour.hour.id
    const doctor = apt.hour.doctor.id
    // aptsById[ apt.id ] = apt
    if ( daysByDate[ date ]) {
      const dayApts = daysByDate[ date ].appointments
      if ( !dayApts[ hour ]) {
        dayApts[ hour ] = {}
      }
      dayApts[ hour ][ doctor ] = true
    }
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
        // const start = hour.start.length < 2 ? `0${ hour.start }` : hour.start
        // const end = hour.start.length < 2 ? `0${ hour.start + 1 }` : (hour.start + 1)
        // slots.push({
        //   startDate: `${ date.date }T${ start }:00`,
        //   endDate: `${ date.date }T${ end }:00`,
        //   title: 'Available',
        //   data: { freeDoctors }
        // })
        slots[ hour.day ][ hour.start ] = freeDoctors
      }
    }
  }
  return slots
}

export async function createUser({
  id,
  doctor,
  doctorTitle,
  doctorProfile,
  sendEmail,
  ...data }) {
  const user = await prisma.user.create({ data })

  if ( doctor && !doctorProfile ) {
    await prisma.doctorProfile.create({
      data: {
        user: { connect: { id: user.id }},
        title: doctorTitle,
      }})
  }
  return prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      admin: true,
      superuser: true,
      doctorProfile: true,
      _count: {
        select: {
          appointments: true,
        }
      }
    },
    where: { id: user.id }
  })
}

export async function updateUser({
  id,
  doctor,
  doctorTitle,
  doctorProfile,
  sendEmail,
  ...data }) {
  const user = await prisma.user.update({ where: { id }, data })
  if ( doctor && !doctorProfile ) {
    await prisma.doctorProfile.create({
      data: {
        user: { connect: { id }},
        title: doctorTitle,
      }})
  }
  return prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      admin: true,
      superuser: true,
      doctorProfile: true,
      _count: {
        select: {
          appointments: true,
        }
      }
    },
    where: { id: user.id }
  })
}

export async function deleteUser( id ) {
  return prisma.user.delete({ where: { id }})
}

export async function getUser( id ) {
  const [ profile, user ] = await Promise.all([
    prisma.profile.findUnique({ where: { id }}),
    prisma.user.findUnique({ where: { id }})
  ])
  if ( !user ) {
    return null
  }
  if ( !profile ) {
    const result = await prisma.profile.create({
      data: {
        user: { connect: { id }}
      }
    })
    // TODO: if !result error
  }
  return prisma.user.findUnique({
    include: {
      profile: {
        select: {
          addresses: true,
          contacts: true
        }
      }
    },
    where: { id }
  })
}

export async function getUserByEmail( email ) {
  return prisma.user.findUnique({ where: { email }})
}

export async function getUsersTable() {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      admin: true,
      superuser: true,
      doctorProfile: true,
      _count: {
        select: {
          appointments: true,
        }
      }
    }
  })
  return {
    columns: [
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'roles',
        label: 'Roles',
        default: 'none',
        render: { join: ', ' }
      }
    ],
    rows: result.map( user => {
      const roles = []
      if ( user._count.appointments > 0 ) {
        roles.push( 'patient' )
      }
      if ( user.doctorProfile ) {
        roles.push( 'doctor' )
      }
      if ( user.admin ) {
        roles.push( 'admin' )
      }
      if ( user.superuser ) {
        roles.push( 'superuser' )
      }
      user.roles = roles
      return user
    })
  }
}

export async function getPatientsTable() {
  const now = new Date()
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      appointments: true,
    },
    where: {
      appointments: {
        some: {}
      }
    }
  })
  return {
    columns: [
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'appointments',
        label: 'Upcoming Appointments',
        default: 'none',
      }
    ],
    rows: result.map(({ appointments, ...patient }) => {
      let count = 0
      for ( const apt of appointments ) {
        if ( apt.date > now ) {
          ++count
        }
      }
      patient.appointments = count
      return patient
    })
  }
}

export async function getDoctorsTable() {
  const now = new Date()
  const result = await prisma.doctorProfile.findMany({
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      hours: {
        select: {
          appointments: true,
        }
      }
    }
  })
  return {
    columns: [
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'appointments',
        label: 'Upcoming Appointments',
        default: 'none',
      }
    ],
    rows: result.map( doctor => {
      const user = { ... doctor.user }
      let appointments = 0
      for ( const hour of doctor.hours ) {
        for ( const apt of hour.appointments ) {
          if ( apt.date > now ) {
            ++appointments
          }
        }
      }
      user.appointments = appointments
      return user
    })
  }
}

export async function getAdminsTable() {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      admin: true,
      superuser: true,
    },
    where: {
      OR: [
        { admin: true },
        { superuser: true }
      ]
    }
  })
  return {
    columns: [
      {
        name: 'name',
        label: 'Name',
      },
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'superuser',
        label: 'Superuser',
        render: { test: [ 'Yes', 'No' ]}
      },
    ],
    rows: result
  }
}

export async function getAddresses( id ) {
  const result = prisma.profile.findUnique({
    select: { addresses: true },
    where: { id }
  })
  if ( result ) {
    return result.addresses
  }
}

export async function createAddress( id, address ) {
  return prisma.address.create({
    data: {
      ...address,
      user: { connect: { id }}
    }
  })
}

export async function setUserAddress( id, addressId ) {
  const user = await prisma.profile.findUnique({
    select: {
      addresses: {
        select: {
          id: true,
          primary: true
        }
      }
    },
    where: { id }
  })
  const deactivate = user.addresses.filter(({ id }) => id !== addressId )
  if ( deactivate.length ) {
    await prisma.address.updateMany({
      data: { primary: false },
      where: { id: addressId }
    })
  }
  return prisma.address.update({
    data: { primary: true },
    where: { id: addressId }
  })
}

export async function getAppointments( id ) {
  return prisma.appointment.findMany({
    include: {
      hour: {
        include: { doctor: true }
      }
    },
    where: {
      patient: { id }
    }
  })
}

export async function createAppointment({ id, sendEmail, hour, patientId, ...data }) {
  const appointment = await prisma.appointment.create({
    data: {
      ...data,
      hour: { connect: { id: hour.id }},
      patient: { connect: { id: patientId }}
    }})
  return prisma.appointment.findUnique({
    include: {
      hour: {
        include: { doctor: true }
      }
    },
    where: { id: appointment.id },
  })
}

export async function updateAppointment({ id, sendEmail, hour, patientId, ...data }) {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      ...data,
      hour: { connect: { id: hour.id }},
      patient: { connect: { id: patientId }}
    }})
  return prisma.appointment.findUnique({
    include: {
      hour: {
        include: { doctor: true }
      }
    },
    where: { id },
  })
}
