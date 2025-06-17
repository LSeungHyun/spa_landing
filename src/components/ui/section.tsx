"use client";

import { cn } from "@/lib/utils";
import React, { JSX } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof Pick<
    JSX.IntrinsicElements,
    "div" | "section" | "article" | "main"
  >;
  size?: "default" | "small" | "large";
}

export function Section({
  as: Component = "section",
  size = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        "w-full py-12",
        {
          "py-16 md:py-24": size === "default",
          "py-12 md:py-16": size === "small",
          "py-24 md:py-32": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
