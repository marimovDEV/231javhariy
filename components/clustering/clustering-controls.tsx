'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Sparkles, Play } from 'lucide-react'
import type { ClusteringConfig } from '@/types/crime'
import { cn } from '@/lib/utils'

interface ClusteringControlsProps {
  config: ClusteringConfig
  onConfigChange: (config: ClusteringConfig) => void
  onRunClustering: () => void
  isProcessing: boolean
  isMobile?: boolean
}

export function ClusteringControls({
  config,
  onConfigChange,
  onRunClustering,
  isProcessing,
  isMobile = false
}: ClusteringControlsProps) {
  const content = (
    <>
      <Tabs
        value={config.algorithm}
        onValueChange={(value) => 
          onConfigChange({ ...config, algorithm: value as 'kmeans' | 'dbscan' })
        }
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="kmeans">K-means</TabsTrigger>
          <TabsTrigger value="dbscan">DBSCAN</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kmeans" className="space-y-4 mt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Количество кластеров (K)</Label>
              <span className="text-xs font-medium">{config.kmeans.k}</span>
            </div>
            <Slider
              value={[config.kmeans.k]}
              min={2}
              max={15}
              step={1}
              onValueChange={([value]) => 
                onConfigChange({
                  ...config,
                  kmeans: { ...config.kmeans, k: value }
                })
              }
            />
          </div>
        </TabsContent>
        
        <TabsContent value="dbscan" className="space-y-4 mt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Радиус (epsilon), м</Label>
              <span className="text-xs font-medium">{config.dbscan.epsilon}</span>
            </div>
            <Slider
              value={[config.dbscan.epsilon]}
              min={100}
              max={2000}
              step={50}
              onValueChange={([value]) => 
                onConfigChange({
                  ...config,
                  dbscan: { ...config.dbscan, epsilon: value }
                })
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Мин. точек в кластере</Label>
              <span className="text-xs font-medium">{config.dbscan.minPoints}</span>
            </div>
            <Slider
              value={[config.dbscan.minPoints]}
              min={3}
              max={50}
              step={1}
              onValueChange={([value]) => 
                onConfigChange({
                  ...config,
                  dbscan: { ...config.dbscan, minPoints: value }
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button
        onClick={onRunClustering}
        disabled={isProcessing}
        className="w-full mt-4"
        size="sm"
      >
        <Play className="h-3.5 w-3.5 mr-1.5" />
        {isProcessing ? 'Обработка...' : 'Запустить'}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Кластеризация
        </div>
        {content}
      </div>
    )
  }

  return (
    <Card className="absolute top-4 left-4 z-[1000] w-72 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Кластеризация
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {content}
      </CardContent>
    </Card>
  )
}
