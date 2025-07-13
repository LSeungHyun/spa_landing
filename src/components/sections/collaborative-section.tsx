"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollaborativeEditor } from '@/components/demo/collaborative-editor';
import { 
  Users, 
  Zap, 
  Shield, 
  Clock,
  MessageCircle,
  History,
  Share2,
  Crown,
  Edit3,
  CheckCircle2
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 협업 기능 데이터
const collaborativeFeatures = [
  {
    icon: Users,
    title: "최대 5명 동시 편집",
    description: "팀원들과 실시간으로 프롬프트를 함께 편집하고 개선하세요",
    color: "text-blue-500"
  },
  {
    icon: Zap,
    title: "500ms 이하 동기화",
    description: "초고속 실시간 동기화로 끊김 없는 협업 경험을 제공합니다",
    color: "text-yellow-500"
  },
  {
    icon: MessageCircle,
    title: "인라인 댓글 시스템",
    description: "특정 부분에 댓글을 달아 팀원들과 효율적으로 소통하세요",
    color: "text-green-500"
  },
  {
    icon: History,
    title: "버전 히스토리",
    description: "모든 변경사항을 추적하고 언제든 이전 버전으로 복원할 수 있습니다",
    color: "text-purple-500"
  },
  {
    icon: Shield,
    title: "권한 관리",
    description: "소유자, 편집자, 뷰어 권한으로 안전한 협업 환경을 제공합니다",
    color: "text-red-500"
  },
  {
    icon: Share2,
    title: "간편한 공유",
    description: "링크 하나로 팀원들을 초대하고 즉시 협업을 시작하세요",
    color: "text-cyan-500"
  }
];

// 사용 사례 데이터
const useCases = [
  {
    title: "팀 브레인스토밍",
    description: "여러 팀원이 동시에 아이디어를 입력하고 실시간으로 프롬프트를 발전시켜나가세요",
    scenario: "마케팅 캠페인 아이디어를 팀원들과 함께 브레인스토밍하며 완성도 높은 프롬프트를 만들어보세요.",
    userRole: "editor" as const
  },
  {
    title: "코드 리뷰 스타일 검토",
    description: "개발팀이 기술 문서나 API 명세를 함께 검토하고 개선점을 제안할 수 있습니다",
    scenario: "새로운 API 문서 작성을 위한 프롬프트를 팀원들과 함께 검토하고 개선해보세요.",
    userRole: "owner" as const
  },
  {
    title: "클라이언트 협업",
    description: "클라이언트와 함께 요구사항을 정리하고 실시간으로 프롬프트를 조정할 수 있습니다",
    scenario: "클라이언트의 요구사항을 실시간으로 반영하여 정확한 프롬프트를 작성해보세요.",
    userRole: "viewer" as const
  }
];

interface CollaborativeSectionProps {
  title?: string;
  subtitle?: string;
}

export function CollaborativeSection({
  title = "실시간 협업 편집",
  subtitle = "팀원들과 함께 더 나은 프롬프트를 만들어보세요"
}: CollaborativeSectionProps) {
  const [activeTab, setActiveTab] = useState("features");
  const [selectedUseCase, setSelectedUseCase] = useState(0);

  return (
    <Section className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <Container>
        {/* 헤더 */}
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            협업 기능
          </Badge>
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="features">핵심 기능</TabsTrigger>
            <TabsTrigger value="demo">라이브 데모</TabsTrigger>
            <TabsTrigger value="usecases">사용 사례</TabsTrigger>
          </TabsList>

          {/* 핵심 기능 탭 */}
          <TabsContent value="features">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {collaborativeFeatures.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${feature.color}`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* 성능 지표 */}
            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {[
                { label: "동시 편집자", value: "5명", icon: Users },
                { label: "동기화 속도", value: "<500ms", icon: Zap },
                { label: "버전 보관", value: "무제한", icon: History },
                { label: "실시간 댓글", value: "즉시", icon: MessageCircle }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* 라이브 데모 탭 */}
          <TabsContent value="demo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    실시간 협업 편집기 체험
                  </CardTitle>
                  <p className="text-muted-foreground">
                    실제로 여러 사용자가 동시에 편집하는 모습을 확인해보세요. 
                    가상의 팀원들이 실시간으로 함께 작업하고 있습니다.
                  </p>
                </CardHeader>
                
                <CollaborativeEditor
                  sessionId="demo-session"
                  initialContent="새로운 AI 기반 제품의 마케팅 전략을 수립해주세요. 다음 요소들을 포함해주세요:

1. 타겟 고객층 분석
2. 경쟁사 대비 차별화 포인트
3. 마케팅 채널 전략
4. 예상 ROI 및 성과 지표

특히 Gen Z 세대를 주요 타겟으로 하는 소셜 미디어 중심의 전략을 원합니다."
                  userRole="editor"
                />
              </Card>
            </motion.div>
          </TabsContent>

          {/* 사용 사례 탭 */}
          <TabsContent value="usecases">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 사용 사례 목록 */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold mb-4">사용 사례</h3>
                <div className="space-y-3">
                  {useCases.map((useCase, index) => (
                    <Card 
                      key={index}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedUseCase === index 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedUseCase(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            selectedUseCase === index ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          <div>
                            <h4 className="font-medium text-sm">{useCase.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {useCase.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 선택된 사용 사례 데모 */}
              <div className="lg:col-span-2">
                <motion.div
                  key={selectedUseCase}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2">
                        {useCases[selectedUseCase].userRole === 'owner' && <Crown className="w-4 h-4 text-yellow-500" />}
                        {useCases[selectedUseCase].title}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {useCases[selectedUseCase].scenario}
                      </p>
                    </CardHeader>
                    
                    <CollaborativeEditor
                      sessionId={`usecase-${selectedUseCase}`}
                      initialContent={useCases[selectedUseCase].scenario}
                      userRole={useCases[selectedUseCase].userRole}
                      className="mt-4"
                    />
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA 섹션 */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-4">팀과 함께 더 나은 프롬프트를 만들어보세요</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                실시간 협업 편집 기능으로 팀의 창의성을 극대화하고, 
                더 정확하고 효과적인 프롬프트를 함께 만들어보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="min-w-[200px]">
                  <Users className="w-4 h-4 mr-2" />
                  팀 협업 시작하기
                </Button>
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <Share2 className="w-4 h-4 mr-2" />
                  협업 링크 생성
                </Button>
              </div>
              
              {/* 기능 체크리스트 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                {[
                  "무료로 5명까지 협업",
                  "실시간 동기화 보장",
                  "버전 히스토리 무제한"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
}

export default CollaborativeSection; 