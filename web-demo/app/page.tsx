'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { variants, transitions } from '@/lib/styles/tokens';

// Lazy-load 3D component for performance
const VerificationSeal = lazy(() => import('@/components/3d/VerificationSeal').then(mod => ({ default: mod.VerificationSeal })));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="relative min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Subtle 3D background element */}
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <div className="absolute right-0 top-1/4 w-[600px] h-[600px] opacity-20">
              <VerificationSeal autoRotate={!prefersReducedMotion()} />
            </div>
          </Suspense>
        </div>

        <Container className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <Badge variant="info">Truthline</Badge>
              
              <h1 className="text-4xl font-semibold text-white md:text-6xl leading-tight">
                The body camera that proves what happened.
              </h1>
              
              <p className="max-w-xl text-base text-slate-400 leading-relaxed">
                Real-time detection of critical events with tamper-evident cryptographic verification. 
                Built for law enforcement agencies that demand institutional integrity.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="/request-pilot"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  Request a Pilot
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  See how it works
                </a>
              </div>
            </motion.div>

            {/* Trust card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/40"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Built for agencies
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-300">CJIS-Aligned Architecture</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-300">Self-Hosted / On-Premise Ready</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-300">Cryptographic Evidence Integrity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-300">Zero Data Leaves Your Perimeter</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-500">
                  Every event generates an immutable receipt with SHA-256 hash anchored on-chain 
                  for permanent audit trail.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Trust Bar */}
      <Section className="py-16 border-y border-slate-800/50 bg-slate-900/30">
        <Container>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-8"
          >
            Designed for compliance and trust
          </motion.p>
          <StaggerGrid columns={4}>
            <StaggerItem>
              <Card className="text-center py-6">
                <p className="text-sm font-semibold text-slate-300">CJIS-Aligned</p>
                <p className="text-xs text-slate-500 mt-1">Architecture</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="text-center py-6">
                <p className="text-sm font-semibold text-slate-300">Self-Hosted</p>
                <p className="text-xs text-slate-500 mt-1">Deployment Ready</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="text-center py-6">
                <p className="text-sm font-semibold text-slate-300">Open Core</p>
                <p className="text-xs text-slate-500 mt-1">Transparent Stack</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="text-center py-6">
                <p className="text-sm font-semibold text-slate-300">Audit Trail</p>
                <p className="text-xs text-slate-500 mt-1">Immutable Records</p>
              </Card>
            </StaggerItem>
          </StaggerGrid>
        </Container>
      </Section>

      {/* The Problem */}
      <Section id="how-it-works" className="py-32">
        <Container size="narrow">
          <SectionHeading
            eyebrow="The Challenge"
            title="Footage reviewed hours later is too late."
            subtitle="Traditional body camera workflows mean critical moments are only discovered long after incidents occur. Truthline changes this."
          />
          
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
              className="rounded-3xl border border-red-900/50 bg-red-950/10 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <p className="text-sm font-semibold uppercase tracking-wider text-red-400">Before</p>
              </div>
              <p className="text-lg text-slate-300 mb-4">
                Footage sits unreviewed for hours or days. Critical alerts go unnoticed until it's too late.
              </p>
              <p className="text-sm text-slate-500">
                Manual review processes, delayed response, compromised evidence integrity.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.reveal, delay: 0.2 }}
              className="rounded-3xl border border-emerald-900/50 bg-emerald-950/10 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">After</p>
              </div>
              <p className="text-lg text-slate-300 mb-4">
                Real-time detection flags critical moments as they happen. Verified instantly with cryptographic proof.
              </p>
              <p className="text-sm text-slate-500">
                Automated monitoring, immediate awareness, tamper-evident chain of custody.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Four Capabilities */}
      <Section className="py-32 bg-slate-900/30">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Four layers of intelligence."
            subtitle="From real-time detection to cryptographic verification — every capability designed to serve institutional integrity."
          />
          
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Real-Time Detection",
                description: "AI-powered analysis identifies critical audio and visual events as they occur.",
                icon: "🎯",
              },
              {
                title: "Tamper-Evident Hashing",
                description: "SHA-256 fingerprints generated for every detected event, impossible to alter retroactively.",
                icon: "🔐",
              },
              {
                title: "On-Chain Anchoring",
                description: "Receipts anchored to Solana blockchain for permanent, publicly-verifiable audit trail.",
                icon: "⛓️",
              },
              {
                title: "Public Verification",
                description: "Anyone can verify evidence integrity by matching file hashes against chain records.",
                icon: "✓",
              },
            ].map((capability, i) => (
              <StaggerItem key={capability.title} delay={i * 0.1}>
                <Card hover className="h-full">
                  <div className="text-3xl mb-4">{capability.icon}</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
                    {capability.title}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {capability.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </Container>
      </Section>

      {/* Evidence Integrity Teaser */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <Badge variant="success">Core Differentiator</Badge>
            
            <h2 className="text-3xl font-semibold text-white md:text-5xl">
              Evidence integrity that holds up to scrutiny.
            </h2>
            
            <p className="max-w-2xl mx-auto text-base text-slate-400">
              Our cryptographic verification model provides court-admissible proof of evidence integrity. 
              Every receipt contains SHA-256 hash, IPFS CID, and blockchain transaction — all independently verifiable.
            </p>
            
            <div className="pt-4">
              <a
                href="/trust"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition"
              >
                See how verification works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Deployment Diagram */}
      <Section className="py-32 bg-slate-900/30">
        <Container>
          <SectionHeading
            eyebrow="Deployment"
            title="Your data never leaves your perimeter."
            subtitle="The single biggest objection in government tech procurement, solved by design."
          />
          
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transitions.reveal, delay: 0.2 }}
            className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12"
          >
            <div className="grid gap-8 md:grid-cols-3 items-center text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-300">Your Servers</p>
                <p className="text-xs text-slate-500">On-premise or private cloud</p>
              </div>
              
              <div className="hidden md:block">
                <svg className="w-8 h-8 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl border border-sky-800 bg-sky-900/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-sky-400">T</span>
                </div>
                <p className="text-sm font-semibold text-slate-300">Truthline Software</p>
                <p className="text-xs text-slate-500">Detection + verification layer</p>
              </div>
              
              <div className="hidden md:block">
                <svg className="w-8 h-8 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-300">Your AI Model</p>
                <p className="text-xs text-slate-500">Local endpoint, your control</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                No data transmitted to Truthline servers. No third-party cloud storage. 
                Complete sovereignty over sensitive law enforcement data.
              </p>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* CTA Footer */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 text-center">
            <SectionHeading
              eyebrow="Get Started"
              title="Ready to pilot Truthline in your agency?"
              subtitle="We work directly with law enforcement agencies to deploy pilots tailored to your operational requirements."
              align="center"
            />
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-pilot"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Request a Pilot
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Try the Demo
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}

// Helper to check reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
