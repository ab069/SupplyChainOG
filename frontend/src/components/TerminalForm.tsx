import { useState } from 'react'
import { useSupplyStore } from '../store/supplyStore'

const TERMINAL_TYPES = ['crude_export', 'product_import', 'storage', 'multi']

export default function TerminalForm() {
  const { submitTerminal } = useSupplyStore()
  const [form, setForm] = useState({
    terminal_name: '',
    location: '',
    type: 'storage',
    storage_capacity_bbl: 0,
    current_stock_bbl: 0,
    berths: 0,
  })
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitTerminal(form)
    setForm({ terminal_name: '', location: '', type: 'storage', storage_capacity_bbl: 0, current_stock_bbl: 0, berths: 0 })
    setOpen(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={btnStyle}>
        + Add Terminal
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>New Terminal</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <input placeholder="Terminal Name" value={form.terminal_name} onChange={(e) => setForm({ ...form, terminal_name: e.target.value })} required style={inputStyle} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required style={inputStyle} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
          {TERMINAL_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <input type="number" placeholder="Storage Capacity (bbl)" value={form.storage_capacity_bbl || ''} onChange={(e) => setForm({ ...form, storage_capacity_bbl: Number(e.target.value) })} style={inputStyle} />
        <input type="number" placeholder="Current Stock (bbl)" value={form.current_stock_bbl || ''} onChange={(e) => setForm({ ...form, current_stock_bbl: Number(e.target.value) })} style={inputStyle} />
        <input type="number" placeholder="Berths" value={form.berths || ''} onChange={(e) => setForm({ ...form, berths: Number(e.target.value) })} style={inputStyle} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button type="submit" style={btnStyle}>Save</button>
        <button type="button" onClick={() => setOpen(false)} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
      </div>
    </form>
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
