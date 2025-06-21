'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, TrendingUp, Target, Zap } from 'lucide-react';
import { Persona } from '@/components/data/persona-types';

interface PersonaCardProps {
    persona: Persona;
    isSelected: boolean;
    onSelect: () => void;
}

export function PersonaCard({ persona, isSelected, onSelect }: PersonaCardProps) {
    const [activeTab, setActiveTab] = useState('problems');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card
                className={`p-6 h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected
                        ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'hover:shadow-md'
                    }`}
                onClick={onSelect}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {persona.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {persona.description}
                            </p>
                        </div>
                        {isSelected && (
                            <CheckCircle className="text-blue-500 w-6 h-6 flex-shrink-0" />
                        )}
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="problem" className="text-xs">문제점</TabsTrigger>
                            <TabsTrigger value="solution" className="text-xs">해결책</TabsTrigger>
                            <TabsTrigger value="features" className="text-xs">기능</TabsTrigger>
                        </TabsList>

                        <TabsContent value="problem" className="space-y-2 mt-4">
                            <div className="flex items-start space-x-2">
                                <Target className="text-red-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{persona.problem}</span>
                            </div>
                        </TabsContent>

                        <TabsContent value="solution" className="space-y-2 mt-4">
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{persona.solution}</span>
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-2 mt-4">
                            {persona.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <Zap className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                                <TrendingUp className="text-blue-500 w-4 h-4" />
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {persona.stats.timeReduction}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                시간 단축
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                                <Target className="text-green-500 w-4 h-4" />
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {persona.stats.qualityImprovement}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                품질 향상
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
} 