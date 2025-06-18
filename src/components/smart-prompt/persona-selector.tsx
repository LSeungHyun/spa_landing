'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { PersonaCard } from '@/components/shared/persona-card';
import { personas, getPersonaById } from '@/components/data/persona-data';
import { Persona } from '@/components/data/persona-types';

interface PersonaSelectorProps {
    onPersonaSelect?: (persona: Persona) => void;
}

export function PersonaSelector({ onPersonaSelect }: PersonaSelectorProps) {
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

    const handlePersonaSelect = (persona: Persona) => {
        setSelectedPersona(persona);
        onPersonaSelect?.(persona);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
            <Container>
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        당신의 역할을 선택하세요
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        각 역할에 맞춤화된 스마트 프롬프트로 더 나은 결과를 얻으세요
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {personas.map((persona, index) => (
                        <motion.div
                            key={persona.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <PersonaCard
                                persona={persona}
                                isSelected={selectedPersona?.id === persona.id}
                                onSelect={() => handlePersonaSelect(persona)}
                            />
                        </motion.div>
                    ))}
                </div>

                {selectedPersona && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {selectedPersona.title} 선택됨
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {selectedPersona.description}
                            </p>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    // 스크롤 또는 다음 단계로 이동하는 로직
                                    const nextSection = document.querySelector('#demo-section');
                                    nextSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {selectedPersona.title}로 시작하기
                            </Button>
                        </div>
                    </motion.div>
                )}
            </Container>
        </section>
    );
} 