import { Redis } from '@upstash/redis'

// 환경변수 타입 정의
interface RedisConfig {
    url: string
    token: string
    enableCache: boolean
    defaultTTL: number
    maxRetries: number
    retryDelay: number
}

// Redis 설정 로드
const getRedisConfig = (): RedisConfig => {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
        console.warn('Redis credentials not found. Cache will be disabled.')
        return {
            url: '',
            token: '',
            enableCache: false,
            defaultTTL: 3600, // 1시간
            maxRetries: 3,
            retryDelay: 1000, // 1초
        }
    }

    return {
        url,
        token,
        enableCache: true,
        defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '3600', 10),
        maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),
    }
}

// Redis 클라이언트 인스턴스
let redisClient: Redis | null = null
const config = getRedisConfig()

if (config.enableCache) {
    redisClient = new Redis({
        url: config.url,
        token: config.token,
        retry: {
            retries: config.maxRetries,
            backoff: (retryCount) => Math.min(config.retryDelay * Math.pow(2, retryCount), 10000),
        },
    })
}

// 캐시 키 네이밍 컨벤션
export const CacheKeys = {
    // IP 사용 제한 관련
    IP_USAGE: (ip: string) => `usage_limit:ip:${ip}`,
    IP_USAGE_COUNT: (ip: string) => `usage_count:ip:${ip}`,
    IP_USAGE_LAST_USED: (ip: string) => `usage_last_used:ip:${ip}`,

    // 통계 관련
    USAGE_STATS: 'usage_stats:global',
    DAILY_USAGE: (date: string) => `usage_stats:daily:${date}`,

    // 설정 관련
    USAGE_LIMIT_CONFIG: 'config:usage_limit',

    // 임시 잠금 (동시성 제어)
    IP_LOCK: (ip: string) => `lock:ip:${ip}`,
} as const

// TTL 정책 정의
export const CacheTTL = {
    IP_USAGE: config.defaultTTL, // 1시간
    IP_USAGE_COUNT: config.defaultTTL,
    IP_USAGE_LAST_USED: config.defaultTTL,
    USAGE_STATS: 300, // 5분
    DAILY_USAGE: 86400, // 24시간
    USAGE_LIMIT_CONFIG: 86400, // 24시간
    IP_LOCK: 30, // 30초 (짧은 잠금)
} as const

// 캐시 작업 인터페이스
export interface CacheOperations {
    get<T>(key: string): Promise<T | null>
    set<T>(key: string, value: T, ttl?: number): Promise<void>
    del(key: string): Promise<void>
    incr(key: string): Promise<number>
    expire(key: string, ttl: number): Promise<void>
    exists(key: string): Promise<boolean>
    mget<T>(keys: string[]): Promise<(T | null)[]>
    mset<T>(keyValues: Record<string, T>, ttl?: number): Promise<void>
    setex<T>(key: string, ttl: number, value: T): Promise<void>
    getset<T>(key: string, value: T): Promise<T | null>
}

// Redis 캐시 구현
class RedisCache implements CacheOperations {
    private client: Redis

    constructor(client: Redis) {
        this.client = client
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const result = await this.client.get(key)
            return result as T | null
        } catch (error) {
            console.error(`Redis GET error for key ${key}:`, error)
            return null
        }
    }

    async set<T>(key: string, value: T, ttl: number = config.defaultTTL): Promise<void> {
        try {
            await this.client.setex(key, ttl, JSON.stringify(value))
        } catch (error) {
            console.error(`Redis SET error for key ${key}:`, error)
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key)
        } catch (error) {
            console.error(`Redis DEL error for key ${key}:`, error)
        }
    }

    async incr(key: string): Promise<number> {
        try {
            return await this.client.incr(key)
        } catch (error) {
            console.error(`Redis INCR error for key ${key}:`, error)
            return 0
        }
    }

    async expire(key: string, ttl: number): Promise<void> {
        try {
            await this.client.expire(key, ttl)
        } catch (error) {
            console.error(`Redis EXPIRE error for key ${key}:`, error)
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key)
            return result === 1
        } catch (error) {
            console.error(`Redis EXISTS error for key ${key}:`, error)
            return false
        }
    }

    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        try {
            const results = await this.client.mget(...keys)
            return results.map(result => result ? JSON.parse(result as string) as T : null)
        } catch (error) {
            console.error(`Redis MGET error for keys ${keys.join(', ')}:`, error)
            return keys.map(() => null)
        }
    }

    async mset<T>(keyValues: Record<string, T>, ttl: number = config.defaultTTL): Promise<void> {
        try {
            const pipeline = this.client.pipeline()

            Object.entries(keyValues).forEach(([key, value]) => {
                pipeline.setex(key, ttl, JSON.stringify(value))
            })

            await pipeline.exec()
        } catch (error) {
            console.error(`Redis MSET error:`, error)
        }
    }

    async setex<T>(key: string, ttl: number, value: T): Promise<void> {
        try {
            await this.client.setex(key, ttl, JSON.stringify(value))
        } catch (error) {
            console.error(`Redis SETEX error for key ${key}:`, error)
        }
    }

    async getset<T>(key: string, value: T): Promise<T | null> {
        try {
            const result = await this.client.getset(key, JSON.stringify(value))
            return result ? JSON.parse(result as string) as T : null
        } catch (error) {
            console.error(`Redis GETSET error for key ${key}:`, error)
            return null
        }
    }
}

