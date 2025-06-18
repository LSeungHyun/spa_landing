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
        const scenario = demoScenarios.find(s => s.id === selectedPersona);
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

    const personas = demoScenarios.map(scenario => ({
        id: scenario.id,
        name: scenario.persona.name,
        role: scenario.persona.role,
        icon: scenario.persona.icon,
        color: scenario.persona.color
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
                                <span className="text-lg">{persona.icon}</span>
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
                                        {currentScenario.persona.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-gray-900 mb-1">
                                            {currentScenario.persona.name}
                                        </h4>
                                        <p className="text-gray-600 mb-3">{currentScenario.persona.role}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {currentScenario.persona.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">시나리오</h5>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {currentScenario.scenario.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">입력 예시</h5>
                                        <div className="bg-gray-50 rounded-lg p-4 border">
                                            <p className="text-sm text-gray-800 font-mono">
                                                {currentScenario.scenario.input}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isGenerating}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    생성 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    AI로 생성하기
                                                </>
                                            )}
                                        </Button>

                                        {currentScenario.scenario.metrics && (
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {currentScenario.scenario.metrics.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Target className="w-4 h-4" />
                                                    {currentScenario.scenario.metrics.accuracy}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4" />
                                                    {currentScenario.scenario.metrics.efficiency}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        <AnimatePresence>
                            {showResult && currentScenario.scenario.output && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="border-green-200 bg-green-50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles className="w-5 h-5 text-green-600" />
                                                <h5 className="font-semibold text-green-900">생성 결과</h5>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="prose prose-sm max-w-none">
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: currentScenario.scenario.output.replace(/\n/g, '<br/>')
                                                    }} />
                                                </div>
                                            </div>

                                            {currentScenario.scenario.benefits && (
                                                <div className="mt-4 pt-4 border-t border-green-200">
                                                    <h6 className="font-medium text-green-900 mb-2">주요 개선사항</h6>
                                                    <ul className="space-y-1">
                                                        {currentScenario.scenario.benefits.map((benefit, index) => (
                                                            <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                                                                <ChevronRight className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                                                                {benefit}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 