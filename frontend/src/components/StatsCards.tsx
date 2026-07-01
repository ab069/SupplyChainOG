import { useSupplyStore } from '../store/supplyStore'

export default function StatsCards() {
  const { terminalStats, shipmentStats, alertStats } = useSupplyStore()

  const cards = [
    {
      label: 'Total Terminals',
      value: terminalStats?.total_terminals ?? 0,
      color: '#4f46e5',
    },
    {
      label: 'Total Capacity',
      value: terminalStats ? `${(terminalStats.total_capacity_bbl / 1000).toFixed(0)}K bbl` : '0',
      color: '#22c55e',
    },
    {
      label: 'Current Stock',
      value: terminalStats ? `${(terminalStats.current_stock_bbl / 1000).toFixed(0)}K bbl` : '0',
      color: '#f59e0b',
    },
    {
      label: 'Active Shipments',
      value: shipmentStats?.in_transit ?? 0,
      color: '#ef4444',
    },
    {
      label: 'Utilization',
      value: terminalStats ? `${terminalStats.utilization_pct}%` : '0%',
      color: '#4f46e5',
    },
    {
      label: 'Active Alerts',
      value: alertStats?.active_alerts ?? 0,
      color: '#ef4444',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>{card.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: card.color }}>{card.value}</div>
        </div>
      ))}
    </div>
  )
}
