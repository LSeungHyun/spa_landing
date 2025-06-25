// 프롬프트 캐싱 시스템 - API 호출 최소화
interface CacheEntry {
    improvedPrompt: string;
    timestamp: number;
    originalHash: string;
}

class PromptCache {
    private cache = new Map<string, CacheEntry>();
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간
    private readonly MAX_CACHE_SIZE = 100;

    // 간단한 해시 함수
    private hashPrompt(prompt: string): string {
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            const char = prompt.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        return Math.abs(hash).toString(36);
    }

    // 정규화된 프롬프트 키 생성
    private normalizePrompt(prompt: string): string {
        return prompt.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    // 캐시에서 조회
    getCachedPrompt(originalPrompt: string): string | null {
        const normalized = this.normalizePrompt(originalPrompt);
        const hash = this.hashPrompt(normalized);
        const entry = this.cache.get(hash);

        if (!entry) {
            return null;
        }

        // 캐시 만료 확인
        if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
            this.cache.delete(hash);
            return null;
        }

        console.log('Cache hit for prompt hash:', hash);
        return entry.improvedPrompt;
    }

    // 캐시에 저장
    setCachedPrompt(originalPrompt: string, improvedPrompt: string): void {
        const normalized = this.normalizePrompt(originalPrompt);
        const hash = this.hashPrompt(normalized);

        // 캐시 크기 제한
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(hash, {
            improvedPrompt,
            timestamp: Date.now(),
            originalHash: hash
        });

        console.log('Cached prompt with hash:', hash);
    }

    // 캐시 통계
    getStats(): { size: number; maxSize: number } {
        return {
            size: this.cache.size,
            maxSize: this.MAX_CACHE_SIZE
        };
    }

    // 캐시 정리
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }
}

export const promptCache = new PromptCache();

// 주기적 캐시 정리 (5분마다)
setInterval(() => {
    promptCache.cleanup();
}, 5 * 60 * 1000); 