'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';
import { Crosshair, Lock, Link2, CheckCircle2, ArrowRight, ChevronRight, Shield, Zap, Database, FileCheck } from 'lucide-react';

const VerificationSeal = lazy(() => import('@/components/3d/VerificationSeal').then(mod => ({ default: mod.VerificationSeal })));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="relative min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-slate-700/50 bg-[#0c1424] p-8 shadow-2xl shadow-black/40"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Built for agencies
              </p>
              <div className="mt-6 space-y-4">
                {[
                  'CJIS-Aligned Architecture',
                  'Self-Hosted / On-Premise Ready',
                  'Cryptographic Evidence Integrity',
                  'Zero Data Leaves Your Perimeter',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
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
      <Section className="py-24 border-y border-slate-800/50 bg-[#0c1424] relative z-10">
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
            {[
              { label: 'CJIS-Aligned', sub: 'Architecture' },
              { label: 'Self-Hosted', sub: 'Deployment Ready' },
              { label: 'Open Core', sub: 'Transparent Stack' },
              { label: 'Audit Trail', sub: 'Immutable Records' },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="relative z-10 text-center rounded-2xl border border-slate-700/50 bg-[#162032] py-6">
                  <p className="text-sm font-semibold text-slate-300">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </Section>

      {/* The Problem - Asymmetric layout */}
      <Section id="how-it-works" className="py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
            >
              <Badge variant="alert">The Challenge</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Footage reviewed hours later is too late.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Traditional body camera workflows mean critical moments are only discovered long after incidents occur. 
                Manual review processes delay response and compromise evidence integrity.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Truthline changes this with real-time AI detection and cryptographic verification 
                that works the instant footage is captured.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.reveal, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-red-400">Before</p>
                </div>
                <p className="text-sm text-slate-300">
                  Footage sits unreviewed for hours. Critical alerts go unnoticed. Manual chain-of-custody documentation is fallible.
                </p>
              </div>
              
              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">After</p>
                </div>
                <p className="text-sm text-slate-300">
                  Real-time detection flags critical moments as they happen. Verified instantly with cryptographic proof.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Four Capabilities - Asymmetric two-column layout */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div className="lg:sticky lg:top-32">
              <Badge variant="info">Capabilities</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Four layers of intelligence.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                From real-time detection to cryptographic verification — every capability designed to serve institutional integrity.
              </p>
              
              <div className="hidden lg:block rounded-2xl border border-slate-700/50 bg-[#162032] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <span className="text-sm font-semibold text-slate-200">End-to-end integrity</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every layer compounds the previous one. Detection feeds hashing, hashing feeds anchoring, anchoring enables public verification. 
                  No single point of failure.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Crosshair,
                  title: 'Real-Time Detection',
                  description: 'AI-powered analysis identifies critical audio and visual events as they occur.',
                },
                {
                  icon: Lock,
                  title: 'Tamper-Evident Hashing',
                  description: 'SHA-256 fingerprints generated for every detected event, impossible to alter retroactively.',
                },
                {
                  icon: Link2,
                  title: 'On-Chain Anchoring',
                  description: 'Receipts anchored to Solana blockchain for permanent, publicly-verifiable audit trail.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Public Verification',
                  description: 'Anyone can verify evidence integrity by matching file hashes against chain records.',
                },
              ].map((capability, i) => (
                <StaggerItem key={capability.title} delay={i * 0.1}>
                  <div className="flex gap-5 rounded-2xl border border-slate-700/50 bg-[#162032] p-6 transition-colors hover:border-slate-600">
                    <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                      <capability.icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 mb-1">{capability.title}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{capability.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Evidence Integrity Teaser - Asymmetric with receipt preview */}
      <Section className="py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="success">Core Differentiator</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-5xl">
                Evidence integrity that holds up to scrutiny.
              </h2>
              <p className="max-w-2xl text-base text-slate-400 leading-relaxed mb-8">
                Our cryptographic verification model provides court-admissible proof of evidence integrity. 
                Every receipt contains SHA-256 hash, IPFS CID, and blockchain transaction — all independently verifiable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/trust"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  See how verification works
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Try the interactive demo
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="receipt-terminal rounded-2xl p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-500/70 mb-4">Receipt Preview</p>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">event</span>
                  <span className="text-slate-300">use_of_force</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">timestamp</span>
                  <span className="text-slate-300">2025-01-15T03:22:11Z</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">confidence</span>
                  <span className="text-emerald-400">0.97</span>
                </div>
                <div className="border-t border-slate-700/50 my-2" />
                <div>
                  <span className="text-slate-500">sha256</span>
                  <p className="text-slate-400 mt-1 break-all leading-relaxed">a3f8c91d...e7b2</p>
                </div>
                <div>
                  <span className="text-slate-500">anchor</span>
                  <p className="text-sky-400/80 mt-1 break-all leading-relaxed">solana:5Kt7n...9mPq</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-500/80 font-medium">Cryptographically sealed</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Deployment Diagram - Asymmetric */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
            >
              <Badge variant="info">Deployment</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Your data never leaves your perimeter.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                The single biggest objection in government tech procurement, solved by design.
              </p>
              <p className="text-sm text-slate-500">
                No data transmitted to Truthline servers. No third-party cloud storage. 
                Complete sovereignty over sensitive law enforcement data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.reveal, delay: 0.2 }}
              className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-[#0c1424]">
                  <Database className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Your Servers</p>
                    <p className="text-xs text-slate-500">On-premise or private cloud</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl border border-sky-800/50 bg-sky-950/20">
                  <div className="w-8 h-8 rounded-lg border border-sky-700 bg-sky-900/50 flex items-center justify-center">
                    <span className="text-sm font-bold text-sky-400">T</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sky-300">Truthline Software</p>
                    <p className="text-xs text-slate-500">Detection + verification layer</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-[#0c1424]">
                  <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Your AI Model</p>
                    <p className="text-xs text-slate-500">Local endpoint, your control</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA Footer - Single CTA */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12 text-center">
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

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
