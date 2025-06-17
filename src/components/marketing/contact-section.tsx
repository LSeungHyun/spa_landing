"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ContactSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
}

export function ContactSection({
  title = "지금 바로 시작하세요",
  description = "프로젝트의 성공을 위한 첫 걸음, 지금 문의하세요.",
  className,
  ...props
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: 실제 폼 제출 로직 구현
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    alert("문의가 접수되었습니다. 곧 연락드리겠습니다.");
  };

  return (
    <Section className="bg-primary" {...props}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center text-primary-foreground"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mb-8 max-w-[600px] text-lg text-primary-foreground/90">
            {description}
          </p>

          <div className="w-full max-w-[600px] rounded-xl bg-background p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name" className="text-foreground text-left">
                    이름
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="홍길동"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label
                    htmlFor="company"
                    className="text-foreground text-left"
                  >
                    회사명
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    required
                    placeholder="주식회사 예시"
                    className="bg-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="email" className="text-foreground text-left">
                  이메일
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@company.com"
                  className="bg-white/5"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="message" className="text-foreground text-left">
                  문의 내용
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="도입 관련 문의사항을 자유롭게 작성해주세요."
                  className="min-h-[100px] bg-white/5"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리중..." : "문의하기"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
