"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconClassName?: string;
  image?: string;
  imagePosition?: "top" | "right";
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  image,
  imagePosition = "top",
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden p-6 gap-6",
        imagePosition === "right" ? "flex flex-row" : "flex flex-col-reverse",
        "h-full",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col flex-grow",
          imagePosition === "right" && "w-1/2"
        )}
      >
        {Icon && (
          <div className="mb-4">
            <Icon
              className={cn("h-8 w-8 text-primary", iconClassName)}
              aria-hidden="true"
            />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground flex-grow">{description}</p>
      </div>
      {image && (
        <div
          className={cn(
            "relative rounded-lg overflow-hidden opacity-70",
            imagePosition === "top" && "w-full h-40",
            imagePosition === "right" && "w-1/2 h-full",
            className?.includes("first-card") && "h-60"
          )}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
}
