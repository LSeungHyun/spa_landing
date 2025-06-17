'use client';

import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
    title?: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function useToast() {
    const toast = {
        // 성공 토스트
        success: (message: string, options?: ToastOptions) => {
            return sonnerToast.success(message, {
                description: options?.description,
                duration: options?.duration,
                action: options?.action,
            });
        },

        // 에러 토스트
        error: (message: string, options?: ToastOptions) => {
            return sonnerToast.error(message, {
                description: options?.description,
                duration: options?.duration,
                action: options?.action,
            });
        },

        // 경고 토스트
        warning: (message: string, options?: ToastOptions) => {
            return sonnerToast.warning(message, {
                description: options?.description,
                duration: options?.duration,
                action: options?.action,
            });
        },

        // 정보 토스트
        info: (message: string, options?: ToastOptions) => {
            return sonnerToast.info(message, {
                description: options?.description,
                duration: options?.duration,
                action: options?.action,
            });
        },

        // 기본 토스트
        default: (message: string, options?: ToastOptions) => {
            return sonnerToast(message, {
                description: options?.description,
                duration: options?.duration,
                action: options?.action,
            });
        },

        // 로딩 토스트
        loading: (message: string, options?: Omit<ToastOptions, 'duration'>) => {
            return sonnerToast.loading(message, {
                description: options?.description,
                action: options?.action,
            });
        },

        // 토스트 해제
        dismiss: (id?: string | number) => {
            sonnerToast.dismiss(id);
        },

        // 모든 토스트 해제
        dismissAll: () => {
            sonnerToast.dismiss();
        },

        // 프로미스 토스트 (비동기 작업용)
        promise: <T>(
            promise: Promise<T>,
            options: {
                loading: string;
                success: string | ((data: T) => string);
                error: string | ((error: any) => string);
                description?: string;
                duration?: number;
            }
        ) => {
            return sonnerToast.promise(promise, options);
        },
    };

    return { toast };
}

// 직접 import해서 사용할 수 있는 toast 객체
export const toast = {
    success: (message: string, options?: ToastOptions) => {
        return sonnerToast.success(message, {
            description: options?.description,
            duration: options?.duration,
            action: options?.action,
        });
    },

    error: (message: string, options?: ToastOptions) => {
        return sonnerToast.error(message, {
            description: options?.description,
            duration: options?.duration,
            action: options?.action,
        });
    },

    warning: (message: string, options?: ToastOptions) => {
        return sonnerToast.warning(message, {
            description: options?.description,
            duration: options?.duration,
            action: options?.action,
        });
    },

    info: (message: string, options?: ToastOptions) => {
        return sonnerToast.info(message, {
            description: options?.description,
            duration: options?.duration,
            action: options?.action,
        });
    },

    default: (message: string, options?: ToastOptions) => {
        return sonnerToast(message, {
            description: options?.description,
            duration: options?.duration,
            action: options?.action,
        });
    },

    loading: (message: string, options?: Omit<ToastOptions, 'duration'>) => {
        return sonnerToast.loading(message, {
            description: options?.description,
            action: options?.action,
        });
    },

    dismiss: (id?: string | number) => {
        sonnerToast.dismiss(id);
    },

    dismissAll: () => {
        sonnerToast.dismiss();
    },

    promise: <T>(
        promise: Promise<T>,
        options: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
            description?: string;
            duration?: number;
        }
    ) => {
        return sonnerToast.promise(promise, options);
    },
}; 