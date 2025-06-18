"use client";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { FAQSection } from "./faq-section";

export function FAQHeaderSection() {
  return (
    <Section className="bg-gray-50">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold mb-4">자주 묻는 질문</h2>
          <p className="text-muted-foreground">
            고객님들이 자주 문의하시는 내용들을 모았습니다. 더 자세한 문의사항은
            언제든 연락주세요.
          </p>
        </motion.div>
        <FAQSection />
      </Container>
    </Section>
  );
}
