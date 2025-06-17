"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    name: "Google",
    logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg",
  },
  {
    name: "Microsoft",
    logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg",
  },
  {
    name: "Amazon",
    logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg",
  },
  {
    name: "Meta",
    logo: "https://www.vectorlogo.zone/logos/meta/meta-ar21.svg",
  },
  {
    name: "Intel",
    logo: "https://www.vectorlogo.zone/logos/intel/intel-ar21.svg",
  },
  {
    name: "IBM",
    logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg",
  },
  {
    name: "Oracle",
    logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg",
  },
  {
    name: "Salesforce",
    logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg",
  },
  {
    name: "Adobe",
    logo: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg",
  },
  {
    name: "Docker",
    logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
  },
  {
    name: "Kubernetes",
    logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
  },
  {
    name: "Redis",
    logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
  },
  {
    name: "MongoDB",
    logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
  },
  {
    name: "PostgreSQL",
    logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
  },
  {
    name: "Python",
    logo: "https://www.vectorlogo.zone/logos/python/python-ar21.svg",
  },
  {
    name: "NodeJS",
    logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
  },
  {
    name: "React",
    logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
  },
  {
    name: "Angular",
    logo: "https://www.vectorlogo.zone/logos/angular/angular-ar21.svg",
  },
  {
    name: "Vue",
    logo: "https://www.vectorlogo.zone/logos/vuejs/vuejs-ar21.svg",
  },
  {
    name: "Firebase",
    logo: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
  },
  {
    name: "GitHub",
    logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
  },
  {
    name: "GitLab",
    logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg",
  },
  {
    name: "Jenkins",
    logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
  },
  {
    name: "Elastic",
    logo: "https://www.vectorlogo.zone/logos/elastic/elastic-ar21.svg",
  },
];

// 두 배의 파트너 배열을 만들어 연속적인 스크롤 효과를 생성
const doubledPartners = [...partners, ...partners];

export function PartnersSection() {
  return (
    <Section>
      <Container>
        <div className="relative py-8 overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {doubledPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-[120px] h-[60px] flex items-center justify-center"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="max-w-full max-h-full object-contain grayscale"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
