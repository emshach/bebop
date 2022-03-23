import Layout from '@layouts/admin'
import Paper from '@mui/material/Paper'
import HoursPicker from '@components/HoursPicker'

function OfficeHours() {
  return (
    <Layout title="Office Hours" help="Click/tap hour slots to set office hours">
      <Paper>
        <HoursPicker query="schedule/office-hours"/>
      </Paper>
    </Layout>
  )
}

export default OfficeHours
