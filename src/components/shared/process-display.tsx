import ProcessStepCard from "./process-step-card";
import { PromptComparison } from "./prompt-comparison";
import { ProcessStep } from "@/hooks/use-process-state";

interface ProcessDisplayProps {
    steps: ProcessStep[];
    currentStep: number;
    isRunning: boolean;
}

export function ProcessDisplay({
    steps,
    currentStep,
    isRunning
}: ProcessDisplayProps) {
    // Find the analysis step to get prompt comparison data
    const analysisStep = steps.find(step => step.id === 'analysis');
    const showComparison = analysisStep?.status === 'completed';

    return (
        <div className="space-y-6">
            {/* Process Steps */}
            <div className="grid gap-4">
                {steps.map((step, index) => (
                    <ProcessStepCard
                        key={step.id}
                        step={step}
                        isActive={index === currentStep}
                        isPending={index > currentStep}
                    />
                ))}
            </div>

            {/* Prompt Comparison (shown after analysis is complete) */}
            {showComparison && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        프롬프트 개선 비교
                    </h3>
                    <PromptComparison
                        originalPrompt="원본 프롬프트 예시"
                        improvedPrompt="개선된 프롬프트 예시"
                        improvements={analysisStep.improvements}
                        isVisible={true}
                    />
                </div>
            )}
        </div>
    );
} 