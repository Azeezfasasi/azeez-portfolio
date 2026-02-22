"use client"
import React, { useState, useEffect } from 'react'
import { Loader, CheckCircle2, Briefcase, Users, Target, Zap, Award } from 'lucide-react'

// Icon mapping
const ICON_MAP = {
  CheckCircle2: CheckCircle2,
  Briefcase: Briefcase,
  Users: Users,
  Target: Target,
  Zap: Zap,
  Award: Award,
}

export default function HomeStats() {
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/home-stats')
      const result = await response.json()

      if (result.success && result.data) {
        setStatsData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-400 to-blue-500">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader className="w-8 h-8 animate-spin text-white" />
        </div>
      </section>
    )
  }

  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return null
  }

  // Sort by order
  const sortedStats = [...statsData.stats].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <section className={`w-full py-16 md:py-24 bg-gradient-to-r ${statsData.backgroundColor || 'from-blue-400 to-blue-500'}`}>
      <div className="mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {sortedStats.map((stat) => {
            const Icon = ICON_MAP[stat.icon] || CheckCircle2
            return (
              <div
                key={stat._id}
                className="flex flex-col items-center justify-center text-center"
              >
                {/* Icon Circle */}
                <div className="mb-6 relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <Icon className="w-12 h-12 md:w-14 md:h-14 text-blue-500" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Value */}
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  {stat.value}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-white font-medium tracking-wide opacity-90">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
