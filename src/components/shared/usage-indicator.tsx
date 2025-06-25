/**
 * 사용 현황 표시 컴포넌트
 * 
 * 사용 제한 현황을 시각화하고 동기화 상태를 표시합니다.
 * 3가지 변형(default, compact, detailed)을 지원합니다.
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    AlertTriangle,
    Info,
    Zap,
    Shield,
    Globe,
    Eye,
    EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUsageLimitSync } from '@/hooks/use-usage-limit-sync'

// IP 정보 타입
interface IPDebugInfo {
    originalIP: string
    productionSafeIP: string
    version: number
    isLocal: boolean
    isPrivate: boolean
    source: string
    headers: Record<string, string | undefined>
}

// 컴포넌트 변형 타입
type UsageIndicatorVariant = 'default' | 'compact' | 'detailed'

// 컴포넌트 Props
interface UsageIndicatorProps {
    variant?: UsageIndicatorVariant
    className?: string
    showSyncButton?: boolean
    showDevTools?: boolean
    showIPInfo?: boolean
    onLimitReached?: () => void
}

/**
 * 사용 현황 표시 컴포넌트
 */
export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
    variant = 'default',
    className,
    showSyncButton = true,
    showDevTools = process.env.NODE_ENV === 'development',
    showIPInfo = process.env.NODE_ENV === 'development',
    onLimitReached
}) => {
    const {
        usageInfo,
        syncState,
        discrepancy,
        syncWithServer,
        reset,
        canUse,
        isLimitReached,
        progressPercentage
    } = useUsageLimitSync()

    // IP 정보 상태
    const [ipInfo, setIPInfo] = useState<{
        ipAddress: string
        debugInfo?: IPDebugInfo
    } | null>(null)
    const [showIPDetails, setShowIPDetails] = useState(false)

    // IP 정보 가져오기
    useEffect(() => {
        const fetchIPInfo = async () => {
            try {
                const response = await fetch('/api/usage-limit/check')
                if (response.ok) {
                    const data = await response.json()
                    setIPInfo({
                        ipAddress: data.ipAddress || 'Unknown',
                        debugInfo: data.ipInfo
                    })
                }
            } catch (error) {
                console.error('Failed to fetch IP info:', error)
            }
        }

        if (showIPInfo) {
            fetchIPInfo()
        }
    }, [showIPInfo])

    // 제한 도달 시 콜백 호출
    React.useEffect(() => {
        if (isLimitReached && onLimitReached) {
            onLimitReached()
        }
    }, [isLimitReached, onLimitReached])

    // IP 주소 마스킹 (보안)
    const maskIPAddress = (ip: string): string => {
        if (!ip || ip === 'Unknown') return ip
        
        // IPv4 마스킹 (마지막 옥텟만 숨김)
        if (ip.includes('.')) {
            const parts = ip.split('.')
            if (parts.length === 4) {
                return `${parts[0]}.${parts[1]}.${parts[2]}.***`
            }
        }
        
        // IPv6 마스킹 (마지막 부분만 숨김)
        if (ip.includes(':')) {
            const parts = ip.split(':')
            if (parts.length > 2) {
                return `${parts.slice(0, -2).join(':')}:***:***`
            }
        }
        
        return ip
    }

    // IP 정보 컴포넌트
    const IPInfoDisplay: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
        if (!showIPInfo || !ipInfo) return null

        const maskedIP = maskIPAddress(ipInfo.ipAddress)

        if (compact) {
            return (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    <span>{maskedIP}</span>
                    {ipInfo.debugInfo?.isLocal && (
                        <Badge variant="outline" className="text-xs">로컬</Badge>
                    )}
                </div>
            )
        }

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">IP 주소</span>
                    </div>
                    {ipInfo.debugInfo && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowIPDetails(!showIPDetails)}
                            className="h-6 px-2 text-xs"
                        >
                            {showIPDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                        {maskedIP}
                    </code>
                    {ipInfo.debugInfo?.isLocal && (
                        <Badge variant="outline" className="text-xs">로컬</Badge>
                    )}
                    {ipInfo.debugInfo?.isPrivate && !ipInfo.debugInfo.isLocal && (
                        <Badge variant="outline" className="text-xs">프라이빗</Badge>
                    )}
                </div>

                {/* 디버깅 정보 (개발 환경) */}
                {showIPDetails && ipInfo.debugInfo && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md text-xs space-y-2">
                        <div className="font-medium text-muted-foreground">디버깅 정보</div>
                        <div className="space-y-1">
                            <div>원본 IP: <code>{ipInfo.debugInfo.originalIP}</code></div>
                            <div>프로덕션 IP: <code>{ipInfo.debugInfo.productionSafeIP}</code></div>
                            <div>IP 버전: IPv{ipInfo.debugInfo.version}</div>
                            <div>추출 소스: {ipInfo.debugInfo.source}</div>
                            <div>로컬: {ipInfo.debugInfo.isLocal ? '예' : '아니오'}</div>
                            <div>프라이빗: {ipInfo.debugInfo.isPrivate ? '예' : '아니오'}</div>
                        </div>
                        <details className="mt-2">
                            <summary className="cursor-pointer text-muted-foreground">
                                HTTP 헤더
                            </summary>
                            <div className="mt-1 space-y-1">
                                {Object.entries(ipInfo.debugInfo.headers).map(([key, value]) => (
                                    <div key={key}>
                                        {key}: <code>{value || 'undefined'}</code>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        )
    }

    // 로딩 상태
    if (!usageInfo && syncState.isLoading) {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">사용 현황 확인 중...</span>
            </div>
        )
    }

    // 에러 상태
    if (syncState.isError) {
        return (
            <div className={cn('flex items-center gap-2 text-destructive', className)}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">사용 현황 확인 실패</span>
                {showSyncButton && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => syncWithServer(true)}
                        disabled={syncState.isLoading}
                    >
                        <RefreshCw className={cn('w-3 h-3', syncState.isLoading && 'animate-spin')} />
                    </Button>
                )}
            </div>
        )
    }

    // 기본값 설정
    const usage = usageInfo || {
        usageCount: 0,
        remainingCount: 3,
        maxUsageCount: 3,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString()
    }

    // 상태 아이콘 및 색상
    const getStatusIcon = () => {
        if (discrepancy.hasDiscrepancy) {
            return <AlertTriangle className="w-4 h-4 text-warning" />
        }
        if (isLimitReached) {
            return <AlertCircle className="w-4 h-4 text-destructive" />
        }
        if (usage.remainingCount === 1) {
            return <Clock className="w-4 h-4 text-warning" />
        }
        return <CheckCircle className="w-4 h-4 text-success" />
    }

    const getStatusColor = () => {
        if (discrepancy.hasDiscrepancy) return 'warning'
        if (isLimitReached) return 'destructive'
        if (usage.remainingCount === 1) return 'warning'
        return 'success'
    }

    const getStatusText = () => {
        if (discrepancy.hasDiscrepancy) {
            return `불일치 감지 (서버: ${discrepancy.serverCount}, 로컬: ${discrepancy.localCount})`
        }
        if (isLimitReached) {
            return '사용 한도 초과'
        }
        if (usage.remainingCount === 1) {
            return '마지막 사용 기회'
        }
        return '정상'
    }

    // 리셋 시간 포맷팅
    const formatResetTime = (resetTime: string) => {
        const date = new Date(resetTime)
        const now = new Date()
        const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60))

        if (diffHours <= 0) {
            return '곧 초기화'
        } else if (diffHours < 24) {
            return `${diffHours}시간 후 초기화`
        } else {
            return date.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }

    // Compact 변형
    if (variant === 'compact') {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                {getStatusIcon()}
                <span className="text-sm font-medium">
                    {usage.remainingCount}/{usage.maxUsageCount}
                </span>
                <Progress
                    value={progressPercentage}
                    className="w-16 h-2"
                />
                {discrepancy.hasDiscrepancy && (
                    <Badge variant="outline" className="text-xs">
                        불일치
                    </Badge>
                )}
                {showIPInfo && <IPInfoDisplay compact />}
            </div>
        )
    }

    // Detailed 변형
    if (variant === 'detailed') {
        return (
            <Card className={cn('w-full max-w-md', className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="w-4 h-4" />
                        사용 현황
                        <Badge variant={getStatusColor() as any} className="ml-auto">
                            {getStatusText()}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* IP 정보 */}
                    {showIPInfo && (
                        <div className="pb-3 border-b">
                            <IPInfoDisplay />
                        </div>
                    )}

                    {/* 진행률 바 */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>사용량</span>
                            <span className="font-medium">
                                {usage.usageCount}/{usage.maxUsageCount}
                            </span>
                        </div>
                        <Progress
                            value={progressPercentage}
                            className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{usage.remainingCount}회 남음</span>
                            <span>{formatResetTime(usage.resetTime)}</span>
                        </div>
                    </div>

                    {/* 불일치 경고 */}
                    {discrepancy.hasDiscrepancy && (
                        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
                            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-warning">
                                    서버-클라이언트 불일치
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    서버: {discrepancy.serverCount}회, 로컬: {discrepancy.localCount}회
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 동기화 상태 */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            <span className="text-muted-foreground">동기화 상태</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {syncState.isLoading ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : syncState.isError ? (
                                <AlertCircle className="w-3 h-3 text-destructive" />
                            ) : (
                                <CheckCircle className="w-3 h-3 text-success" />
                            )}
                            <span className="text-xs">
                                {syncState.isLoading ? '동기화 중' :
                                    syncState.isError ? '동기화 실패' : '동기화됨'}
                            </span>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    {showSyncButton && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => syncWithServer(true)}
                                disabled={syncState.isLoading}
                                className="flex-1"
                            >
                                <RefreshCw className={cn('w-3 h-3 mr-2', syncState.isLoading && 'animate-spin')} />
                                동기화
                            </Button>
                            {showDevTools && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={reset}
                                    className="flex-1"
                                >
                                    초기화
                                </Button>
                            )}
                        </div>
                    )}

                    {/* 개발자 도구 */}
                    {showDevTools && (
                        <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground mb-2">
                                개발자 정보
                            </summary>
                            <div className="space-y-1 text-muted-foreground">
                                <div>마지막 업데이트: {new Date(usage.lastUpdated).toLocaleString('ko-KR')}</div>
                                <div>동기화 시도: {syncState.syncAttempts}</div>
                                {syncState.lastSyncTime && (
                                    <div>마지막 동기화: {new Date(syncState.lastSyncTime).toLocaleString('ko-KR')}</div>
                                )}
                                {syncState.error && (
                                    <div className="text-destructive">에러: {syncState.error}</div>
                                )}
                            </div>
                        </details>
                    )}
                </CardContent>
            </Card>
        )
    }

    // Default 변형
    return (
        <div className={cn('flex items-center gap-3', className)}>
            {getStatusIcon()}

            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {usage.usageCount}/{usage.maxUsageCount} 사용
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatResetTime(usage.resetTime)}
                    </span>
                </div>
                <Progress
                    value={progressPercentage}
                    className="h-1.5"
                />
                {showIPInfo && (
                    <div className="pt-1">
                        <IPInfoDisplay compact />
                    </div>
                )}
            </div>

            {/* 불일치 표시 */}
            {discrepancy.hasDiscrepancy && (
                <Badge variant="outline" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    불일치
                </Badge>
            )}

            {/* 동기화 버튼 */}
            {showSyncButton && (syncState.isError || discrepancy.hasDiscrepancy) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => syncWithServer(true)}
                    disabled={syncState.isLoading}
                >
                    <RefreshCw className={cn('w-3 h-3', syncState.isLoading && 'animate-spin')} />
                </Button>
            )}
        </div>
    )
}

// 간단한 사용량 표시만 하는 컴포넌트
export const SimpleUsageDisplay: React.FC<{
    className?: string
}> = ({ className }) => {
    const { usageInfo, canUse, isLimitReached } = useUsageLimitSync()

    if (!usageInfo) return null

    return (
        <div className={cn('flex items-center gap-2 text-sm', className)}>
            <div className={cn(
                'flex items-center gap-1',
                isLimitReached ? 'text-destructive' : 'text-muted-foreground'
            )}>
                <Zap className="w-3 h-3" />
                <span>
                    {usageInfo.remainingCount}회 남음
                </span>
            </div>
            {!canUse && (
                <Badge variant="destructive" className="text-xs">
                    한도 초과
                </Badge>
            )}
        </div>
    )
}

export default UsageIndicator 