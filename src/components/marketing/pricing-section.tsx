"use client";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { PricingCard } from "./pricing-card";

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

const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

interface PricingSectionProps {
  plans: Array<{
    name: string;
    description: string;
    price: string;
    features: Array<{
      text: string;
      included: boolean;
    }>;
    popular?: boolean;
  }>;
}

export function PricingSection({ plans }: PricingSectionProps) {
  return (
    <Section>
      <Container>
        <motion.div
          className="text-center mb-12"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            요금제
          </Badge>
          <h2 className="text-3xl font-bold mb-4">합리적인 가격</h2>
          <p className="text-muted-foreground">
            프로젝트 규모에 맞는 요금제를 선택하세요
          </p>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={scaleUp}>
              <PricingCard
                name={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                popular={plan.popular}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
