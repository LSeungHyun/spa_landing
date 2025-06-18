export interface PersonaType {
    id: 'pm' | 'creator' | 'startup';
    title: string;
    description: string;
    icon: string;
}

export interface DiffHighlight {
    type: 'added' | 'removed';
    text: string;
}

export interface ProcessingStep {
    label: string;
    duration: number; // ms
    description: string;
}

export interface StaticScenario {
    inputExample: string;
    original: string;
    enhanced: string;
    highlights: {
        type: 'structure' | 'add' | 'improve';
        content: string;
        explanation: string;
    }[];
}

export interface GeminiAIResult {
    userInput: string;
    personalizedResult: {
        enhanced: string;
        highlights: DiffHighlight[];
        explanation: string;
        confidence: number;
    };
}

export interface SPALandingState {
    selectedPersona: PersonaType;
    currentScenarioIndex: number;
    isEnhancing: boolean;
    enhancedOutput: string;
    isPreRegistrationOpen: boolean;
    userInput: string;
    isProcessing: boolean;
    result: GeminiAIResult | null;
    showEmailModal: boolean;
}

export interface FormData {
    email: string;
    name?: string;
    organization?: string;
    role?: string;
} 