import { useEffect, useRef } from 'react'
import { useSupplyStore } from '../store/supplyStore'
import type { Alert } from '../types'

const SEVERITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
}

export default function AlertFeed() {
  const { alerts, fetchAlerts, updateAlertStatus } = useSupplyStore()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    fetchAlerts('active')
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws/logistics`
    wsRef.current = new WebSocket(wsUrl)
    wsRef.current.onmessage = () => fetchAlerts('active')
    return () => { wsRef.current?.close() }
  }, [])

  if (alerts.length === 0) {
    return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No active alerts</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a: Alert) => (
        <div
          key={a.id}
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${a.severity === 'high' || a.severity === 'critical' ? 'var(--danger)' : 'var(--border)'}`,
            borderLeft: `4px solid ${SEVERITY_COLORS[a.severity] || 'var(--accent)'}`,
            borderRadius: 8,
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 14 }}>{a.title}</strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, marginLeft: 8 }}>{a.alert_type.replace('_', ' ')}</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, background: SEVERITY_COLORS[a.severity] || 'var(--accent)', color: '#fff', textTransform: 'uppercase' }}>{a.severity}</span>
          </div>
          {a.description && <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{a.description}</div>}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{new Date(a.created_at).toLocaleString()}</span>
            <button onClick={() => updateAlertStatus(a.id, 'resolved')} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>Resolve</button>
          </div>
        </div>
      ))}
    </div>
  )
}
