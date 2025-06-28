'use client';

import { motion } from 'framer-motion';
import { Chrome, Star, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChromeExtensionBadgeProps {
    variant?: 'default' | 'compact' | 'detailed';
    showRating?: boolean;
    showUsers?: boolean;
    className?: string;
}

export function ChromeExtensionBadge({ 
    variant = 'default', 
    showRating = false, 
    showUsers = false,
    className 
}: ChromeExtensionBadgeProps) {
    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-medium border border-blue-200",
                    className
                )}
            >
                <Chrome className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold">Chrome 확장</span>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
        );
    }

    if (variant === 'detailed') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "bg-white rounded-xl p-6 shadow-lg border border-slate-200",
                    className
                )}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Chrome className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Chrome 웹스토어 출시 예정</h3>
                        <p className="text-sm text-slate-600">브라우저에서 바로 사용 가능</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {showRating && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700">4.9/5</span>
                        </div>
                    )}
                    
                    {showUsers && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-600" />
                            <span className="text-sm text-slate-600">1,000+ 사용자</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    <Shield className="w-4 h-4" />
                    <span>안전하고 개인정보 보호</span>
                </div>
            </motion.div>
        );
    }

    // Default variant
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-medium border border-blue-200",
                className
            )}
        >
            <Chrome className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold">Chrome 확장 프로그램</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">곧 출시</span>
        </motion.div>
    );
}

// Trust Elements Component for additional credibility
interface TrustElementsProps {
    showStats?: boolean;
    className?: string;
}

export function TrustElements({ showStats = true, className }: TrustElementsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600", className)}
        >
            <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>개인정보 보호</span>
            </div>
            
            <div className="flex items-center gap-2">
                <Chrome className="w-4 h-4 text-blue-600" />
                <span>Chrome 웹스토어 승인</span>
            </div>
            
            {showStats && (
                <>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.9/5 평점</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>1,248명 사전등록</span>
                    </div>
                </>
            )}
        </motion.div>
    );
}

// Browser Extension Indicator for demo sections
interface BrowserExtensionIndicatorProps {
    className?: string;
}

export function BrowserExtensionIndicator({ className }: BrowserExtensionIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "absolute top-3 right-3 flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium shadow-sm",
                className
            )}
        >
            <Chrome className="w-3 h-3" />
            <span>Smart Prompt</span>
        </motion.div>
    );
}

export default ChromeExtensionBadge; 