'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, Filter, RotateCcw } from 'lucide-react'
import type { FilterState, CrimeType, Severity, TimeOfDay } from '@/types/crime'
import { CRIME_TYPE_LABELS, SEVERITY_LABELS, TIME_OF_DAY_LABELS } from '@/types/crime'
import { DISTRICTS } from '@/lib/data/districts'

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const crimeTypes: CrimeType[] = ['theft', 'robbery', 'fraud', 'vandalism', 'assault', 'burglary', 'drug_offense', 'traffic_violation']
  const severities: Severity[] = ['low', 'medium', 'high']
  const timesOfDay: TimeOfDay[] = ['morning', 'day', 'evening', 'night']

  const toggleCrimeType = (type: CrimeType) => {
    const newTypes = filters.crimeTypes.includes(type)
      ? filters.crimeTypes.filter(t => t !== type)
      : [...filters.crimeTypes, type]
    onFiltersChange({ ...filters, crimeTypes: newTypes })
  }

  const toggleDistrict = (districtId: string) => {
    const newDistricts = filters.districts.includes(districtId)
      ? filters.districts.filter(d => d !== districtId)
      : [...filters.districts, districtId]
    onFiltersChange({ ...filters, districts: newDistricts })
  }

  const toggleSeverity = (severity: Severity) => {
    const newSeverities = filters.severity.includes(severity)
      ? filters.severity.filter(s => s !== severity)
      : [...filters.severity, severity]
    onFiltersChange({ ...filters, severity: newSeverities })
  }

  const toggleTimeOfDay = (time: TimeOfDay) => {
    const newTimes = filters.timeOfDay.includes(time)
      ? filters.timeOfDay.filter(t => t !== time)
      : [...filters.timeOfDay, time]
    onFiltersChange({ ...filters, timeOfDay: newTimes })
  }

  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2">
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Сбросить
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-200px)]" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          <div className="px-4 pb-4 space-y-6">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Период</Label>
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !filters.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "dd MMM yyyy", { locale: ru })
                      ) : (
                        "Начало периода"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) => 
                        onFiltersChange({
                          ...filters,
                          dateRange: { ...filters.dateRange, from: date || null }
                        })
                      }
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !filters.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "dd MMM yyyy", { locale: ru })
                      ) : (
                        "Конец периода"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) => 
                        onFiltersChange({
                          ...filters,
                          dateRange: { ...filters.dateRange, to: date || null }
                        })
                      }
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Crime Types */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Тип преступления</Label>
              <div className="space-y-2">
                {crimeTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.crimeTypes.includes(type)}
                      onCheckedChange={() => toggleCrimeType(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm leading-none cursor-pointer"
                    >
                      {CRIME_TYPE_LABELS[type]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Districts */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Район</Label>
              <div className="space-y-2">
                {DISTRICTS.map(district => (
                  <div key={district.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`district-${district.id}`}
                      checked={filters.districts.includes(district.id)}
                      onCheckedChange={() => toggleDistrict(district.id)}
                    />
                    <label
                      htmlFor={`district-${district.id}`}
                      className="text-sm leading-none cursor-pointer"
                    >
                      {district.nameRu}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Уровень опасности</Label>
              <div className="space-y-2">
                {severities.map(severity => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={filters.severity.includes(severity)}
                      onCheckedChange={() => toggleSeverity(severity)}
                    />
                    <label
                      htmlFor={`severity-${severity}`}
                      className="text-sm leading-none cursor-pointer"
                    >
                      {SEVERITY_LABELS[severity]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Время суток</Label>
              <div className="space-y-2">
                {timesOfDay.map(time => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${time}`}
                      checked={filters.timeOfDay.includes(time)}
                      onCheckedChange={() => toggleTimeOfDay(time)}
                    />
                    <label
                      htmlFor={`time-${time}`}
                      className="text-sm leading-none cursor-pointer"
                    >
                      {TIME_OF_DAY_LABELS[time]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
