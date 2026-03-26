'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Crime, FilterState, CrimeCluster, ClusteringConfig, TimeOfDay } from '@/types/crime'
import { getDemoData } from '@/lib/data/demo-data'
import { runKMeans, runDBSCAN } from '@/lib/clustering'

const defaultFilters: FilterState = {
  dateRange: { from: null, to: null },
  crimeTypes: [],
  districts: [],
  timeOfDay: [],
  severity: []
}

const defaultClusteringConfig: ClusteringConfig = {
  algorithm: 'kmeans',
  kmeans: { k: 5 },
  dbscan: { epsilon: 500, minPoints: 10 }
}

function getTimeOfDay(time: string): TimeOfDay {
  const hour = parseInt(time.split(':')[0])
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'day'
  if (hour >= 18 && hour < 24) return 'evening'
  return 'night'
}

export function useCrimes() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [clusteringConfig, setClusteringConfig] = useState<ClusteringConfig>(defaultClusteringConfig)
  const [clusters, setClusters] = useState<CrimeCluster[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const allCrimes = useMemo(() => getDemoData(), [])

  const filteredCrimes = useMemo(() => {
    return allCrimes.filter(crime => {
      if (filters.dateRange.from) {
        const crimeDate = new Date(crime.date)
        if (crimeDate < filters.dateRange.from) return false
      }
      if (filters.dateRange.to) {
        const crimeDate = new Date(crime.date)
        if (crimeDate > filters.dateRange.to) return false
      }

      if (filters.crimeTypes.length > 0) {
        if (!filters.crimeTypes.includes(crime.type)) return false
      }

      if (filters.districts.length > 0) {
        if (!filters.districts.includes(crime.district)) return false
      }

      if (filters.severity.length > 0) {
        if (!filters.severity.includes(crime.severity)) return false
      }

      if (filters.timeOfDay.length > 0) {
        const crimeTimeOfDay = getTimeOfDay(crime.time)
        if (!filters.timeOfDay.includes(crimeTimeOfDay)) return false
      }

      return true
    })
  }, [allCrimes, filters])

  const runClustering = useCallback(() => {
    setIsProcessing(true)
    
    setTimeout(() => {
      try {
        let newClusters: CrimeCluster[]
        
        if (clusteringConfig.algorithm === 'kmeans') {
          newClusters = runKMeans(filteredCrimes, clusteringConfig.kmeans.k)
        } else {
          newClusters = runDBSCAN(
            filteredCrimes,
            clusteringConfig.dbscan.epsilon,
            clusteringConfig.dbscan.minPoints
          )
        }
        
        setClusters(newClusters)
      } catch (error) {
        console.error('Clustering error:', error)
        setClusters([])
      } finally {
        setIsProcessing(false)
      }
    }, 100)
  }, [filteredCrimes, clusteringConfig])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return {
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
  }
}
