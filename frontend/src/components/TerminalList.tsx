import { useState } from 'react'
import { useSupplyStore } from '../store/supplyStore'
import type { Terminal } from '../types'

function UtilizationBar({ pct }: { pct: number }) {
  const color = pct > 85 ? 'var(--danger)' : pct > 60 ? 'var(--warning)' : 'var(--success)'
  return (
    <div style={{ background: 'var(--bg-primary)', borderRadius: 6, height: 8, width: '100%', marginTop: 6 }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: 8, background: color, borderRadius: 6 }} />
    </div>
  )
}

export default function TerminalList() {
  const { terminals, deleteTerminal } = useSupplyStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (terminals.length === 0) {
    return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No terminals yet</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {terminals.map((t: Terminal) => {
        const utilization = t.storage_capacity_bbl > 0 ? (t.current_stock_bbl / t.storage_capacity_bbl) * 100 : 0
        return (
          <div key={t.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div onClick={() => setExpanded(expanded === t.id ? null : t.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{t.terminal_name}</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8, fontSize: 13 }}>{t.location}</span>
                <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: 'var(--accent)', color: '#fff' }}>{t.type.replace('_', ' ')}</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{expanded === t.id ? '▲' : '▼'}</span>
            </div>
            {expanded === t.id && (
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Capacity</div>
                  <div style={{ fontWeight: 600 }}>{(t.storage_capacity_bbl / 1000).toFixed(0)}K bbl</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Current Stock</div>
                  <div style={{ fontWeight: 600 }}>{(t.current_stock_bbl / 1000).toFixed(0)}K bbl</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Utilization ({utilization.toFixed(1)}%)</div>
                  <UtilizationBar pct={utilization} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Berths</div>
                  <div style={{ fontWeight: 600 }}>{t.berths}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Status</div>
                  <div style={{ fontWeight: 600, color: t.status === 'active' ? 'var(--success)' : t.status === 'expansion' ? 'var(--warning)' : 'var(--danger)' }}>{t.status}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button onClick={() => deleteTerminal(t.id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
