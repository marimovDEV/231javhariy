'use client'

import { Header } from '@/components/layout/header'
import { StatsCards } from '@/components/analytics/stats-cards'
import {
  CrimeByDistrictChart,
  CrimeByTypeChart,
  CrimeTrendChart,
  CrimeByTimeChart,
  CrimeBySeverityChart
} from '@/components/analytics/crime-charts'
import { useCrimes } from '@/hooks/use-crimes'

export default function AnalyticsPage() {
  const { filteredCrimes } = useCrimes()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Аналитика преступности</h2>
          <p className="text-muted-foreground">
            Статистика и визуализация данных о преступлениях в Урганче
          </p>
        </div>

        <StatsCards crimes={filteredCrimes} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrimeByDistrictChart crimes={filteredCrimes} />
          <CrimeByTypeChart crimes={filteredCrimes} />
          <CrimeTrendChart crimes={filteredCrimes} />
          <CrimeByTimeChart crimes={filteredCrimes} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CrimeBySeverityChart crimes={filteredCrimes} />
        </div>
      </main>
    </div>
  )
}
