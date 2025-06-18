"use client";

import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "서비스 가격은 어떻게 되나요?",
    answer:
      "기업의 규모와 필요한 기능에 따라 맞춤형 견적을 제공해드립니다. 자세한 내용은 문의하기를 통해 상담받으실 수 있습니다.",
  },
  {
    question: "도입 기간은 얼마나 걸리나요?",
    answer:
      "일반적으로 2-4주 정도 소요되며, 기업의 요구사항과 시스템 복잡도에 따라 달라질 수 있습니다.",
  },
  {
    question: "기술 지원은 어떻게 이루어지나요?",
    answer:
      "24/7 기술 지원팀이 대기하고 있으며, 이메일과 전화를 통해 신속한 지원을 제공해드립니다.",
  },
];

export function FAQSection() {
  return (
    <div className="w-full max-w-[800px] mx-auto mt-12 space-y-8">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-start">
            <div className="bg-primary-foreground text-primary rounded-2xl px-4 py-3 max-w-[80%] shadow-md">
              <p className="font-medium">{faq.question}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-3 max-w-[80%] shadow-md">
              <p>{faq.answer}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
