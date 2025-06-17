// Process-related types and interfaces

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
    duration?: number;
    progress?: number;
}

export interface ProcessState {
    steps: ProcessStep[];
    currentStepIndex: number;
    isRunning: boolean;
    isCompleted: boolean;
    hasError: boolean;
    overallProgress: number;
}

export interface ProcessActions {
    startProcess: () => void;
    pauseProcess: () => void;
    resetProcess: () => void;
    skipToStep: (stepIndex: number) => void;
    updateStepProgress: (stepId: string, progress: number) => void;
    completeStep: (stepId: string) => void;
    errorStep: (stepId: string, error?: string) => void;
}

export interface ProcessConfig {
    autoStart?: boolean;
    showProgress?: boolean;
    allowSkip?: boolean;
    allowReset?: boolean;
    stepDelay?: number;
}

export interface ProcessHookReturn extends ProcessState, ProcessActions {
    config: ProcessConfig;
} 