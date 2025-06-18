export interface Persona {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    painPoint: string;
    solution: string;
    icon: React.ComponentType<any>;
    badge?: {
        text: string;
        variant: 'default' | 'secondary' | 'outline' | 'destructive';
        color: string;
    };
    category: string;
    problems: string[];
    solutions: string[];
    features: string[];
    keyFeatures: string[];
    useCaseScenarios: string[];
    scenarios: {
        input: string;
        output: string;
        time: string;
    }[];
    gradient: string;
    shadowColor: string;
    stats: {
        timeReduction: string;
        accuracyImprovement: string;
        satisfaction: string;
        qualityImprovement: string;
    };
    statistics?: {
        label: string;
        value: string;
    }[];
}

export interface PersonaSelectorProps {
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
    className?: string;
} 