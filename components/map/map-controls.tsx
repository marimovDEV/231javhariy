'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Layers, Flame, MapPin, Circle } from 'lucide-react'

interface MapControlsProps {
  showHeatmap: boolean
  showClusters: boolean
  showMarkers: boolean
  onToggleHeatmap: (value: boolean) => void
  onToggleClusters: (value: boolean) => void
  onToggleMarkers: (value: boolean) => void
  isMobile?: boolean
}

export function MapControls({
  showHeatmap,
  showClusters,
  showMarkers,
  onToggleHeatmap,
  onToggleClusters,
  onToggleMarkers,
  isMobile = false
}: MapControlsProps) {
  const content = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="heatmap" className="flex items-center gap-2 text-sm cursor-pointer">
          <Flame className="h-4 w-4 text-orange-500" />
          Тепловая карта
        </Label>
        <Switch
          id="heatmap"
          checked={showHeatmap}
          onCheckedChange={onToggleHeatmap}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="clusters" className="flex items-center gap-2 text-sm cursor-pointer">
          <Circle className="h-4 w-4 text-blue-500" />
          Кластеры
        </Label>
        <Switch
          id="clusters"
          checked={showClusters}
          onCheckedChange={onToggleClusters}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="markers" className="flex items-center gap-2 text-sm cursor-pointer">
          <MapPin className="h-4 w-4 text-red-500" />
          Маркеры
        </Label>
        <Switch
          id="markers"
          checked={showMarkers}
          onCheckedChange={onToggleMarkers}
        />
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>Слои карты</span>
        </div>
        {content}
      </div>
    )
  }

  return (
    <Card className="absolute top-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <Layers className="h-4 w-4" />
          <span>Слои</span>
        </div>
        {content}
      </CardContent>
    </Card>
  )
}
