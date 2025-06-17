"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
  as?: React.ElementType;
  size?: "default" | "small" | "large";
  className?: string;
  children?: React.ReactNode;
}

export function Container({
  as: Component = "div",
  size = "default",
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 md:px-6",
        {
          "max-w-screen-xl": size === "default",
          "max-w-screen-lg": size === "small",
          "max-w-screen-2xl": size === "large",
        },
        className
      )}
    >
      {children}
    </Component>
  );
}
