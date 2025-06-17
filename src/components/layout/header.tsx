"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: NavItem[];
}

export function Header({
  navItems = [
    { label: "기능", href: "#features" },
    { label: "시나리오", href: "#scenarios" },
    { label: "요금제", href: "#pricing" },
    { label: "사용 방법", href: "#how-it-works" },
    { label: "고객 후기", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "문의하기", href: "#contact" },
  ],
  className,
  ...props
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background",
        className
      )}
      {...props}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Logo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link href="/login">Sign In</Link>
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
