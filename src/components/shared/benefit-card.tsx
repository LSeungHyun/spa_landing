"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  highlight?: boolean;
  delay?: number;
  className?: string;
}

export function BenefitCard({
  icon: Icon,
  title,
  description,
  value,
  highlight = false,
  delay = 0,
  className
}: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={cn("h-full", className)}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300 h-full",
        "bg-white/10 backdrop-blur-sm",
        highlight 
          ? "border-yellow-400/50 shadow-2xl shadow-yellow-500/20" 
          : "border-white/20 hover:border-white/40",
        "hover:shadow-2xl hover:shadow-white/10"
      )}>
        {/* 배경 그라디언트 효과 */}
        <div className={cn(
          "absolute inset-0 opacity-20",
          highlight 
            ? "bg-gradient-to-br from-yellow-400/30 via-orange-400/20 to-pink-400/30"
            : "bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-indigo-400/20"
        )} />
        
        {/* 하이라이트 배지 */}
        {highlight && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
              인기
            </Badge>
          </div>
        )}

        {/* 카드 내용 */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* 아이콘 */}
          <motion.div
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: 1.1
            }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto",
              highlight 
                ? "bg-yellow-500/20 text-yellow-300" 
                : "bg-white/20 text-white"
            )}
          >
            <Icon className="w-6 h-6" />
          </motion.div>

          {/* 제목 */}
          <h3 className={cn(
            "text-xl font-bold mb-3 text-center",
            highlight ? "text-yellow-300" : "text-white"
          )}>
            {title}
          </h3>

          {/* 설명 */}
          <p className="text-blue-100 text-sm text-center mb-4 flex-grow leading-relaxed">
            {description}
          </p>

          {/* 가치 표시 */}
          <div className="mt-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={cn(
                "text-center p-3 rounded-lg font-bold text-sm",
                highlight 
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" 
                  : "bg-white/10 text-white border border-white/20"
              )}
            >
              {value}
            </motion.div>
          </div>
        </div>

        {/* 호버 시 글로우 효과 */}
        <div className={cn(
          "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br from-transparent via-white/5 to-transparent",
          "pointer-events-none"
        )} />
      </Card>
    </motion.div>
  );
}

// 컴팩트 버전 (작은 공간용)
interface CompactBenefitCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color?: 'blue' | 'purple' | 'yellow' | 'green';
  className?: string;
}

export function CompactBenefitCard({
  icon: Icon,
  title,
  value,
  color = 'blue',
  className
}: CompactBenefitCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    green: 'bg-green-500/20 text-green-300 border-green-400/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
        colorClasses[color],
        "hover:shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        "bg-white/20"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-xs opacity-90">{value}</p>
      </div>
    </motion.div>
  );
}

export default BenefitCard; 