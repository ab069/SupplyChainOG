import { create } from 'zustand'
import api from '../lib/api'
import type { Terminal, Shipment, Alert, TerminalStats, ShipmentStats, AlertStats } from '../types'

interface SupplyState {
  terminals: Terminal[]
  shipments: Shipment[]
  alerts: Alert[]
  terminalStats: TerminalStats | null
  shipmentStats: ShipmentStats | null
  alertStats: AlertStats | null
  loading: boolean
  error: string | null
  fetchTerminals: () => Promise<void>
  fetchShipments: (terminalId?: string) => Promise<void>
  fetchAlerts: (status?: string) => Promise<void>
  fetchStats: () => Promise<void>
  submitTerminal: (data: Partial<Terminal>) => Promise<void>
  createShipment: (data: Partial<Shipment>) => Promise<void>
  updateShipmentStatus: (id: string, status: string) => Promise<void>
  updateAlertStatus: (id: string, status: string) => Promise<void>
  deleteTerminal: (id: string) => Promise<void>
  deleteShipment: (id: string) => Promise<void>
}

export const useSupplyStore = create<SupplyState>((set, get) => ({
  terminals: [],
  shipments: [],
  alerts: [],
  terminalStats: null,
  shipmentStats: null,
  alertStats: null,
  loading: false,
  error: null,

  fetchTerminals: async () => {
    try {
      const { data } = await api.get('/terminals/')
      set({ terminals: data })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  fetchShipments: async (terminalId?: string) => {
    try {
      const params = terminalId ? { terminal_id: terminalId } : {}
      const { data } = await api.get('/shipments/', { params })
      set({ shipments: data })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  fetchAlerts: async (status?: string) => {
    try {
      const params = status ? { status } : {}
      const { data } = await api.get('/alerts/', { params })
      set({ alerts: data })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  fetchStats: async () => {
    try {
      const [tStats, sStats, aStats] = await Promise.all([
        api.get('/terminals/stats'),
        api.get('/shipments/stats'),
        api.get('/alerts/stats'),
      ])
      set({
        terminalStats: tStats.data,
        shipmentStats: sStats.data,
        alertStats: aStats.data,
      })
    } catch (err: any) {
      set({ error: err.message })
    }
  },

  submitTerminal: async (data: Partial<Terminal>) => {
    await api.post('/terminals/', data)
    await get().fetchTerminals()
    await get().fetchStats()
  },

  createShipment: async (data: Partial<Shipment>) => {
    await api.post('/shipments/', data)
    await get().fetchShipments()
    await get().fetchStats()
  },

  updateShipmentStatus: async (id: string, status: string) => {
    await api.patch(`/shipments/${id}/status`, null, { params: { status } })
    await get().fetchShipments()
    await get().fetchStats()
  },

  updateAlertStatus: async (id: string, status: string) => {
    await api.patch(`/alerts/${id}/status`, null, { params: { status } })
    await get().fetchAlerts()
  },

  deleteTerminal: async (id: string) => {
    await api.delete(`/terminals/${id}`)
    await get().fetchTerminals()
    await get().fetchStats()
  },

  deleteShipment: async (id: string) => {
    await api.delete(`/shipments/${id}`)
    await get().fetchShipments()
    await get().fetchStats()
  },
}))
