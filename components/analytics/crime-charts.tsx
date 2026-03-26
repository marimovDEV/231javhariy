'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import type { Crime } from '@/types/crime'
import { CRIME_TYPE_LABELS, SEVERITY_COLORS } from '@/types/crime'
import { DISTRICTS } from '@/lib/data/districts'

interface CrimeChartsProps {
  crimes: Crime[]
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function CrimeByDistrictChart({ crimes }: CrimeChartsProps) {
  const districtCounts: Record<string, number> = {}
  crimes.forEach(crime => {
    districtCounts[crime.district] = (districtCounts[crime.district] || 0) + 1
  })

  const data = DISTRICTS.map(district => ({
    name: district.nameRu,
    value: districtCounts[district.id] || 0
  })).sort((a, b) => b.value - a.value)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Преступления по районам</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" />
              <YAxis type="category" dataKey="name" className="text-xs" width={75} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CrimeByTypeChart({ crimes }: CrimeChartsProps) {
  const typeCounts: Record<string, number> = {}
  crimes.forEach(crime => {
    typeCounts[crime.type] = (typeCounts[crime.type] || 0) + 1
  })

  const data = Object.entries(typeCounts).map(([type, count]) => ({
    name: CRIME_TYPE_LABELS[type as keyof typeof CRIME_TYPE_LABELS] || type,
    value: count
  })).sort((a, b) => b.value - a.value)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Типы преступлений</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function CrimeTrendChart({ crimes }: CrimeChartsProps) {
  const monthCounts: Record<string, number> = {}
  crimes.forEach(crime => {
    const month = crime.date.substring(0, 7)
    monthCounts[month] = (monthCounts[month] || 0) + 1
  })

  const data = Object.entries(monthCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => {
      const [year, monthNum] = month.split('-')
      const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      return {
        name: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
        value: count
      }
    })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Динамика преступлений</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CrimeByTimeChart({ crimes }: CrimeChartsProps) {
  const hourCounts: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0
  }
  
  crimes.forEach(crime => {
    const hour = parseInt(crime.time.split(':')[0])
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const data = Object.entries(hourCounts).map(([hour, count]) => ({
    name: `${hour}:00`,
    value: count
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Активность по времени суток</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" interval={3} />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CrimeBySeverityChart({ crimes }: CrimeChartsProps) {
  const severityCounts = {
    low: crimes.filter(c => c.severity === 'low').length,
    medium: crimes.filter(c => c.severity === 'medium').length,
    high: crimes.filter(c => c.severity === 'high').length
  }

  const data = [
    { name: 'Низкая', value: severityCounts.low, color: SEVERITY_COLORS.low },
    { name: 'Средняя', value: severityCounts.medium, color: SEVERITY_COLORS.medium },
    { name: 'Высокая', value: severityCounts.high, color: SEVERITY_COLORS.high }
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">По уровню опасности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
