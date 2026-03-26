'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SEVERITY_COLORS, SEVERITY_LABELS, type Severity } from '@/types/crime'

interface LegendProps {
  totalCrimes: number
  filteredCrimes: number
}

export function Legend({ totalCrimes, filteredCrimes }: LegendProps) {
  const severities: Severity[] = ['low', 'medium', 'high']

  return (
    <Card className="absolute bottom-20 lg:bottom-4 left-4 lg:left-auto lg:right-4 z-[1000] w-48 lg:w-56 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium">Легенда</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-3">
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Уровень опасности</p>
          {severities.map(severity => (
            <div key={severity} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: SEVERITY_COLORS[severity] }}
              />
              <span className="text-xs">{SEVERITY_LABELS[severity]}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Показано: {filteredCrimes.toLocaleString('ru-RU')} из {totalCrimes.toLocaleString('ru-RU')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