// 더미 캐시 구현 (Redis 비활성화 시)
class DummyCache implements CacheOperations {
    async get<T>(_key: string): Promise<T | null> {
        return null
    }

    async set<T>(_key: string, _value: T, _ttl?: number): Promise<void> {
        // No-op
    }

    async del(_key: string): Promise<void> {
        // No-op
    }

    async incr(_key: string): Promise<number> {
        return 0
    }

    async expire(_key: string, _ttl: number): Promise<void> {
        // No-op
    }

    async exists(_key: string): Promise<boolean> {
        return false
    }

    async mget<T>(_keys: string[]): Promise<(T | null)[]> {
        return _keys.map(() => null)
    }

    async mset<T>(_keyValues: Record<string, T>, _ttl?: number): Promise<void> {
        // No-op
    }

    async setex<T>(_key: string, _ttl: number, _value: T): Promise<void> {
        // No-op
    }

    async getset<T>(_key: string, _value: T): Promise<T | null> {
        return null
    }
}

// 캐시 인스턴스 생성
export const cache: CacheOperations = config.enableCache && redisClient
    ? new RedisCache(redisClient)
    : new DummyCache()

// 캐시 헬스 체크
export const cacheHealthCheck = async (): Promise<{
    isHealthy: boolean
    enabled: boolean
    latency?: number
    error?: string
}> => {
    if (!config.enableCache || !redisClient) {
        return {
            isHealthy: true,
            enabled: false,
        }
    }

    try {
        const start = Date.now()
        await cache.set('health_check', 'ok', 10)
        const result = await cache.get('health_check')
        await cache.del('health_check')
        const latency = Date.now() - start

        return {
            isHealthy: result === 'ok',
            enabled: true,
            latency,
        }
    } catch (error) {
        return {
            isHealthy: false,
            enabled: true,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// 캐시 유틸리티 함수들
export const cacheUtils = {
    // IP 기반 캐시 키 생성
    getIPCacheKey: (ip: string, suffix?: string): string => {
        const normalizedIP = ip.replace(/[:.]/g, '_')
        return suffix ? `${CacheKeys.IP_USAGE(normalizedIP)}_${suffix}` : CacheKeys.IP_USAGE(normalizedIP)
    },

    // 캐시 키 배치 삭제
    deleteBatch: async (pattern: string): Promise<void> => {
        if (!config.enableCache || !redisClient) return

        try {
            // Upstash Redis는 SCAN을 지원하지 않으므로 패턴 기반 삭제는 제한적
            console.warn(`Batch delete for pattern ${pattern} not supported in Upstash Redis`)
        } catch (error) {
            console.error(`Cache batch delete error:`, error)
        }
    },

    // 캐시 통계
    getStats: async (): Promise<{
        enabled: boolean
        healthy: boolean
        config: Partial<RedisConfig>
    }> => {
        const health = await cacheHealthCheck()

        return {
            enabled: config.enableCache,
            healthy: health.isHealthy,
            config: {
                defaultTTL: config.defaultTTL,
                maxRetries: config.maxRetries,
                retryDelay: config.retryDelay,
            },
        }
    },
}

// 설정 내보내기
export const redisConfig = config
export default cache 