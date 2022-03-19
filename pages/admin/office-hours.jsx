import Layout from '@layouts/admin'
import HoursPicker from '@components/HoursPicker'

function OfficeHours() {
  return (
    <Layout title="Office Hours" help="Click/tap hour slots to set office hours">
      <HoursPicker query="schedule/office-hours"/>
    </Layout>
  )
}

export default OfficeHours
