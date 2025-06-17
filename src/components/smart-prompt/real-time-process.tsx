'use client';

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useProcessState } from "@/hooks/use-process-state";
import { ProcessControlPanel } from "./process-control-panel";
import { ProcessDisplay } from "./process-display";

export function RealTimeProcess() {
    const {
        steps,
        isRunning,
        isPaused,
        currentStepIndex,
        elapsedTime,
        startProcess,
        pauseProcess,
        resetProcess,
        selectedSample,
        setSelectedSample
    } = useProcessState();

    return (
        <Section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        실시간 프롬프트 개선 과정
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        AI가 어떻게 프롬프트를 분석하고 개선하는지 실시간으로 확인해보세요
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Control Panel */}
                    <ProcessControlPanel
                        selectedSample={selectedSample}
                        onSampleChange={setSelectedSample}
                        isRunning={isRunning}
                        isPaused={isPaused}
                        onStart={startProcess}
                        onPause={pauseProcess}
                        onReset={resetProcess}
                        currentStepIndex={currentStepIndex}
                        totalSteps={steps.length}
                        elapsedTime={elapsedTime}
                    />

                    {/* Process Display */}
                    <ProcessDisplay
                        steps={steps}
                        isRunning={isRunning}
                        currentStepIndex={currentStepIndex}
                        elapsedTime={elapsedTime}
                    />
                </div>
            </Container>
        </Section>
    );
} 