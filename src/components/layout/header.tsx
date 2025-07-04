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
  onClick?: () => void;
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
    { 
      label: "예약하기", 
      href: "#pre-registration",
      onClick: () => {
        const element = document.querySelector('[data-section="pre-registration"]') as HTMLElement;
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    },
  ],
  className,
  ...props
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

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
              item.onClick ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )
            ))}
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
                item.onClick ? (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item)}
                    className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
