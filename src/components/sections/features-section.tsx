"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeatureCard } from "@/components/shared/feature-card";
import { defaultFeatures } from '../data/features-data';

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

const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
}

function FeaturesSection({
  title = "핵심 기능",
  subtitle = "AI 기반 스마트 프롬프트 생성 도구의 주요 기능들을 확인해보세요"
}: FeaturesSectionProps) {
  return (
    <Section>
      <Container>
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <Badge variant="secondary" className="mb-4">
            특징
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[200px]"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {defaultFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInLeft}
              className={cn(
                "row-span-1",
                (index === 0 || index === 4) && "md:row-span-2",
                feature.size === "large" && "md:col-span-1",
                feature.size === "small" && "md:col-span-1"
              )}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                image={feature.image}
                imagePosition={index === 0 ? "top" : "right"}
                className={cn("h-full", index === 0 && "first-card")}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export { FeaturesSection };
export default FeaturesSection;
