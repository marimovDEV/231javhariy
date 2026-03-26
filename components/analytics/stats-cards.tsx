'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, TrendingUp, TrendingDown, MapPin, Clock } from 'lucide-react'
import type { Crime } from '@/types/crime'
import { DISTRICTS } from '@/lib/data/districts'

interface StatsCardsProps {
  crimes: Crime[]
}

export function StatsCards({ crimes }: StatsCardsProps) {
  const totalCrimes = crimes.length
  
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const crimesLastMonth = crimes.filter(c => {
    const date = new Date(c.date)
    return date >= lastMonth && date < thisMonth
  }).length
  
  const crimesThisMonth = crimes.filter(c => {
    const date = new Date(c.date)
    return date >= thisMonth
  }).length

  const trend = crimesLastMonth > 0 
    ? ((crimesThisMonth - crimesLastMonth) / crimesLastMonth * 100).toFixed(1)
    : '0'
  const isPositiveTrend = Number(trend) > 0

  const districtCounts: Record<string, number> = {}
  crimes.forEach(crime => {
    districtCounts[crime.district] = (districtCounts[crime.district] || 0) + 1
  })
  
  const mostDangerousDistrict = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])[0]
  
  const mostDangerousDistrictName = mostDangerousDistrict 
    ? DISTRICTS.find(d => d.id === mostDangerousDistrict[0])?.nameRu || mostDangerousDistrict[0]
    : 'N/A'

  const highSeverityCrimes = crimes.filter(c => c.severity === 'high').length
  const highSeverityPercent = totalCrimes > 0 
    ? ((highSeverityCrimes / totalCrimes) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего преступлений</p>
              <p className="text-2xl font-bold mt-1">{totalCrimes.toLocaleString('ru-RU')}</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">За этот месяц</p>
              <p className="text-2xl font-bold mt-1">{crimesThisMonth.toLocaleString('ru-RU')}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${isPositiveTrend ? 'text-red-500' : 'text-green-500'}`}>
                {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{isPositiveTrend ? '+' : ''}{trend}% к пред. месяцу</span>
              </div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Самый опасный район</p>
              <p className="text-lg font-bold mt-1 truncate">{mostDangerousDistrictName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {mostDangerousDistrict?.[1].toLocaleString('ru-RU') || 0} случаев
              </p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Высокая опасность</p>
              <p className="text-2xl font-bold mt-1">{highSeverityPercent}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {highSeverityCrimes.toLocaleString('ru-RU')} случаев
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
