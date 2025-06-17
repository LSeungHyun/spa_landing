// Smart Prompt specific types and interfaces

export interface PromptScenario {
    id: string;
    title: string;
    description: string;
    category: 'academic' | 'business' | 'creative' | 'technical';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    example?: {
        input: string;
        output: string;
    };
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    expertise: string[];
    tone: 'formal' | 'casual' | 'technical' | 'creative';
    avatar?: string;
}

export interface PromptImprovement {
    original: string;
    improved: string;
    changes: Array<{
        type: 'addition' | 'modification' | 'removal';
        description: string;
        reasoning: string;
    }>;
    score: {
        clarity: number;
        specificity: number;
        effectiveness: number;
        overall: number;
    };
}

export interface PromptGenerationConfig {
    scenario?: PromptScenario;
    persona?: Persona;
    length?: 'short' | 'medium' | 'long';
    style?: 'structured' | 'conversational' | 'technical';
    includeExamples?: boolean;
    includeConstraints?: boolean;
}

export interface PromptGenerationResult {
    prompt: string;
    metadata: {
        generatedAt: Date;
        config: PromptGenerationConfig;
        tokens: number;
        estimatedTime: number;
    };
    improvements?: PromptImprovement;
} 