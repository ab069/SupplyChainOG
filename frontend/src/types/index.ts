export interface User {
  id: string
  email: string
  name: string
}

export interface Terminal {
  id: string
  user_id: string
  terminal_name: string
  location: string
  type: string
  storage_capacity_bbl: number
  current_stock_bbl: number
  berths: number
  status: string
  created_at: string
}

export interface Shipment {
  id: string
  user_id: string
  terminal_id: string
  vessel_name: string
  product_type: string
  volume_bbl: number
  origin: string
  destination: string
  status: string
  eta: string | null
  departure_date: string | null
  arrival_date: string | null
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  terminal_id: string
  title: string
  alert_type: string
  severity: string
  status: string
  description: string | null
  created_at: string
}

export interface TerminalStats {
  total_terminals: number
  total_capacity_bbl: number
  current_stock_bbl: number
  utilization_pct: number
}

export interface ShipmentStats {
  total_shipments: number
  in_transit: number
  delivered: number
  total_volume_moved_bbl: number
}

export interface AlertStats {
  total_alerts: number
  active_alerts: number
  high_severity_active: number
}
