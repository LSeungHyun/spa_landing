import { ProcessStepCard } from "./process-step-card";
import { PromptComparison } from "./prompt-comparison";
import { ProcessStep } from "@/hooks/use-process-state";

interface ProcessDisplayProps {
    steps: ProcessStep[];
    isRunning: boolean;
    currentStepIndex: number;
    elapsedTime: number;
}

export function ProcessDisplay({
    steps,
    isRunning,
    currentStepIndex,
    elapsedTime
}: ProcessDisplayProps) {
    // Find the analysis step to get prompt comparison data
    const analysisStep = steps.find(step => step.id === 'analysis');
    const showComparison = analysisStep?.status === 'completed' && analysisStep.result;

    return (
        <div className="space-y-6">
            {/* Process Steps */}
            <div className="grid gap-4">
                {steps.map((step, index) => (
                    <ProcessStepCard
                        key={step.id}
                        step={step}
                        index={index}
                        isActive={index === currentStepIndex && isRunning}
                        isCompleted={step.status === 'completed'}
                        hasError={step.status === 'error'}
                        elapsedTime={elapsedTime}
                    />
                ))}
            </div>

            {/* Prompt Comparison - shows after analysis is complete */}
            {showComparison && analysisStep?.result && (
                <PromptComparison
                    originalPrompt={analysisStep.result.originalPrompt || "기존 프롬프트를 분석 중입니다..."}
                    improvedPrompt={analysisStep.result.improvedPrompt || "개선된 프롬프트를 생성 중입니다..."}
                    improvements={analysisStep.result.improvements || []}
                    isVisible={true}
                />
            )}
        </div>
    );
} 