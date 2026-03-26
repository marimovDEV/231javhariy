'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Map, BarChart3, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="font-semibold text-lg">CrimeMap Urganch</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          <Button
            variant={pathname === '/' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={cn(
              "gap-2",
              pathname === '/' && "bg-secondary"
            )}
          >
            <Link href="/">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Карта</span>
            </Link>
          </Button>
          <Button
            variant={pathname === '/analytics' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={cn(
              "gap-2",
              pathname === '/analytics' && "bg-secondary"
            )}
          >
            <Link href="/analytics">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Аналитика</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
