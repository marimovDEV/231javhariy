import type { Crime, CrimeType, Severity } from '@/types/crime'
import { DISTRICTS } from './districts'

const CRIME_TYPES: CrimeType[] = [
  'theft', 'robbery', 'fraud', 'vandalism', 
  'assault', 'burglary', 'drug_offense', 'traffic_violation'
]

const CRIME_TYPE_WEIGHTS: Record<CrimeType, number> = {
  theft: 0.30,
  fraud: 0.20,
  traffic_violation: 0.15,
  vandalism: 0.12,
  burglary: 0.08,
  robbery: 0.07,
  assault: 0.05,
  drug_offense: 0.03
}

const SEVERITY_BY_TYPE: Record<CrimeType, { low: number; medium: number; high: number }> = {
  theft: { low: 0.4, medium: 0.4, high: 0.2 },
  robbery: { low: 0.1, medium: 0.3, high: 0.6 },
  fraud: { low: 0.3, medium: 0.5, high: 0.2 },
  vandalism: { low: 0.5, medium: 0.4, high: 0.1 },
  assault: { low: 0.1, medium: 0.4, high: 0.5 },
  burglary: { low: 0.2, medium: 0.5, high: 0.3 },
  drug_offense: { low: 0.2, medium: 0.4, high: 0.4 },
  traffic_violation: { low: 0.5, medium: 0.3, high: 0.2 }
}

const DISTRICT_CRIME_MULTIPLIER: Record<string, number> = {
  'center': 1.5,
  'airport': 0.8,
  'railway': 1.2,
  'university': 1.1,
  'gurlan': 0.9,
  'khonqa': 1.0
}

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

function weightedRandom<T>(items: T[], weights: number[], random: () => number): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let r = random() * totalWeight
  
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  
  return items[items.length - 1]
}

function getSeverity(type: CrimeType, random: () => number): Severity {
  const weights = SEVERITY_BY_TYPE[type]
  const r = random()
  if (r < weights.low) return 'low'
  if (r < weights.low + weights.medium) return 'medium'
  return 'high'
}

function generateRandomCoordinate(
  center: [number, number],
  radiusKm: number,
  random: () => number
): [number, number] {
  const radiusInDegrees = radiusKm / 111.32
  const u = random()
  const v = random()
  const w = radiusInDegrees * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y = w * Math.sin(t)
  const newLat = center[0] + y
  const newLng = center[1] + x / Math.cos(center[0] * Math.PI / 180)
  return [newLat, newLng]
}

function generateRandomDate(startDate: Date, endDate: Date, random: () => number): string {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + random() * (end - start)
  return new Date(randomTime).toISOString().split('T')[0]
}

function generateRandomTime(random: () => number): string {
  const hour = Math.floor(random() * 24)
  const minute = Math.floor(random() * 60)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export function generateDemoData(count: number = 5000, seed: number = 12345): Crime[] {
  const random = seededRandom(seed)
  const crimes: Crime[] = []
  
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2025-12-31')
  
  const crimeTypeWeights = CRIME_TYPES.map(t => CRIME_TYPE_WEIGHTS[t])
  
  for (let i = 0; i < count; i++) {
    const district = DISTRICTS[Math.floor(random() * DISTRICTS.length)]
    const multiplier = DISTRICT_CRIME_MULTIPLIER[district.id] || 1
    
    if (random() > multiplier / 1.5) {
      continue
    }
    
    const type = weightedRandom(CRIME_TYPES, crimeTypeWeights, random)
    const [lat, lng] = generateRandomCoordinate(district.center, 2.5, random)
    
    const crime: Crime = {
      id: `crime-${i + 1}`,
      type,
      date: generateRandomDate(startDate, endDate, random),
      time: generateRandomTime(random),
      latitude: lat,
      longitude: lng,
      district: district.id,
      severity: getSeverity(type, random)
    }
    
    crimes.push(crime)
  }
  
  return crimes.sort((a, b) => b.date.localeCompare(a.date))
}

let cachedData: Crime[] | null = null

export function getDemoData(): Crime[] {
  if (!cachedData) {
    cachedData = generateDemoData(5000)
  }
  return cachedData
}

export function resetDemoData(): void {
  cachedData = null
}
