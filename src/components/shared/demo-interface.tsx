'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Sparkles, Clock, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { demoScenarios, type PersonaScenario } from '@/components/data/demo-scenarios';

interface DemoInterfaceProps {
    className?: string;
}

export function DemoInterface({ className }: DemoInterfaceProps) {
    const [selectedPersona, setSelectedPersona] = useState<string>('pm-developer');
    const [currentScenario, setCurrentScenario] = useState<PersonaScenario | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const scenario = demoScenarios[selectedPersona];
        setCurrentScenario(scenario || null);
        setShowResult(false);
    }, [selectedPersona]);

    const handleGenerate = async () => {
        if (!currentScenario) return;

        setIsGenerating(true);
        setShowResult(false);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        setIsGenerating(false);
        setShowResult(true);
    };

    const personas = Object.entries(demoScenarios).map(([id, scenario]) => ({
        id,
        name: scenario.title,
        role: `${scenario.scenarios.length}개 시나리오`,
        icon: scenario.icon,
        color: scenario.color
    }));

    return (
        <div className={cn("w-full", className)}>
            {/* Persona Selector */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    페르소나를 선택하세요
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {personas.map((persona) => (
                        <button
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona.id)}
                            className={cn(
                                "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                                selectedPersona === persona.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">🔧</span>
                                <span className="text-sm font-medium text-gray-900 truncate">
                                    {persona.name}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{persona.role}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Demo Interface */}
            <AnimatePresence mode="wait">
                {currentScenario && (
                    <motion.div
                        key={selectedPersona}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
                                        🔧
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-gray-900 mb-1">
                                            {currentScenario.title}
                                        </h4>
                                        <p className="text-gray-600 mb-3">{currentScenario.scenarios.length}개의 시나리오</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {currentScenario.scenarios.map((scenario, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <h5 className="font-medium text-gray-900 mb-2">{scenario.name}</h5>
                                            
                                            <div className="mb-3">
                                                <h6 className="text-sm font-medium text-gray-700 mb-1">입력 예시</h6>
                                                <div className="bg-gray-50 rounded-lg p-3 border">
                                                    <p className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                                                        {scenario.input}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h6 className="text-sm font-medium text-gray-700 mb-1">개선된 결과</h6>
                                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                    <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                                                        <div dangerouslySetInnerHTML={{
                                                            __html: scenario.improved.replace(/\n/g, '<br/>')
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 