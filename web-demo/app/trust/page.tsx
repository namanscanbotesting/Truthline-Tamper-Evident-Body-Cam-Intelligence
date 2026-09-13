'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';

// Lazy-load 3D component
const VerificationSeal = lazy(() => import('@/components/3d/VerificationSeal').then(mod => ({ default: mod.VerificationSeal })));

/**
 * Trust & Verification Page
 * Deep-dive on cryptographic evidence model — our strongest differentiator
 */

export default function TrustPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="relative min-h-screen bg-[#05070d]">
      <Header />

      {/* Hero with 3D seal */}
      <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
        {/* 3D Background element - explodes on scroll */}
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <motion.div 
              style={{ opacity, scale }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30"
            >
              {/* Note: In production, this would animate to exploded view on scroll */}
            </motion.div>
          </Suspense>
        </div>

        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <Badge variant="success">Core Differentiator</Badge>
              
              <h1 className="text-4xl font-semibold text-white md:text-5xl leading-tight">
                Evidence integrity that holds up in court.
              </h1>
              
              <p className="max-w-xl text-base text-slate-400 leading-relaxed">
                Our cryptographic verification model provides court-admissible proof of evidence integrity. 
                Every receipt contains SHA-256 hash, IPFS CID, and blockchain transaction — all independently verifiable.
              </p>
            </motion.div>

            {/* Verification card preview */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-6">
                Receipt Structure
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-950/50">
                  <div className="w-10 h-10 rounded-full bg-sky-900/30 border border-sky-800 flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Original File</p>
                    <p className="text-xs text-slate-500">Body camera footage</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-sky-800 bg-sky-950/30">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center">
                    <span className="text-lg">🔐</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sky-300">SHA-256 Hash</p>
                    <p className="text-xs text-slate-500 font-mono">a3f2b8c1d4e5...</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-800 bg-emerald-950/30">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                    <span className="text-lg">⛓️</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">On-Chain Anchor</p>
                    <p className="text-xs text-slate-500">Solana transaction ID</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* How Verification Works */}
      <Section className="py-32 bg-slate-900/30">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="Four steps to immutable proof."
            subtitle="From raw footage to court-admissible evidence integrity."
          />

          <StaggerGrid columns={4} className="mt-16">
            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-slate-300">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Capture</h3>
                <p className="text-sm text-slate-400">
                  Officer records incident with body camera. Original file remains in agency custody.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-sky-800 bg-sky-900/30 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-sky-300">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Hash</h3>
                <p className="text-sm text-slate-400">
                  SHA-256 cryptographic hash generated from file. Any change to original produces different hash.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-emerald-800 bg-emerald-900/30 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-emerald-300">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Anchor</h3>
                <p className="text-sm text-slate-400">
                  Hash + metadata written to Solana blockchain. Transaction ID becomes permanent reference.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-slate-300">4</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Verify</h3>
                <p className="text-sm text-slate-400">
                  Anyone can re-hash the file and compare against chain record. Match = integrity confirmed.
                </p>
              </Card>
            </StaggerItem>
          </StaggerGrid>
        </Container>
      </Section>

      {/* Technical Deep Dive */}
      <Section className="py-32">
        <Container size="wide">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transitions.reveal}
              className="space-y-8"
            >
              <div>
                <Badge variant="info">Cryptographic Foundation</Badge>
                <h2 className="text-3xl font-semibold text-white mt-4 mb-4">
                  SHA-256: The gold standard.
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  We use SHA-256 (Secure Hash Algorithm 256-bit), the same cryptographic standard 
                  used by Bitcoin, TLS certificates, and government security systems worldwide.
                </p>
              </div>

              <Card>
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Why SHA-256?</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-slate-300">Deterministic:</strong> Same input always produces same hash</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-slate-300">One-way:</strong> Impossible to reverse-engineer original data from hash</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-slate-300">Avalanche effect:</strong> Single bit change produces completely different hash</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-slate-300">Collision-resistant:</strong> Computationally infeasible for two files to share same hash</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.reveal, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <Badge variant="success">Blockchain Anchoring</Badge>
                <h2 className="text-3xl font-semibold text-white mt-4 mb-4">
                  Permanent, public audit trail.
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  By anchoring hashes to Solana, we create a timestamped, immutable record 
                  that cannot be altered retroactively — even by us.
                </p>
              </div>

              <Card>
                <h3 className="text-sm font-semibold text-slate-300 mb-4">What's in each receipt?</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs font-mono text-sky-400 mb-1">file_hash</p>
                    <p className="text-xs text-slate-500">SHA-256 hash of original video file</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs font-mono text-sky-400 mb-1">ipfs_cid</p>
                    <p className="text-xs text-slate-500">Content-addressed storage identifier</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs font-mono text-sky-400 mb-1">timestamp</p>
                    <p className="text-xs text-slate-500">Unix timestamp of event detection</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs font-mono text-sky-400 mb-1">tx_signature</p>
                    <p className="text-xs text-slate-500">Solana transaction ID for public verification</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Verification Demo */}
      <Section className="py-32 bg-slate-900/30">
        <Container size="narrow">
          <div className="text-center space-y-8">
            <Badge variant="info">Public Verification</Badge>
            
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Anyone can verify. Anytime.
            </h2>
            
            <p className="max-w-2xl mx-auto text-slate-400">
              Our verification endpoint is publicly accessible. Provide a receipt ID or upload 
              a file to independently confirm evidence integrity — no account required.
            </p>

            <div className="pt-4">
              <a href="/verify">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  Try Verification
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Legal Admissibility */}
      <Section className="py-32">
        <Container size="wide">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <Badge variant="alert">Legal Framework</Badge>
                <h2 className="text-2xl font-semibold text-white mt-4 mb-6">
                  Designed for court admissibility.
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Our verification model aligns with Federal Rules of Evidence Rule 901(b)(9) 
                  for authentication of digital evidence through cryptographic hashing and 
                  blockchain-based timestamping.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Authentication</p>
                      <p className="text-sm text-slate-500">Cryptographic proof satisfies FRE 901 requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Chain of Custody</p>
                      <p className="text-sm text-slate-500">Immutable audit trail from capture to presentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Tamper Evidence</p>
                      <p className="text-sm text-slate-500">Any alteration immediately detectable via hash mismatch</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Sample Expert Testimony</h3>
                <blockquote className="space-y-4 text-sm text-slate-400 italic">
                  <p>
                    "The SHA-256 hash algorithm is widely accepted in the scientific community 
                    as a reliable method for verifying digital file integrity..."
                  </p>
                  <p>
                    "By comparing the hash value of the submitted video file against the hash 
                    recorded on the Solana blockchain at the time of capture, we can 
                    mathematically prove whether the file has been altered..."
                  </p>
                  <p>
                    "In my professional opinion, this cryptographic verification method provides 
                    a higher degree of certainty than traditional chain-of-custody documentation."
                  </p>
                </blockquote>
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500">
                    — Example framework for expert witness testimony regarding cryptographic evidence verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
