import type { District } from '@/types/crime'

export const CITY_CENTER: [number, number] = [41.5510, 60.6307]
export const DEFAULT_ZOOM = 13

export const DISTRICTS: District[] = [
  {
    id: 'center',
    name: 'City Center',
    nameRu: 'Центр города',
    center: [41.5510, 60.6307]
  },
  {
    id: 'airport',
    name: 'Airport Area',
    nameRu: 'Район аэропорта',
    center: [41.5835, 60.6335]
  },
  {
    id: 'railway',
    name: 'Railway Station',
    nameRu: 'Железнодорожный вокзал',
    center: [41.5350, 60.6350]
  },
  {
    id: 'university',
    name: 'Al-Khorezmi (UrDU)',
    nameRu: 'Аль-Хорезми (УрГУ)',
    center: [41.5450, 60.6250]
  },
  {
    id: 'gurlan',
    name: 'Gurlan St.',
    nameRu: 'ул. Гурленская',
    center: [41.5650, 60.6150]
  },
  {
    id: 'khonqa',
    name: 'Khonqa St.',
    nameRu: 'ул. Ханкинская',
    center: [41.5400, 60.6500]
  }
]

export const getDistrictById = (id: string): District | undefined => {
  return DISTRICTS.find(d => d.id === id)
}

export const getDistrictByName = (name: string): District | undefined => {
  return DISTRICTS.find(d => d.name === name || d.nameRu === name)
}
