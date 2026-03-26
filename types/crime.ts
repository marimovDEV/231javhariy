export type CrimeType = 
  | 'theft'
  | 'robbery'
  | 'fraud'
  | 'vandalism'
  | 'assault'
  | 'burglary'
  | 'drug_offense'
  | 'traffic_violation'

export type Severity = 'low' | 'medium' | 'high'

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night'

export interface Crime {
  id: string
  type: CrimeType
  date: string
  time: string
  latitude: number
  longitude: number
  district: string
  severity: Severity
  description?: string
}

export interface District {
  id: string
  name: string
  nameRu: string
  center: [number, number]
  bounds?: [[number, number], [number, number]]
}

export interface CrimeCluster {
  id: string
  centroid: [number, number]
  points: Crime[]
  severity: Severity
  radius: number
}

export interface FilterState {
  dateRange: {
    from: Date | null
    to: Date | null
  }
  crimeTypes: CrimeType[]
  districts: string[]
  timeOfDay: TimeOfDay[]
  severity: Severity[]
}

export interface ClusteringConfig {
  algorithm: 'kmeans' | 'dbscan'
  kmeans: {
    k: number
  }
  dbscan: {
    epsilon: number
    minPoints: number
  }
}

export const CRIME_TYPE_LABELS: Record<CrimeType, string> = {
  theft: 'Кража',
  robbery: 'Грабёж',
  fraud: 'Мошенничество',
  vandalism: 'Вандализм',
  assault: 'Нападение',
  burglary: 'Взлом',
  drug_offense: 'Наркотики',
  traffic_violation: 'ДТП'
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая'
}

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: 'Утро (6:00-12:00)',
  day: 'День (12:00-18:00)',
  evening: 'Вечер (18:00-00:00)',
  night: 'Ночь (00:00-6:00)'
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: '#22c55e',
  medium: '#f97316',
  high: '#ef4444'
}
