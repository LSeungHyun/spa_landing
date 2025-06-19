"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  links?: {
    title: string;
    items: {
      label: string;
      href: string;
    }[];
  }[];
}

export function Footer({
  links = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Security", href: "/security" },
      ],
    },
  ],
  className,
  ...props
}: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className={cn("border-t bg-background py-8 md:py-12", className)}
      {...props}
    >
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Logo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Empowering businesses with innovative SaaS solutions for growth
              and success.
            </p>
          </div>
          {links.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear || '2024'} Your Company. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
