export interface Persona {
    id: string;
    title: string;
    description: string;
    problem: string;
    solution: string;
    features: string[];
    scenario: {
        before: string;
        after: string;
    };
    stats: {
        timeReduction: string;
        qualityImprovement: string;
    };
}

export interface PersonaSelectorProps {
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
    className?: string;
} 