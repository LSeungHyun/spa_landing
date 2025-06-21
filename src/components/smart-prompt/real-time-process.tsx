'use client';

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useProcessState } from "@/hooks/use-process-state";
import ProcessControlPanel from "./process-control-panel";
import { ProcessDisplay } from "./process-display";

export function RealTimeProcess() {
    const {
        steps,
        processState,
        startProcess,
        pauseProcess,
        resetProcess,
        formatTime,
        overallProgress
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
                        selectedSample=""
                        onSampleChange={() => {}}
                        isRunning={processState.isRunning}
                        onStartPause={() => {
                            if (processState.isRunning) {
                                pauseProcess();
                            } else {
                                startProcess();
                            }
                        }}
                        onReset={resetProcess}
                        totalProgress={overallProgress}
                        formatTime={formatTime}
                        currentStepElapsed={processState.elapsedTime}
                        currentStepTotal={30000} // 30초 가정
                    />

                    {/* Process Display */}
                    <ProcessDisplay
                        steps={steps}
                        isRunning={processState.isRunning}
                        currentStepIndex={processState.currentStep}
                        elapsedTime={processState.elapsedTime}
                    />
                </div>
            </Container>
        </Section>
    );
} 