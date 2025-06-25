/**
 * 사용 제한 동기화 훅
 * 
 * 서버와 클라이언트 간의 사용 제한 상태를 동기화하고,
 * 불일치 감지 및 자동 복구 기능을 제공합니다.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

// 사용 제한 정보 타입
export interface UsageInfo {
    usageCount: number
    remainingCount: number
    maxUsageCount: number
    resetTime: string
    lastUpdated: string
}

// 동기화 상태 타입
export interface SyncState {
    isLoading: boolean
    isError: boolean
    error?: string
    lastSyncTime?: string
    syncAttempts: number
}

// 불일치 정보 타입
export interface DiscrepancyInfo {
    hasDiscrepancy: boolean
    serverCount?: number
    localCount?: number
    difference?: number
}

// 서버 응답 타입
interface ServerUsageResponse {
    usageCount: number
    remainingCount: number
    maxUsageCount: number
    resetTime: string
}

// 로컬 스토리지 키
const STORAGE_KEY = 'smart-prompt-usage'
const SYNC_STATE_KEY = 'smart-prompt-sync-state'

/**
 * 사용 제한 동기화 훅
 */
export const useUsageLimitSync = () => {
    const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null)
    const [syncState, setSyncState] = useState<SyncState>({
        isLoading: false,
        isError: false,
        syncAttempts: 0
    })
    const [discrepancy, setDiscrepancy] = useState<DiscrepancyInfo>({
        hasDiscrepancy: false
    })

    const { toast } = useToast()
    const syncTimeoutRef = useRef<NodeJS.Timeout>()
    const maxSyncAttempts = 3

    // 로컬 스토리지에서 사용 정보 로드
    const loadLocalUsageInfo = useCallback((): UsageInfo | null => {
        try {
            if (typeof window === 'undefined') return null

            const stored = localStorage.getItem(STORAGE_KEY)
            if (!stored) return null

            const parsed = JSON.parse(stored)

            // 데이터 유효성 검증
            if (
                typeof parsed.usageCount === 'number' &&
                typeof parsed.remainingCount === 'number' &&
                typeof parsed.maxUsageCount === 'number' &&
                typeof parsed.resetTime === 'string' &&
                typeof parsed.lastUpdated === 'string'
            ) {
                return parsed
            }

            return null
        } catch (error) {
            console.error('Failed to load local usage info:', error)
            return null
        }
    }, [])

    // 로컬 스토리지에 사용 정보 저장
    const saveLocalUsageInfo = useCallback((info: UsageInfo) => {
        try {
            if (typeof window === 'undefined') return

            localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
        } catch (error) {
            console.error('Failed to save local usage info:', error)
        }
    }, [])

    // 서버에서 사용 정보 가져오기
    const fetchServerUsageInfo = useCallback(async (): Promise<ServerUsageResponse | null> => {
        try {
            const response = await fetch('/api/usage-limit/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            return {
                usageCount: data.usageCount || 0,
                remainingCount: data.remainingCount || 3,
                maxUsageCount: data.maxUsageCount || 3,
                resetTime: data.resetTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        } catch (error) {
            console.error('Failed to fetch server usage info:', error)
            return null
        }
    }, [])

    // 불일치 감지
    const detectDiscrepancy = useCallback((local: UsageInfo, server: ServerUsageResponse): DiscrepancyInfo => {
        const difference = Math.abs(local.usageCount - server.usageCount)
        const hasDiscrepancy = difference > 0

        return {
            hasDiscrepancy,
            serverCount: server.usageCount,
            localCount: local.usageCount,
            difference
        }
    }, [])

    // 서버와 동기화
    const syncWithServer = useCallback(async (showToast = false): Promise<boolean> => {
        if (syncState.syncAttempts >= maxSyncAttempts) {
            console.warn('Max sync attempts reached')
            return false
        }

        setSyncState(prev => ({
            ...prev,
            isLoading: true,
            isError: false,
            syncAttempts: prev.syncAttempts + 1
        }))

        try {
            const serverInfo = await fetchServerUsageInfo()

            if (!serverInfo) {
                throw new Error('Failed to fetch server usage info')
            }

            const localInfo = loadLocalUsageInfo()

            // 불일치 감지
            if (localInfo) {
                const discrepancyInfo = detectDiscrepancy(localInfo, serverInfo)
                setDiscrepancy(discrepancyInfo)

                if (discrepancyInfo.hasDiscrepancy && showToast) {
                    toast.warning('사용 현황 불일치 감지', {
                        description: `서버: ${discrepancyInfo.serverCount}회, 로컬: ${discrepancyInfo.localCount}회`,
                    })
                }
            }

            // 서버 정보로 업데이트
            const updatedInfo: UsageInfo = {
                usageCount: serverInfo.usageCount,
                remainingCount: serverInfo.remainingCount,
                maxUsageCount: serverInfo.maxUsageCount,
                resetTime: serverInfo.resetTime,
                lastUpdated: new Date().toISOString()
            }

            setUsageInfo(updatedInfo)
            saveLocalUsageInfo(updatedInfo)

            setSyncState(prev => ({
                ...prev,
                isLoading: false,
                isError: false,
                lastSyncTime: new Date().toISOString(),
                syncAttempts: 0
            }))

            if (showToast) {
                toast.success('동기화 완료', {
                    description: '사용 현황이 서버와 동기화되었습니다.',
                })
            }

            return true
        } catch (error) {
            console.error('Sync failed:', error)

            setSyncState(prev => ({
                ...prev,
                isLoading: false,
                isError: true,
                error: error instanceof Error ? error.message : 'Unknown error'
            }))

            if (showToast) {
                toast.error('동기화 실패', {
                    description: '서버와의 동기화에 실패했습니다.',
                })
            }

            return false
        }
    }, [syncState.syncAttempts, loadLocalUsageInfo, fetchServerUsageInfo, detectDiscrepancy, saveLocalUsageInfo, toast])

    // 낙관적 업데이트 (API 호출 전 미리 업데이트)
    const optimisticUpdate = useCallback((increment: number = 1) => {
        setUsageInfo(prev => {
            if (!prev) return null

            const newUsageCount = prev.usageCount + increment
            const newRemainingCount = Math.max(0, prev.remainingCount - increment)

            const updated: UsageInfo = {
                ...prev,
                usageCount: newUsageCount,
                remainingCount: newRemainingCount,
                lastUpdated: new Date().toISOString()
            }

            saveLocalUsageInfo(updated)
            return updated
        })
    }, [saveLocalUsageInfo])

    // 서버 응답으로부터 업데이트
    const updateFromServerResponse = useCallback((serverResponse: {
        usageCount?: number
        remainingCount?: number
        maxUsageCount?: number
        resetTime?: string
    }) => {
        const updatedInfo: UsageInfo = {
            usageCount: serverResponse.usageCount ?? usageInfo?.usageCount ?? 0,
            remainingCount: serverResponse.remainingCount ?? usageInfo?.remainingCount ?? 3,
            maxUsageCount: serverResponse.maxUsageCount ?? usageInfo?.maxUsageCount ?? 3,
            resetTime: serverResponse.resetTime ?? usageInfo?.resetTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: new Date().toISOString()
        }

        setUsageInfo(updatedInfo)
        saveLocalUsageInfo(updatedInfo)

        // 불일치 상태 초기화
        setDiscrepancy({ hasDiscrepancy: false })
    }, [usageInfo, saveLocalUsageInfo])

    // 롤백 (API 실패 시)
    const rollback = useCallback((decrement: number = 1) => {
        setUsageInfo(prev => {
            if (!prev) return null

            const newUsageCount = Math.max(0, prev.usageCount - decrement)
            const newRemainingCount = Math.min(prev.maxUsageCount, prev.remainingCount + decrement)

            const updated: UsageInfo = {
                ...prev,
                usageCount: newUsageCount,
                remainingCount: newRemainingCount,
                lastUpdated: new Date().toISOString()
            }

            saveLocalUsageInfo(updated)
            return updated
        })
    }, [saveLocalUsageInfo])

    // 초기화
    const reset = useCallback(() => {
        setUsageInfo(null)
        setDiscrepancy({ hasDiscrepancy: false })
        setSyncState({
            isLoading: false,
            isError: false,
            syncAttempts: 0
        })

        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(SYNC_STATE_KEY)
        }
    }, [])

    // 자동 동기화 설정
    const enableAutoSync = useCallback((intervalMinutes: number = 5) => {
        if (syncTimeoutRef.current) {
            clearInterval(syncTimeoutRef.current)
        }

        syncTimeoutRef.current = setInterval(() => {
            syncWithServer(false)
        }, intervalMinutes * 60 * 1000)
    }, [syncWithServer])

    // 자동 동기화 해제
    const disableAutoSync = useCallback(() => {
        if (syncTimeoutRef.current) {
            clearInterval(syncTimeoutRef.current)
            syncTimeoutRef.current = undefined
        }
    }, [])

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        const localInfo = loadLocalUsageInfo()
        if (localInfo) {
            setUsageInfo(localInfo)

            // 마지막 업데이트로부터 5분 이상 지났으면 동기화
            const lastUpdated = new Date(localInfo.lastUpdated)
            const now = new Date()
            const minutesSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60)

            if (minutesSinceUpdate > 5) {
                syncWithServer(false)
            }
        } else {
            // 로컬 정보가 없으면 서버에서 가져오기
            syncWithServer(false)
        }

        // 자동 동기화 활성화 (5분 간격)
        enableAutoSync(5)

        return () => {
            disableAutoSync()
        }
    }, [loadLocalUsageInfo, syncWithServer, enableAutoSync, disableAutoSync])

    return {
        // 상태
        usageInfo,
        syncState,
        discrepancy,

        // 액션
        syncWithServer,
        optimisticUpdate,
        updateFromServerResponse,
        rollback,
        reset,
        enableAutoSync,
        disableAutoSync,

        // 계산된 값
        canUse: usageInfo ? usageInfo.remainingCount > 0 : true,
        isLimitReached: usageInfo ? usageInfo.remainingCount <= 0 : false,
        progressPercentage: usageInfo ? (usageInfo.usageCount / usageInfo.maxUsageCount) * 100 : 0,
    }
} 