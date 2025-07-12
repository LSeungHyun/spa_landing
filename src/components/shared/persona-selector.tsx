'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getPersonaData, type Persona } from '@/components/data/landing-data';
import { cn } from '@/lib/utils';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  personas: Persona[];
}

export function PersonaSelector({
  selectedPersona,
  onPersonaChange,
  personas
}: PersonaSelectorProps) {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          어떤 역할로 프롬프트를 개선하시겠어요?
        </h3>
        <p className="text-gray-600">
          역할에 맞는 특화된 프롬프트 개선을 제공합니다
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {personas.map((persona) => {
          const personaData = getPersonaData(persona);
          const isSelected = selectedPersona === persona;

          return (
            <motion.button
              key={persona}
              onClick={() => onPersonaChange(persona)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-4 rounded-lg border text-left transition-all duration-200",
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              )}
            >
              <div className="text-sm font-medium mb-1">
                {personaData.title}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">
                {personaData.subtitle}
              </div>
              {isSelected && (
                <Badge variant="default" className="mt-2 text-xs">
                  선택됨
                </Badge>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 