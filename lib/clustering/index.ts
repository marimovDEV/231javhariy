import type { Crime, CrimeCluster, Severity } from '@/types/crime'

// Custom K-means implementation to avoid package compatibility issues
export function runKMeans(
  crimes: Crime[],
  k: number
): CrimeCluster[] {
  if (crimes.length < k || crimes.length === 0) {
    return []
  }

  const data = crimes.map(c => [c.latitude, c.longitude])
  
  // Initialize centroids using k-means++ algorithm
  const centroids = initializeCentroids(data, k)
  
  // Run k-means iterations
  const maxIterations = 100
  let assignments = new Array(data.length).fill(0)
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = data.map(point => {
      let minDist = Infinity
      let minIdx = 0
      for (let i = 0; i < centroids.length; i++) {
        const dist = euclideanDistance(point, centroids[i])
        if (dist < minDist) {
          minDist = dist
          minIdx = i
        }
      }
      return minIdx
    })
    
    // Check for convergence
    const converged = newAssignments.every((a, i) => a === assignments[i])
    assignments = newAssignments
    
    if (converged) break
    
    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, idx) => assignments[idx] === i)
      if (clusterPoints.length > 0) {
        centroids[i] = [
          clusterPoints.reduce((sum, p) => sum + p[0], 0) / clusterPoints.length,
          clusterPoints.reduce((sum, p) => sum + p[1], 0) / clusterPoints.length
        ]
      }
    }
  }

  // Build clusters
  const clusters: CrimeCluster[] = centroids.map((centroid, idx) => {
    const clusterCrimes = crimes.filter((_, i) => assignments[i] === idx)
    
    let maxDistance = 0
    for (const crime of clusterCrimes) {
      const dist = Math.sqrt(
        Math.pow(crime.latitude - centroid[0], 2) +
        Math.pow(crime.longitude - centroid[1], 2)
      )
      maxDistance = Math.max(maxDistance, dist)
    }

    const avgSeverity = calculateAverageSeverity(clusterCrimes)

    return {
      id: `cluster-${idx}`,
      centroid: [centroid[0], centroid[1]] as [number, number],
      points: clusterCrimes,
      severity: avgSeverity,
      radius: maxDistance * 111000 // Convert to meters
    }
  })

  return clusters.filter(c => c.points.length > 0)
}

function initializeCentroids(data: number[][], k: number): number[][] {
  const centroids: number[][] = []
  
  // Choose first centroid randomly
  const firstIdx = Math.floor(Math.random() * data.length)
  centroids.push([...data[firstIdx]])
  
  // Choose remaining centroids using k-means++ probability
  for (let i = 1; i < k; i++) {
    const distances = data.map(point => {
      let minDist = Infinity
      for (const centroid of centroids) {
        const dist = euclideanDistance(point, centroid)
        minDist = Math.min(minDist, dist)
      }
      return minDist * minDist
    })
    
    const totalDist = distances.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalDist
    
    for (let j = 0; j < data.length; j++) {
      random -= distances[j]
      if (random <= 0) {
        centroids.push([...data[j]])
        break
      }
    }
    
    if (centroids.length === i) {
      centroids.push([...data[Math.floor(Math.random() * data.length)]])
    }
  }
  
  return centroids
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

// Custom DBSCAN implementation
export function runDBSCAN(
  crimes: Crime[],
  epsilon: number,
  minPoints: number
): CrimeCluster[] {
  if (crimes.length === 0) {
    return []
  }

  const data = crimes.map(c => [c.latitude, c.longitude])
  const epsilonDegrees = epsilon / 111000 // Convert meters to degrees
  
  const n = data.length
  const visited = new Array(n).fill(false)
  const clusterId = new Array(n).fill(-1)
  let currentCluster = 0

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue
    visited[i] = true
    
    const neighbors = regionQuery(data, i, epsilonDegrees)
    
    if (neighbors.length < minPoints) {
      clusterId[i] = -1 // Noise
    } else {
      expandCluster(data, i, neighbors, currentCluster, epsilonDegrees, minPoints, visited, clusterId)
      currentCluster++
    }
  }

  // Build clusters from assignments
  const clusterMap = new Map<number, number[]>()
  for (let i = 0; i < n; i++) {
    if (clusterId[i] >= 0) {
      if (!clusterMap.has(clusterId[i])) {
        clusterMap.set(clusterId[i], [])
      }
      clusterMap.get(clusterId[i])!.push(i)
    }
  }

  const clusters: CrimeCluster[] = []
  let idx = 0
  
  clusterMap.forEach((indices) => {
    const clusterCrimes = indices.map(i => crimes[i])
    const centroid = calculateCentroid(clusterCrimes)
    
    let maxDistance = 0
    for (const crime of clusterCrimes) {
      const dist = Math.sqrt(
        Math.pow(crime.latitude - centroid[0], 2) +
        Math.pow(crime.longitude - centroid[1], 2)
      )
      maxDistance = Math.max(maxDistance, dist)
    }

    const avgSeverity = calculateAverageSeverity(clusterCrimes)

    clusters.push({
      id: `cluster-${idx}`,
      centroid,
      points: clusterCrimes,
      severity: avgSeverity,
      radius: maxDistance * 111000
    })
    idx++
  })

  return clusters
}

function regionQuery(data: number[][], pointIdx: number, epsilon: number): number[] {
  const neighbors: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (euclideanDistance(data[pointIdx], data[i]) <= epsilon) {
      neighbors.push(i)
    }
  }
  return neighbors
}

function expandCluster(
  data: number[][],
  pointIdx: number,
  neighbors: number[],
  cluster: number,
  epsilon: number,
  minPoints: number,
  visited: boolean[],
  clusterId: number[]
): void {
  clusterId[pointIdx] = cluster
  
  const queue = [...neighbors]
  
  while (queue.length > 0) {
    const current = queue.shift()!
    
    if (!visited[current]) {
      visited[current] = true
      const currentNeighbors = regionQuery(data, current, epsilon)
      
      if (currentNeighbors.length >= minPoints) {
        queue.push(...currentNeighbors.filter(n => !visited[n]))
      }
    }
    
    if (clusterId[current] === -1) {
      clusterId[current] = cluster
    }
  }
}

function calculateCentroid(crimes: Crime[]): [number, number] {
  if (crimes.length === 0) return [0, 0]
  
  const sumLat = crimes.reduce((sum, c) => sum + c.latitude, 0)
  const sumLng = crimes.reduce((sum, c) => sum + c.longitude, 0)
  
  return [sumLat / crimes.length, sumLng / crimes.length]
}

function calculateAverageSeverity(crimes: Crime[]): Severity {
  if (crimes.length === 0) return 'low'
  
  const severityValues: Record<Severity, number> = {
    low: 1,
    medium: 2,
    high: 3
  }
  
  const avg = crimes.reduce((sum, c) => sum + severityValues[c.severity], 0) / crimes.length
  
  if (avg < 1.5) return 'low'
  if (avg < 2.5) return 'medium'
  return 'high'
}

export function getHeatmapData(crimes: Crime[]): [number, number, number][] {
  return crimes.map(crime => {
    const intensity = crime.severity === 'high' ? 1 : crime.severity === 'medium' ? 0.6 : 0.3
    return [crime.latitude, crime.longitude, intensity]
  })
}
