'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { database, utils } from '@/lib/supabase';
import type { PreRegistration } from '@/lib/supabase';

interface PreRegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPersona?: 'pm' | 'creator' | 'startup';
}

interface FormData {
    email: string;
    persona: 'pm' | 'creator' | 'startup';
    consent: boolean;
}

const personaLabels = {
    pm: 'PM/기획자',
    creator: '크리에이터',
    startup: '스타트업 창업자'
};

export function PreRegistrationForm({ isOpen, onClose, selectedPersona = 'pm' }: PreRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            persona: selectedPersona,
            consent: false
        }
    });

    // selectedPersona가 변경될 때 form 값 업데이트
    React.useEffect(() => {
        setValue('persona', selectedPersona);
    }, [selectedPersona, setValue]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            // 이메일 중복 확인
            const { exists, error: checkError } = await database.checkEmailExists(data.email);
            if (checkError) {
                throw new Error('이메일 확인 중 오류가 발생했습니다.');
            }

            if (exists) {
                throw new Error('이미 등록된 이메일입니다.');
            }

            // 사전 등록 데이터 저장
            const preRegistrationData: Omit<PreRegistration, 'id' | 'created_at' | 'updated_at'> = {
                email: data.email,
                persona: data.persona
            };

            const { data: result, error } = await database.addPreRegistration(preRegistrationData);

            if (error) {
                throw new Error('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }

            setSubmitStatus('success');

            // 성공 후 3초 뒤 모달 닫기
            setTimeout(() => {
                onClose();
                reset();
                setSubmitStatus('idle');
            }, 3000);

        } catch (error) {
            console.error('Pre-registration error:', error);
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            reset();
            setSubmitStatus('idle');
            setErrorMessage('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 헤더 */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    사전 등록
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    출시 소식을 가장 먼저 받아보세요
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 성공 상태 */}
                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-8"
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    등록 완료!
                                </h3>
                                <p className="text-gray-600">
                                    Smart Prompt Assistant 출시 소식을<br />
                                    이메일로 알려드리겠습니다.
                                </p>
                            </motion.div>
                        )}

                        {/* 폼 */}
                        {submitStatus !== 'success' && (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* 이메일 입력 */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        이메일 주소
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            {...register('email', {
                                                required: '이메일을 입력해주세요',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: '올바른 이메일 형식을 입력해주세요'
                                                }
                                            })}
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="your@email.com"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* 페르소나 선택 */}
                                <div>
                                    <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-2">
                                        직무/역할
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            {...register('persona', { required: '역할을 선택해주세요' })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                                            disabled={isSubmitting}
                                        >
                                            {Object.entries(personaLabels).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.persona && (
                                        <p className="mt-1 text-sm text-red-600">{errors.persona.message}</p>
                                    )}
                                </div>

                                {/* 동의 체크박스 */}
                                <div className="flex items-start space-x-3">
                                    <input
                                        {...register('consent', { required: '개인정보 처리방침에 동의해주세요' })}
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={isSubmitting}
                                    />
                                    <label className="text-sm text-gray-600">
                                        개인정보 처리방침에 동의하며, 제품 출시 및 업데이트 소식을 이메일로 받는 것에 동의합니다.
                                    </label>
                                </div>
                                {errors.consent && (
                                    <p className="text-sm text-red-600">{errors.consent.message}</p>
                                )}

                                {/* 에러 메시지 */}
                                {submitStatus === 'error' && errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className="text-sm text-red-700">{errorMessage}</p>
                                    </motion.div>
                                )}

                                {/* 제출 버튼 */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>등록 중...</span>
                                        </>
                                    ) : (
                                        <span>사전 등록하기</span>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    언제든지 구독을 취소할 수 있습니다.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 