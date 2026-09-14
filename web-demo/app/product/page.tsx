'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';
import { 
  Crosshair, Lock, Link2, CheckCircle2, ArrowRight, ChevronRight,
  Eye, Headphones, AlertTriangle, Radio, Database, Shield, Fingerprint, FileCheck
} from 'lucide-react';

const VerificationSeal = lazy(() => import('@/components/3d/VerificationSeal').then(mod => ({ default: mod.VerificationSeal })));

export default function ProductPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="relative min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <div className="absolute right-0 top-1/4 w-[600px] h-[600px] opacity-15">
              <VerificationSeal autoRotate={true} />
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
              <Badge variant="info">Product</Badge>
              
              <h1 className="text-4xl font-semibold text-white md:text-6xl leading-tight">
                Evidence integrity by design.
              </h1>
              
              <p className="max-w-xl text-base text-slate-400 leading-relaxed">
                Four integrated layers — detection, verification, anchoring, and audit — 
                built to meet CJIS requirements from day one.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-slate-700/50 bg-[#0c1424] p-8 shadow-2xl shadow-black/40"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-6">
                How it works
              </p>
              <div className="space-y-4">
                {[
                  { step: '01', label: 'Capture', desc: 'Body cam streams in real-time' },
                  { step: '02', label: 'Detect', desc: 'AI flags critical moments instantly' },
                  { step: '03', label: 'Hash', desc: 'SHA-256 fingerprint generated' },
                  { step: '04', label: 'Anchor', desc: 'Receipt anchored on-chain' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-xs font-mono text-sky-400 mt-0.5">{item.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Real-Time Detection - Asymmetric layout */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
            >
              <Badge variant="alert">Layer 1</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Real-time detection.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Purpose-built for live detection with minimal latency. Our models are designed to flag critical moments 
                as they happen — not hours later during manual review.
              </p>
              <p className="text-sm text-slate-500">
                AI-powered audio and visual analysis identifies use-of-force events, high-risk situations, 
                and protocol violations in real-time.
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
                {[
                  { icon: Eye, label: 'Visual Event Detection', desc: 'Weapon presence, crowd dynamics, use of force indicators' },
                  { icon: Headphones, label: 'Audio Event Detection', desc: 'Gunshots, breaking glass, verbal escalation patterns' },
                  { icon: AlertTriangle, label: 'Critical Alert System', desc: 'Prioritized notifications for supervisors' },
                  { icon: Radio, label: 'Live Feed Integration', desc: 'Seamless with existing body cam infrastructure' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-slate-700/30 bg-[#0c1424]/60">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Tamper-Evident Hashing */}
      <Section className="py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge variant="success">Layer 2</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Tamper-evident hashing.
              </h2>
              <p className="max-w-2xl text-base text-slate-400 leading-relaxed mb-6">
                Every detected event generates a SHA-256 fingerprint — a mathematical proof of the original content. 
                Any alteration, no matter how small, produces a completely different hash.
              </p>
              <p className="text-sm text-slate-500">
                The hash is stored locally and anchored on-chain in one operation. 
                No single point of failure in the verification chain.
              </p>
            </div>

            <div className="hidden lg:block w-[320px] receipt-terminal rounded-2xl p-6">
              <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">Example Receipt</p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Algorithm</span>
                  <span className="text-slate-300 font-mono">SHA-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chain</span>
                  <span className="text-slate-300 font-mono">Solana</span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-slate-500 mb-2">Hash</p>
                  <p className="hash-value text-slate-300">a]f3e8c1d2b4a6e8f0c3d5b7a9e1f2d4c6b8a0e2f4d6c8b0a2e4f6d8</p>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-slate-500 mb-2">IPFS CID</p>
                  <p className="hash-value text-slate-300">bafybeigdyr...6h3q7</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* On-Chain Anchoring */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
              className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8"
            >
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-700/30 bg-[#0c1424]/60">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-sky-400" />
                    <p className="text-sm font-semibold text-slate-200">On-Chain Anchoring</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Each receipt is anchored to the Solana blockchain, creating a permanent, immutable record 
                    that can be independently verified by anyone.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-700/30 bg-[#0c1424]/60">
                  <div className="flex items-center gap-3 mb-2">
                    <Fingerprint className="w-4 h-4 text-sky-400" />
                    <p className="text-sm font-semibold text-slate-200">Public Verification</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    No account required. Match the file hash against the chain record to confirm evidence integrity.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-700/30 bg-[#0c1424]/60">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    <p className="text-sm font-semibold text-slate-200">IPFS + On-Chain</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Full metadata stored on IPFS with on-chain transaction record. 
                    Permanent audit trail with zero central point of failure.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.reveal, delay: 0.2 }}
            >
              <Badge variant="info">Layer 3</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                On-chain anchoring.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Every receipt is anchored to the Solana blockchain, creating a permanent, immutable record 
                that can be independently verified by anyone — with no account required.
              </p>
              <p className="text-sm text-slate-500">
                The combination of SHA-256 hashing, IPFS storage, and Solana anchoring provides 
                three independent verification methods for court-admissible evidence integrity.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Public Verification - Terminal treatment */}
      <Section className="py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div className="lg:sticky lg:top-32">
              <Badge variant="success">Layer 4</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Public verification.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                The gold standard for chain of custody. Anyone can verify evidence integrity by matching 
                file hashes against chain records — no account, no permission, no special tools.
              </p>
              <p className="text-sm text-slate-500 mb-8">
                Upload your evidence file or enter a hash to instantly confirm whether the original content 
                has been altered since capture.
              </p>

              <a
                href="/verify/demo"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Try verification
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="receipt-terminal rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Verification Terminal
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#080e1a] border border-slate-800">
                  <p className="text-xs text-slate-500 mb-2">Input Hash</p>
                  <p className="hash-value text-sky-300 text-xs">a]f3e8c1d2b4a6e8f0c3d5b7a9e1f2d4c6b8a0e2f4d6c8b0a2e4f6d8</p>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                </div>
                
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-semibold text-emerald-400">Verified</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Hash matches on-chain record. Content has not been modified since capture.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 font-mono">Verification timestamp: 2025-03-15T14:32:00Z</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bottom CTA */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12 text-center">
            <SectionHeading
              eyebrow="Get Started"
              title="See how Truthline fits your workflow"
              subtitle="We work directly with agencies to deploy pilots tailored to your operational requirements."
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
