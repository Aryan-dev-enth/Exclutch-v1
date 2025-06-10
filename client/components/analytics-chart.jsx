"use client"

import { TrendingUp } from "lucide-react"


export function AnalyticsChart({ data, type }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-muted/20 rounded-md">
        <TrendingUp className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((item) => item.value))

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const colors = ["bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500", "bg-red-500", "bg-yellow-500"]

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{item.period}</div>
                  <div className="text-xs text-muted-foreground">
                    {percentage}% ({item.value})
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (type === "line") {
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 gap-2 px-2">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                <div className="flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-medium mb-1">{item.value}</span>
                  <div className="w-full flex items-end justify-center">
                    <div
                      className="w-2 bg-blue-500 rounded-t-sm min-h-[4px]"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2 text-center truncate w-full">{item.period}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Bar chart
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate">{item.period}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
