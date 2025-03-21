"use client";
import Link from "next/link";
import { Eye, Heart, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function TrendingNote({
  title,
  subject,
  uploader,
  likes,
  views,
  image,
  href,
  badge,
  date,
}) {
  console.log(title);
  return (
    <Card className="overflow-hidden note-card w-10/12 mx-auto lg:w-full ">
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <iframe
            src={`${image}`}
            className="mx-auto object-cover transition-transform duration-300 pointer-events-none"
            width={250}
            height={225}
          />
        </div>
        {badge && (
          <Badge
            className="absolute right-2 top-2 bg-brand text-white hover:bg-brand-dark"
            variant="secondary"
          >
            {badge}
          </Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">
          <Link href={href} className="hover:text-brand">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>{subject}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{uploader}</span>
        </div>
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{likes}</span>
          </div>
          
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date.split('T')[0]}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
