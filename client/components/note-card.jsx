"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  Download,
  Calendar,
  ExternalLink,
  FileText,
  Pin,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export function NoteCard({ note, viewMode = "grid" }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPreviewUrl = () => {
    return `https://drive.google.com/file/d/${note.gapis_file_id}/preview`;
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Preview Image */}
            <div className="relative sm:w-48 sm:flex-shrink-0">
              <div className="aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
                <iframe
                  src={getPreviewUrl()}
                  className="h-full w-full border-0"
                  title={`Preview of ${note.title}`}
                />
              </div>
              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {note.pinned && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 text-xs"
                  >
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {note.trending && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 text-xs"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              {note.verified && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="space-y-3">
                {/* Header */}
                <div>
                  <Link href={`/notes/${note._id}`} className="group">
                    <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {note.content || "No description available"}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {note.document_type}
                  </span>
                  <span>•</span>
                  <span>{note.subject}</span>
                  <span>•</span>

                  <span>{note.branch}</span>
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {note.likeCount + note.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {note.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {note.downloadsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.published)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      by {note.author}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={note.file_url.webViewLink} target="_blank">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardContent className="p-0">
        {/* Preview Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <iframe
            src={note.url ? note.url : getPreviewUrl()}
            className="h-full w-full border-0 transition-transform group-hover:scale-105"
            title={`Preview of ${note.title}`}
          />

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {note.pinned && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 text-xs"
              >
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            {note.trending && (
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-800 text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {note.verified && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/notes/${note._id}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Quick View
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div>
            <Link href={`/notes/${note._id}`} target="_blank">
              <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                {note.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {note.content || "No description available"}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {note.document_type}
            </Badge>
            {note.subject && (
              <Badge variant="outline" className="text-xs">
                {note.subject}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {note.likeCount + note.likes.length}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {note.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {note.downloadsCount}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(note.published)}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">by {note.author}</div>
        </div>
      </CardContent>
    </Card>
  );
}
