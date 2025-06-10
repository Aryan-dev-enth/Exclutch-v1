"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Heart } from "lucide-react"


export function TopPerformingNotes({ notes }) {
  // Sort notes by total engagement (views + downloads + likes)
  const topNotes = notes
    .map((note) => ({
      ...note,
      totalEngagement: (note.viewCount || 0) + (note.downloadsCount || 0) + (note.likes?.length || 0),
    }))
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 10)

  if (topNotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Notes</CardTitle>
          <CardDescription>Most popular notes by engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No notes available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Performing Notes</CardTitle>
        <CardDescription>Most popular notes by views, downloads, and likes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topNotes.map((note, index) => (
            <div key={note._id || note.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{note.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {note.subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      by {note.author?.name || note.uploader || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{note.viewCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>{note.downloadsCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span>{note.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
