"use client"

import { useState } from "react"
import { TrendingUp, Calendar, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"


export function UserGrowthChart({ data, users }) {
  const [viewMode, setViewMode] = useState("daily")

  // Generate day-wise data for the last 7 days
  const generateDayWiseData = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const last7Days = []
    const currentDate = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() - i)

      const dayName = dayNames[date.getDay()]
      const dateString = date.toDateString()

      // Count users registered on this day
      const usersOnDay = users.filter((user) => {
        if (!user.createdAt) return false
        const userDate = new Date(user.createdAt)
        return userDate.toDateString() === dateString
      }).length

      last7Days.push({
        period: dayName,
        users: usersOnDay,
      })
    }

    return last7Days
  }

  // Convert monthly data to the same format
  const monthlyData = data.map((item) => ({
    period: item.month,
    users: item.users,
  }))

  const chartData = viewMode === "daily" ? generateDayWiseData() : monthlyData

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 lg:h-48 bg-muted/20 rounded-md">
        <TrendingUp className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground mb-2" />
        <p className="text-xs lg:text-sm text-muted-foreground">No growth data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...chartData.map((item) => item.users), 1)

  return (
    <div className="w-full space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("daily")}
            className="text-xs lg:text-sm"
          >
            <CalendarDays className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            Daily
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("monthly")}
            className="text-xs lg:text-sm"
          >
            <Calendar className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            Monthly
          </Button>
        </div>
        <span className="text-xs lg:text-sm text-muted-foreground">
          {viewMode === "daily" ? "Last 7 days" : "Last 6 months"}
        </span>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-32 lg:h-48 gap-2 lg:gap-4 px-2 lg:px-4">
        {chartData.map((item, index) => {
          const height = maxValue > 0 ? (item.users / maxValue) * 100 : 0

          return (
            <div key={index} className="flex flex-col items-center flex-1 max-w-16 lg:max-w-20">
              <div className="flex flex-col items-center justify-end h-full">
                <span className="text-xs lg:text-sm font-medium mb-1 text-center">{item.users}</span>
                <div
                  className={`w-full rounded-t-sm min-h-[4px] transition-all duration-300 ${
                    viewMode === "daily" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground mt-2 text-center">{item.period}</span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 lg:p-4 bg-muted/20 rounded-md">
        <div className="flex items-center justify-between text-xs lg:text-sm">
          <span className="text-muted-foreground">
            Total New Users ({viewMode === "daily" ? "7 days" : "6 months"}):
          </span>
          <span className="font-medium">{chartData.reduce((sum, item) => sum + item.users, 0)}</span>
        </div>
        {viewMode === "daily" && (
          <div className="flex items-center justify-between text-xs lg:text-sm mt-1">
            <span className="text-muted-foreground">Average per day:</span>
            <span className="font-medium">{Math.round(chartData.reduce((sum, item) => sum + item.users, 0) / 7)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
