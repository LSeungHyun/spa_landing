"use client";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { motion } from "framer-motion";
import Image from "next/image";

interface TestimonialsSectionProps {
  testimonials: Array<{
    quote: string;
    author: {
      name: string;
      title: string;
      image: string;
    };
  }>;
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
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
            후기
          </Badge>
          <h2 className="text-3xl font-bold mb-4">사용자 후기</h2>
          <p className="text-muted-foreground">
            이미 많은 개발자들이 사용하고 있습니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 메인 후기 */}
          <motion.div
            className="md:col-span-2 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg relative z-10">
              <div className="text-4xl text-primary mb-6">&quot;</div>
              <p className="text-xl mb-6 text-gray-700 leading-relaxed">
                {testimonials[0].quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src={testimonials[0].author.image}
                    alt={testimonials[0].author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {testimonials[0].author.name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[0].author.title}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3 z-0" />
          </motion.div>

          {/* 서브 후기들 */}
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.slice(1).map((testimonial) => (
              <motion.div key={testimonial.author.name} variants={fadeInUp}>
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  rating={5}
                  className="bg-white"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
