"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  price: string;
  duration?: string;
  features: PricingFeature[];
  popular?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export function PricingCard({
  name,
  description,
  price,
  duration = "/month",
  features,
  popular = false,
  buttonText = "Get Started",
  buttonLink = "/signup",
  className,
  ...props
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col p-6",
        popular && "border-primary shadow-lg",
        className
      )}
      {...props}
    >
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <div className="mb-5 space-y-2">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mb-5">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-muted-foreground">{duration}</span>
      </div>
      <div className="mb-8 space-y-2.5">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                feature.included ? "text-primary" : "text-muted-foreground/50"
              )}
            />
            <span
              className={cn(
                "text-sm",
                !feature.included && "text-muted-foreground/50"
              )}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      <Button
        className="mt-auto"
        variant={popular ? "default" : "outline"}
        asChild
      >
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </Card>
  );
}
