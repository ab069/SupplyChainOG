import { useState, useEffect } from 'react'
import { useSupplyStore } from '../store/supplyStore'
import type { Shipment } from '../types'

const PRODUCT_TYPES = ['crude', 'gasoline', 'diesel', 'jet_fuel', 'ngl', 'lpg']
const STATUS_COLORS: Record<string, string> = {
  scheduled: '#94a3b8',
  loading: '#f59e0b',
  in_transit: '#4f46e5',
  arrived: '#22c55e',
  delivered: '#22c55e',
}

export default function ShipmentTracker() {
  const { shipments, terminals, createShipment, updateShipmentStatus, deleteShipment, fetchTerminals } = useSupplyStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    terminal_id: '',
    vessel_name: '',
    product_type: 'crude',
    volume_bbl: 0,
    origin: '',
    destination: '',
    eta: '',
  })

  useEffect(() => { fetchTerminals() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createShipment({
      ...form,
      eta: form.eta ? new Date(form.eta).toISOString() : null,
    } as any)
    setForm({ terminal_id: '', vessel_name: '', product_type: 'crude', volume_bbl: 0, origin: '', destination: '', eta: '' })
    setOpen(false)
  }

  return (
    <div>
      {!open && (
        <button onClick={() => setOpen(true)} style={btnStyle}>+ Add Shipment</button>
      )}
      {open && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>New Shipment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <select value={form.terminal_id} onChange={(e) => setForm({ ...form, terminal_id: e.target.value })} required style={inputStyle}>
              <option value="">Select Terminal</option>
              {terminals.map((t) => <option key={t.id} value={t.id}>{t.terminal_name}</option>)}
            </select>
            <input placeholder="Vessel Name" value={form.vessel_name} onChange={(e) => setForm({ ...form, vessel_name: e.target.value })} required style={inputStyle} />
            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} style={inputStyle}>
              {PRODUCT_TYPES.map((p) => <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>)}
            </select>
            <input type="number" placeholder="Volume (bbl)" value={form.volume_bbl || ''} onChange={(e) => setForm({ ...form, volume_bbl: Number(e.target.value) })} style={inputStyle} />
            <input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} required style={inputStyle} />
            <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required style={inputStyle} />
            <input type="datetime-local" value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit" style={btnStyle}>Save</button>
            <button type="button" onClick={() => setOpen(false)} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
          </div>
        </form>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {shipments.length === 0 && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>No shipments yet</div>}
        {shipments.map((s: Shipment) => (
          <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <strong>{s.vessel_name}</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8, fontSize: 13 }}>{s.product_type} | {s.origin} → {s.destination}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: STATUS_COLORS[s.status] || '#94a3b8', color: '#fff' }}>{s.status}</span>
                <select value={s.status} onChange={(e) => updateShipmentStatus(s.id, e.target.value)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
                  <option value="scheduled">scheduled</option>
                  <option value="loading">loading</option>
                  <option value="in_transit">in_transit</option>
                  <option value="arrived">arrived</option>
                  <option value="delivered">delivered</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Volume: {(s.volume_bbl / 1000).toFixed(0)}K bbl</span>
              {s.eta && <span>ETA: {new Date(s.eta).toLocaleDateString()}</span>}
              <button onClick={() => deleteShipment(s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13, marginLeft: 'auto' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}

const btnStyle: React.CSSProperties = {
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}
