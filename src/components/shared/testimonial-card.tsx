"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  author: {
    name: string;
    title: string;
    image?: string;
  };
  rating?: number;
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <Card className={cn("flex h-full flex-col p-6", className)} {...props}>
      <div className="mb-4 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <blockquote className="mb-6 flex-1">
        <p className="text-muted-foreground">{quote}</p>
      </blockquote>
      <div className="flex items-center gap-4">
        {author.image && (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={author.image}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold">{author.name}</div>
          <div className="text-sm text-muted-foreground">{author.title}</div>
        </div>
      </div>
    </Card>
  );
}
