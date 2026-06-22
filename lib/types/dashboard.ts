export type OrderStatus = 'in_progress' | 'pending' | 'blocked' | 'completed'
export type RiskLevel = 'on_track' | 'at_risk' | 'blocked'
export type TailorLoad = 'low' | 'medium' | 'high'

export interface Order {
  id: string
  clientName: string
  clientInitials: string
  fabric: string
  tailor: string
  tailorLoad: TailorLoad
  status: OrderStatus
  delivery: string
}

export interface StatCard {
  label: string
  value: string | number
  sub: string
  subVariant?: 'default' | 'danger' | 'success'
  icon: string
}

export interface ActivityItem {
  id: string
  message: string
  time: string
  variant: 'success' | 'danger' | 'info'
  icon: string
}

export interface PendingReply {
  clientName: string
  message: string
}