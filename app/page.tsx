'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { FilterPanel } from '@/components/filters/filter-panel'
import { ClusteringControls } from '@/components/clustering/clustering-controls'
import { MapControls } from '@/components/map/map-controls'
import { Legend } from '@/components/map/legend'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCrimes } from '@/hooks/use-crimes'
import { Filter, Sparkles, Layers } from 'lucide-react'

const CrimeMap = dynamic(() => import('@/components/map/crime-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Загрузка карты...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  const {
    allCrimes,
    filteredCrimes,
    filters,
    setFilters,
    resetFilters,
    clusteringConfig,
    setClusteringConfig,
    clusters,
    runClustering,
    isProcessing
  } = useCrimes()

  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showClusters, setShowClusters] = useState(false)
  const [showMarkers, setShowMarkers] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [clusteringOpen, setClusteringOpen] = useState(false)
  const [layersOpen, setLayersOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 border-r border-border overflow-auto">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="flex items-center justify-around p-2">
            {/* Filters Sheet */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
                  <Filter className="h-5 w-5" />
                  <span className="text-xs">Фильтры</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={resetFilters}
                />
              </SheetContent>
            </Sheet>

            {/* Clustering Sheet */}
            <Sheet open={clusteringOpen} onOpenChange={setClusteringOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs">Кластеры</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto p-4 rounded-t-xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>Кластеризация</SheetTitle>
                </SheetHeader>
                <ClusteringControls
                  config={clusteringConfig}
                  onConfigChange={setClusteringConfig}
                  onRunClustering={() => {
                    runClustering()
                    setClusteringOpen(false)
                  }}
                  isProcessing={isProcessing}
                  isMobile
                />
              </SheetContent>
            </Sheet>

            {/* Layers Sheet */}
            <Sheet open={layersOpen} onOpenChange={setLayersOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
                  <Layers className="h-5 w-5" />
                  <span className="text-xs">Слои</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto p-4 rounded-t-xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>Слои карты</SheetTitle>
                </SheetHeader>
                <MapControls
                  showHeatmap={showHeatmap}
                  showClusters={showClusters}
                  showMarkers={showMarkers}
                  onToggleHeatmap={setShowHeatmap}
                  onToggleClusters={setShowClusters}
                  onToggleMarkers={setShowMarkers}
                  isMobile
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Map Container */}
        <main className="flex-1 relative pb-16 lg:pb-0">
          <CrimeMap
            crimes={filteredCrimes}
            clusters={clusters}
            showHeatmap={showHeatmap}
            showClusters={showClusters}
            showMarkers={showMarkers}
          />

          {/* Desktop Controls */}
          <div className="hidden lg:block">
            <ClusteringControls
              config={clusteringConfig}
              onConfigChange={setClusteringConfig}
              onRunClustering={runClustering}
              isProcessing={isProcessing}
            />

            <MapControls
              showHeatmap={showHeatmap}
              showClusters={showClusters}
              showMarkers={showMarkers}
              onToggleHeatmap={setShowHeatmap}
              onToggleClusters={setShowClusters}
              onToggleMarkers={setShowMarkers}
            />
          </div>

          <Legend
            totalCrimes={allCrimes.length}
            filteredCrimes={filteredCrimes.length}
          />
        </main>
      </div>
    </div>
  )
}
