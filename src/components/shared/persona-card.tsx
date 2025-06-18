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

                    {/* Category Badge */}
                    <Badge variant="secondary" className="w-fit">
                        {persona.category}
                    </Badge>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="problems" className="text-xs">문제점</TabsTrigger>
                            <TabsTrigger value="solutions" className="text-xs">해결책</TabsTrigger>
                            <TabsTrigger value="features" className="text-xs">기능</TabsTrigger>
                            <TabsTrigger value="scenarios" className="text-xs">시나리오</TabsTrigger>
                        </TabsList>

                        <TabsContent value="problems" className="space-y-2 mt-4">
                            {persona.problems.map((problem, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <Target className="text-red-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{problem}</span>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="solutions" className="space-y-2 mt-4">
                            {persona.solutions.map((solution, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{solution}</span>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="features" className="space-y-2 mt-4">
                            {persona.keyFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <Zap className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="scenarios" className="space-y-3 mt-4">
                            {persona.useCaseScenarios.map((scenario, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                                        {scenario.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {scenario.description}
                                    </p>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>

                    {/* Statistics */}
                    {persona.statistics && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {persona.statistics.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <TrendingUp className="text-blue-500 w-4 h-4" />
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
} 