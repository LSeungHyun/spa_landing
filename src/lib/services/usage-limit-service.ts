/**
 * IP 湲곕컲 ?ъ슜 ?쒗븳 ?쒕퉬??
 * 
 * ???쒕퉬?ㅻ뒗 IP 二쇱냼蹂??ъ슜 ?잛닔瑜?愿由ы븯怨?
 * ?곗씠?곕쿋?댁뒪? 罹먯떆瑜??듯븳 ?먯옄???곗궛??蹂댁옣?⑸땲??
 */

import { supabaseAdmin } from '@/lib/supabase-client'
import type {
    IPUsageRecord,
    IPUsageRecordInsert,
    IPUsageRecordUpdate,
    UsageLimitCheckResponse,
    UsageIncrementResponse,
    UsageRollbackResponse,
    UsageLimitError,
    UsageStatistics,
    UsageLimitConfig
} from '@/types/usage-limit'
import { UsageLimitErrorCode } from '@/types/usage-limit'
import { cache, CacheKeys, CacheTTL, cacheUtils } from '@/lib/cache/redis-config'

// Supabase ?대씪?댁뼵??珥덇린??(?쒕쾭??愿由ъ옄 ?대씪?댁뼵???ъ슜)
const supabase = supabaseAdmin

// 湲곕낯 ?ㅼ젙
const DEFAULT_CONFIG: UsageLimitConfig = {
    maxUsage: 3,
    resetPeriodHours: 24,
    cacheTTL: 3600,
    enableConcurrencyControl: true,
    rateLimitConfig: {
        windowSeconds: 60,
        maxRequests: 10
    }
}

/**
 * ?ъ슜 ?쒗븳 ?쒕퉬???대옒??
 * IP 湲곕컲 ?ъ슜 ?쒗븳??愿由ы븯硫?Redis 罹먯떆瑜??듯븳 ?깅뒫 理쒖쟻???쒓났
 */
export class UsageLimitService {
    private config: UsageLimitConfig

    constructor(config: Partial<UsageLimitConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    /**
     * IP 二쇱냼???ъ슜 ?쒗븳 ?곹깭 ?뺤씤 (罹먯떆 ?곗꽑)
     */
    async checkUsageLimit(ipAddress: string): Promise<UsageLimitCheckResponse> {
        try {
            // Supabase ?대씪?댁뼵???뺤씤
            if (!supabase) {
                console.error('Supabase admin client is not available')
                return this.createErrorResponse(
                    UsageLimitErrorCode.DATABASE_ERROR,
                    'Database connection not available'
                )
            }
            // 1. 罹먯떆?먯꽌 癒쇱? ?뺤씤
            const cacheKey = CacheKeys.IP_USAGE(ipAddress)
            const cachedRecord = await cache.get<IPUsageRecord>(cacheKey)

            if (cachedRecord) {
                const canUse = cachedRecord.usage_count < this.config.maxUsage
                // 캐시에서 가져올 때도 resetTime 안전 처리
                const safeResetTime = new Date(Date.now() + this.config.resetPeriodHours * 60 * 60 * 1000);

                return {
                    canUse,
                    remainingCount: Math.max(0, this.config.maxUsage - cachedRecord.usage_count),
                    usageCount: cachedRecord.usage_count,
                    resetTime: safeResetTime,
                    isFromCache: true,
                }
            }

            // 2. 데이터베이스에서 직접 조회 (RPC 대신 직접 쿼리 사용)
            const { data, error } = await supabase
                .from('ip_usage_limits')
                .select('*')
                .eq('ip_address', ipAddress)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            let currentCount = 0;
            let lastUsedAt = null;

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Database error in checkUsageLimit:', error)
                return this.createErrorResponse(UsageLimitErrorCode.DATABASE_ERROR, error.message)
            }

            if (data) {
                currentCount = data.usage_count || 0;
                lastUsedAt = data.last_used_at;

                // 24시간이 지났는지 확인
                if (lastUsedAt) {
                    const lastUsed = new Date(lastUsedAt);
                    const now = new Date();
                    const hoursDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);

                    if (hoursDiff >= 24) {
                        // 24시간이 지났으면 카운트 리셋
                        currentCount = 0;
                    }
                }
            }

            const canUse = currentCount < this.config.maxUsage;
            const remainingCount = Math.max(0, this.config.maxUsage - currentCount);

            const result = {
                can_use: canUse,
                current_count: currentCount,
                remaining_count: remainingCount,
                reset_time: new Date(Date.now() + this.config.resetPeriodHours * 60 * 60 * 1000).toISOString()
            }

            // 3. 罹먯떆?????
            const recordToCache: IPUsageRecord = {
                id: `${ipAddress}-${Date.now()}`,
                ip_address: ipAddress,
                usage_count: result.current_count,
                last_used_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            await cache.set(cacheKey, recordToCache, CacheTTL.IP_USAGE)

            // resetTime 안전 처리
            let safeResetTime: Date;
            try {
                safeResetTime = new Date(result.reset_time);
                // 유효하지 않은 날짜인 경우 체크
                if (isNaN(safeResetTime.getTime())) {
                    throw new Error('Invalid date');
                }
            } catch {
                // fallback: 현재 시간에서 24시간 후
                safeResetTime = new Date(Date.now() + this.config.resetPeriodHours * 60 * 60 * 1000);
            }

            return {
                canUse: result.can_use,
                remainingCount: result.remaining_count,
                usageCount: result.current_count,
                resetTime: safeResetTime,
                isFromCache: false,
            }
        } catch (error) {
            console.error('Error in checkUsageLimit:', error)
            return this.createErrorResponse(
                UsageLimitErrorCode.INTERNAL_ERROR,
                error instanceof Error ? error.message : 'Unknown error occurred'
            )
        }
    }

