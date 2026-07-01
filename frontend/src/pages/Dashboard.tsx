import { useEffect } from 'react'
import { useSupplyStore } from '../store/supplyStore'
import StatsCards from '../components/StatsCards'
import TerminalForm from '../components/TerminalForm'
import TerminalList from '../components/TerminalList'
import ShipmentTracker from '../components/ShipmentTracker'
import AlertFeed from '../components/AlertFeed'

export default function Dashboard() {
  const { fetchTerminals, fetchShipments, fetchAlerts, fetchStats } = useSupplyStore()

  useEffect(() => {
    fetchStats()
    fetchTerminals()
    fetchShipments()
    fetchAlerts('active')
  }, [])

  return (
    <div>
      <StatsCards />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Terminals</h2>
          <TerminalForm />
          <TerminalList />
        </div>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Shipments</h2>
          <ShipmentTracker />
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Active Alerts</h2>
        <AlertFeed />
      </div>
    </div>
  )
}
