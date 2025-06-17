"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { Fragment } from "react";
import Image from "next/image";

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
}

interface HowItWorksSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  badge?: string;
  steps?: Step[];
}

export function HowItWorksSection({
  title = "시작하는 방법",
  description = "몇 가지 간단한 단계로 프로젝트를 시작하세요",
  badge = "사용 방법",
  steps = [
    {
      number: "01",
      title: "템플릿 선택",
      description: "프로젝트에 적합한 템플릿을 선택하세요",
      image: "https://picsum.photos/seed/template/200/150",
    },
    {
      number: "02",
      title: "커스터마이징",
      description: "필요한 기능을 추가하고 디자인을 수정하세요",
      image: "https://picsum.photos/seed/customize/200/150",
    },
    {
      number: "03",
      title: "배포하기",
      description: "완성된 프로젝트를 손쉽게 배포하세요",
      image: "https://picsum.photos/seed/deploy/200/150",
    },
  ],
}: HowItWorksSectionProps) {
  return (
    <Section>
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            {badge}
          </Badge>
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <motion.div
                className="relative flex-1 w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 text-center h-full flex flex-col items-center justify-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">
                      {step.number}
                    </span>
                  </div>
                  <div className="relative w-full h-[150px] mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </Container>
    </Section>
  );
}