    /**
     * ?ъ슜 ?잛닔 利앷? (?먯옄???곗궛)
     */
    async incrementUsage(ipAddress: string): Promise<UsageIncrementResponse> {
        try {
            // Supabase ?대씪?댁뼵???뺤씤
            if (!supabase) {
                console.error('Supabase admin client is not available')
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: 'Database connection not available',
                    },
                    remainingCount: 0,
                    usageCount: 0,
                }
            }
            // 1. ?ъ슜 ?쒗븳 ?뺤씤
            const limitCheck = await this.checkUsageLimit(ipAddress)
            if (!limitCheck.canUse) {
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.USAGE_LIMIT_EXCEEDED,
                        message: 'Usage limit exceeded',
                        details: {
                            maxCount: this.config.maxUsage,
                            currentCount: limitCheck.usageCount,
                        },
                    },
                    remainingCount: 0,
                    usageCount: limitCheck.usageCount,
                }
            }

            // 2. ?곗씠?곕쿋?댁뒪?먯꽌 ?먯옄??利앷?
            // 데이터베이스에서 직접 사용 횟수 증가
            const now = new Date().toISOString();
            const newCount = limitCheck.usageCount + 1;

            // upsert를 사용하여 레코드가 없으면 생성, 있으면 업데이트
            const { data, error } = await supabase
                .from('ip_usage_limits')
                .upsert({
                    ip_address: ipAddress,
                    usage_count: newCount,
                    last_used_at: now,
                    updated_at: now,
                    // 새 레코드인 경우에만 created_at 설정
                    ...(limitCheck.usageCount === 0 && { created_at: now })
                }, {
                    onConflict: 'ip_address'
                })
                .select()
                .single()

            if (error) {
                console.error('Database error in incrementUsage:', error)
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: error.message,
                    },
                    remainingCount: limitCheck.remainingCount,
                    usageCount: limitCheck.usageCount,
                }
            }

            const result = {
                success: true,
                new_count: newCount,
                remaining_count: Math.max(0, this.config.maxUsage - newCount)
            }

            // 3. 罹먯떆 ?낅뜲?댄듃
            const cacheKey = CacheKeys.IP_USAGE(ipAddress)
            const updatedRecord: IPUsageRecord = {
                id: `${ipAddress}-${Date.now()}`,
                ip_address: ipAddress,
                usage_count: result.new_count,
                last_used_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            await cache.set(cacheKey, updatedRecord, CacheTTL.IP_USAGE)

            return {
                success: true,
                remainingCount: result.remaining_count,
                usageCount: result.new_count,
                resetTime: new Date(Date.now() + this.config.resetPeriodHours * 60 * 60 * 1000),
            }
        } catch (error) {
            console.error('Error in incrementUsage:', error)
            return {
                success: false,
                error: {
                    code: UsageLimitErrorCode.INTERNAL_ERROR,
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
                remainingCount: 0,
                usageCount: 0,
            }
        }
    }

    /**
     * ?ъ슜 ?잛닔 濡ㅻ갚 (API ?ㅽ뙣 ??
     */
    async rollbackUsage(ipAddress: string): Promise<UsageRollbackResponse> {
        try {
            // Supabase ?대씪?댁뼵???뺤씤
            if (!supabase) {
                console.error('Supabase admin client is not available')
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: 'Database connection not available',
                    },
                    usageCount: 0,
                    remainingCount: 0,
                }
            }
            // 1. ?곗씠?곕쿋?댁뒪?먯꽌 濡ㅻ갚
            const { data, error } = await supabase.rpc('rollback_ip_usage', {
                ip_addr: ipAddress,
            })

            if (error) {
                console.error('Database error in rollbackUsage:', error)
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: error.message,
                    },
                    usageCount: 0,
                    remainingCount: 0,
                }
            }

            const result = data as {
                success: boolean
                new_count: number
                remaining_count: number
            }

            // 2. 罹먯떆 臾댄슚???먮뒗 ?낅뜲?댄듃
            const cacheKey = CacheKeys.IP_USAGE(ipAddress)

            if (result.success) {
                // 濡ㅻ갚 ?깃났 ??罹먯떆 ?낅뜲?댄듃
                const updatedRecord: IPUsageRecord = {
                    id: `${ipAddress}-${Date.now()}`,
                    ip_address: ipAddress,
                    usage_count: result.new_count,
                    last_used_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
                await cache.set(cacheKey, updatedRecord, CacheTTL.IP_USAGE)
            } else {
                // 濡ㅻ갚 ?ㅽ뙣 ??罹먯떆 臾댄슚??
                await cache.del(cacheKey)
            }

            return {
                success: result.success,
                remainingCount: result.remaining_count,
                usageCount: result.new_count,
                message: result.success ? 'Usage rolled back successfully' : 'No usage to rollback',
            }
        } catch (error) {
            console.error('Error in rollbackUsage:', error)
            return {
                success: false,
                error: {
                    code: UsageLimitErrorCode.INTERNAL_ERROR,
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
                usageCount: 0,
                remainingCount: 0,
            }
        }
    }

    /**
     * ?뱀젙 IP???ъ슜 湲곕줉 珥덇린??
     */
    async resetUsage(ipAddress: string): Promise<{ success: boolean; error?: UsageLimitError }> {
        try {
            const { error } = await supabase
                .from('ip_usage_limits')
                .delete()
                .eq('ip_address', ipAddress)

            if (error) {
                console.error('Database error in resetUsage:', error)
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: error.message,
                    },
                }
            }

            // 罹먯떆?먯꽌????젣
            const cacheKey = CacheKeys.IP_USAGE(ipAddress)
            await cache.del(cacheKey)

            return { success: true }
        } catch (error) {
            console.error('Error in resetUsage:', error)
            return {
                success: false,
                error: {
                    code: UsageLimitErrorCode.INTERNAL_ERROR,
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
            }
        }
    }

    /**
     * 留뚮즺???덉퐫???뺣━
     */
    async cleanupExpiredRecords(): Promise<{ success: boolean; deletedCount?: number; error?: UsageLimitError }> {
        try {
            const { data, error } = await supabase.rpc('cleanup_old_ip_usage_records')

            if (error) {
                console.error('Database error in cleanupExpiredRecords:', error)
                return {
                    success: false,
                    error: {
                        code: UsageLimitErrorCode.DATABASE_ERROR,
                        message: error.message,
                    },
                }
            }

            return {
                success: true,
                deletedCount: data as number,
            }
        } catch (error) {
            console.error('Error in cleanupExpiredRecords:', error)
            return {
                success: false,
                error: {
                    code: UsageLimitErrorCode.INTERNAL_ERROR,
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
            }
        }
    }

    /**
     * ?곸꽭 ?ъ슜 湲곕줉 議고쉶
     */
    async getUsageRecord(ipAddress: string): Promise<IPUsageRecord | null> {
        try {
            // 1. 罹먯떆?먯꽌 癒쇱? ?뺤씤
            const cacheKey = CacheKeys.IP_USAGE(ipAddress)
            const cachedRecord = await cache.get<IPUsageRecord>(cacheKey)
            if (cachedRecord) {
                return cachedRecord
            }

            // 2. ?곗씠?곕쿋?댁뒪?먯꽌 議고쉶
            const { data, error } = await supabase
                .from('ip_usage_limits')
                .select('*')
                .eq('ip_address', ipAddress)
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Database error in getUsageRecord:', error)
                return null
            }

            // 3. 罹먯떆?????
            if (data) {
                const cacheKey = CacheKeys.IP_USAGE(ipAddress)
                await cache.set(cacheKey, data, CacheTTL.IP_USAGE)
            }

            return data || null
        } catch (error) {
            console.error('Error in getUsageRecord:', error)
            return null
        }
    }

    /**
     * ?ъ슜 ?듦퀎 議고쉶
     */
    async getUsageStatistics(): Promise<UsageStatistics | null> {
        try {
            // 罹먯떆?먯꽌 癒쇱? ?뺤씤
            const cacheKey = CacheKeys.USAGE_STATS
            const cachedStats = await cache.get<UsageStatistics>(cacheKey)
            if (cachedStats) {
                return cachedStats
            }

            // ?곗씠?곕쿋?댁뒪?먯꽌 ?듦퀎 怨꾩궛
            const { data, error } = await supabase
                .from('ip_usage_limits')
                .select('usage_count, created_at')

            if (error) {
                console.error('Database error in getUsageStatistics:', error)
                return null
            }

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            const stats: UsageStatistics = {
                totalUsers: data.length,
                todayUsers: data.filter(record => new Date(record.created_at) >= today).length,
                limitReachedUsers: data.filter(record => record.usage_count >= this.config.maxUsage).length,
                averageUsage: data.length > 0 ? data.reduce((sum, record) => sum + record.usage_count, 0) / data.length : 0,
                maxUsageReached: data.length > 0 ? Math.max(...data.map(record => record.usage_count)) : 0,
            }

            // 罹먯떆?????
            await cache.set(cacheKey, stats, CacheTTL.USAGE_STATS)

            return stats
        } catch (error) {
            console.error('Error in getUsageStatistics:', error)
            return null
        }
    }

    /**
     * ?쒕퉬???곹깭 ?뺤씤
     */
    async healthCheck(): Promise<{
        database: { isHealthy: boolean; latency?: number; error?: string }
        cache: { isHealthy: boolean; enabled: boolean; latency?: number; error?: string }
        overall: boolean
    }> {
        // ?곗씠?곕쿋?댁뒪 ?ъ뒪 泥댄겕
        const dbStart = Date.now()
        let dbHealth = { isHealthy: false, latency: 0, error: '' }

        try {
            const { error } = await supabase.from('ip_usage_limits').select('count').limit(1)
            dbHealth = {
                isHealthy: !error,
                latency: Date.now() - dbStart,
                error: error?.message,
            }
        } catch (error) {
            dbHealth = {
                isHealthy: false,
                latency: Date.now() - dbStart,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }

        // 罹먯떆 ?ъ뒪 泥댄겕
        const cacheHealth = await cacheUtils.getStats()

        return {
            database: dbHealth,
            cache: {
                isHealthy: cacheHealth.healthy,
                enabled: cacheHealth.enabled,
            },
            overall: dbHealth.isHealthy && (cacheHealth.healthy || !cacheHealth.enabled),
        }
    }

    /**
     * ?먮윭 ?묐떟 ?앹꽦 ?ы띁
     */
    private createErrorResponse(
        code: UsageLimitErrorCode,
        message: string,
        details?: Record<string, unknown>
    ): UsageLimitCheckResponse {
        return {
            canUse: false,
            remainingCount: 0,
            usageCount: 0,
            resetTime: new Date(Date.now() + this.config.resetPeriodHours * 60 * 60 * 1000),
            error: { code, message, details },
            isFromCache: false,
        }
    }
}

// 湲곕낯 ?쒕퉬???몄뒪?댁뒪
export const usageLimitService = new UsageLimitService()

// ?몄쓽 ?⑥닔??
export const checkUsageLimit = (ipAddress: string) => usageLimitService.checkUsageLimit(ipAddress)
export const incrementUsage = (ipAddress: string) => usageLimitService.incrementUsage(ipAddress)
export const rollbackUsage = (ipAddress: string) => usageLimitService.rollbackUsage(ipAddress)
export const resetUsage = (ipAddress: string) => usageLimitService.resetUsage(ipAddress)
export const cleanupExpiredRecords = () => usageLimitService.cleanupExpiredRecords()
export const getUsageRecord = (ipAddress: string) => usageLimitService.getUsageRecord(ipAddress)
export const getUsageStatistics = () => usageLimitService.getUsageStatistics()
export const usageLimitHealthCheck = () => usageLimitService.healthCheck()

export default usageLimitService 
