'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import type { Crime, CrimeCluster } from '@/types/crime'
import { CITY_CENTER, DEFAULT_ZOOM } from '@/lib/data/districts'
import { CRIME_TYPE_LABELS, SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/crime'
import { getDistrictById } from '@/lib/data/districts'

interface CrimeMapProps {
  crimes: Crime[]
  clusters: CrimeCluster[]
  showHeatmap: boolean
  showClusters: boolean
  showMarkers: boolean
  onCrimeSelect?: (crime: Crime) => void
}

export default function CrimeMap({
  crimes,
  clusters,
  showHeatmap,
  showClusters,
  showMarkers,
  onCrimeSelect
}: CrimeMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const heatLayerRef = useRef<L.HeatLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const clustersLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: CITY_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    mapRef.current = map
    markersLayerRef.current = L.layerGroup().addTo(map)
    clustersLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update heatmap
  useEffect(() => {
    if (!mapRef.current) return

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (showHeatmap && crimes.length > 0) {
      const heatData = crimes.map(crime => {
        const intensity = crime.severity === 'high' ? 1 : crime.severity === 'medium' ? 0.6 : 0.3
        return [crime.latitude, crime.longitude, intensity] as L.HeatLatLngTuple
      })

      // @ts-expect-error leaflet.heat types
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: '#22c55e',
          0.3: '#84cc16',
          0.5: '#eab308',
          0.7: '#f97316',
          1.0: '#ef4444'
        }
      }).addTo(mapRef.current)
    }
  }, [crimes, showHeatmap])

  // Update markers
  const visibleCrimes = useMemo(() => crimes.slice(0, 1000), [crimes])

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()

    if (showMarkers) {
      visibleCrimes.forEach(crime => {
        const district = getDistrictById(crime.district)
        const marker = L.circleMarker([crime.latitude, crime.longitude], {
          radius: 6,
          color: SEVERITY_COLORS[crime.severity],
          fillColor: SEVERITY_COLORS[crime.severity],
          fillOpacity: 0.7,
          weight: 1
        })

        marker.bindPopup(`
          <div class="p-2 min-w-[180px]">
            <h3 class="font-semibold text-sm mb-2">${CRIME_TYPE_LABELS[crime.type]}</h3>
            <div class="space-y-1 text-xs">
              <p><span class="text-gray-500">Дата:</span> ${new Date(crime.date).toLocaleDateString('ru-RU')}</p>
              <p><span class="text-gray-500">Время:</span> ${crime.time}</p>
              <p><span class="text-gray-500">Район:</span> ${district?.nameRu || crime.district}</p>
              <p style="color: ${SEVERITY_COLORS[crime.severity]}">
                <span class="text-gray-500">Уровень:</span> ${SEVERITY_LABELS[crime.severity]}
              </p>
            </div>
          </div>
        `)

        if (onCrimeSelect) {
          marker.on('click', () => onCrimeSelect(crime))
        }

        marker.addTo(markersLayerRef.current!)
      })
    }
  }, [visibleCrimes, showMarkers, onCrimeSelect])

  // Update cluster circles
  useEffect(() => {
    if (!mapRef.current || !clustersLayerRef.current) return

    clustersLayerRef.current.clearLayers()

    if (showClusters) {
      clusters.forEach(cluster => {
        const circle = L.circle(cluster.centroid, {
          radius: Math.max(cluster.radius, 200),
          color: SEVERITY_COLORS[cluster.severity],
          fillColor: SEVERITY_COLORS[cluster.severity],
          fillOpacity: 0.2,
          weight: 2
        })

        circle.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">Кластер опасности</h3>
            <p class="text-xs text-gray-500">Преступлений: ${cluster.points.length}</p>
            <p class="text-xs" style="color: ${SEVERITY_COLORS[cluster.severity]}">
              Уровень: ${SEVERITY_LABELS[cluster.severity]}
            </p>
          </div>
        `)

        circle.addTo(clustersLayerRef.current!)
      })
    }
  }, [clusters, showClusters])

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full"
      style={{ background: '#f8fafc' }}
    />
  )
}
