"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  image?: string;
}

export function HeroSection({
  title = "Transform your business with our powerful SaaS solution",
  description = "Streamline your operations, boost productivity, and drive growth with our comprehensive suite of tools designed for modern businesses.",
  image = "https://picsum.photos/800/600",
  className,
  ...props
}: HeroSectionProps) {
  return (
    <Section className={className} {...props}>
      <Container>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {description}
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={image}
                alt="Hero Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
