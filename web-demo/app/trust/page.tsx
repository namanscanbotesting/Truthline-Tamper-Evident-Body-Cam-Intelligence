'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';
import { 
  FileText, Lock, Link2, CheckCircle2, ArrowDown, ChevronRight,
  Shield, Hash, Database, Fingerprint, Scale, FileCheck
} from 'lucide-react';

const VerificationSeal = lazy(() => import('@/components/3d/VerificationSeal').then(mod => ({ default: mod.VerificationSeal })));

export default function TrustPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="relative min-h-screen">
      <Header />

      {/* Hero with 3D seal */}
      <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <motion.div 
              style={{ opacity, scale }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30"
            />
          </Suspense>
        </div>

        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
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

            {/* Receipt structure - Terminal treatment */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="receipt-terminal rounded-2xl p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-6">
                Receipt Structure
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-[#080e1a]">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Original File</p>
                    <p className="text-xs text-slate-500">Body camera footage</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-sky-800/30 bg-sky-950/20">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sky-300">SHA-256 Hash</p>
                    <p className="text-xs text-slate-500 font-mono">a3f2b8c1d4e5...</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-emerald-400" />
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

      {/* How Verification Works - 4 steps */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="Four steps to immutable proof."
            subtitle="From raw footage to court-admissible evidence integrity."
          />

          <StaggerGrid columns={4} className="mt-16">
            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-slate-700 bg-[#162032] flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-slate-300">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Capture</h3>
                <p className="text-sm text-slate-400">
                  Officer records incident with body camera. Original file remains in agency custody.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-sky-800/50 bg-sky-950/30 flex items-center justify-center mb-4">
                  <Hash className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Hash</h3>
                <p className="text-sm text-slate-400">
                  SHA-256 cryptographic hash generated from file. Any change to original produces different hash.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-emerald-800/50 bg-emerald-950/30 flex items-center justify-center mb-4">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Anchor</h3>
                <p className="text-sm text-slate-400">
                  Hash + metadata written to Solana blockchain. Transaction ID becomes permanent reference.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-2xl border border-slate-700 bg-[#162032] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
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

      {/* Technical Deep Dive - Asymmetric layout */}
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
                  {[
                    { label: 'Deterministic', desc: 'Same input always produces same hash' },
                    { label: 'One-way', desc: 'Impossible to reverse-engineer original data from hash' },
                    { label: 'Avalanche effect', desc: 'Single bit change produces completely different hash' },
                    { label: 'Collision-resistant', desc: 'Computationally infeasible for two files to share same hash' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong className="text-slate-300">{item.label}:</strong> {item.desc}</span>
                    </li>
                  ))}
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
                <h3 className="text-sm font-semibold text-slate-300 mb-4">What&apos;s in each receipt?</h3>
                <div className="space-y-3">
                  {[
                    { field: 'file_hash', desc: 'SHA-256 hash of original video file' },
                    { field: 'ipfs_cid', desc: 'Content-addressed storage identifier' },
                    { field: 'timestamp', desc: 'Unix timestamp of event detection' },
                    { field: 'tx_signature', desc: 'Solana transaction ID for public verification' },
                  ].map((item) => (
                    <div key={item.field} className="p-4 rounded-xl border border-slate-800 bg-[#080e1a]">
                      <p className="text-xs font-mono text-sky-400 mb-1">{item.field}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Verification Demo - Asymmetric */}
      <Section className="py-32 bg-[#0c1424]/40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="info">Public Verification</Badge>
              <h2 className="text-3xl font-semibold text-white mt-4 mb-4 md:text-4xl">
                Anyone can verify. Anytime.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Our verification endpoint is publicly accessible. Provide a receipt ID or upload 
                a file to independently confirm evidence integrity — no account required.
              </p>
              <a
                href="/verify"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Try Verification
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="receipt-terminal rounded-2xl p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-500/70 mb-4">Verification Terminal</p>
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-500">$ truthline verify --receipt-id 7f3a9c</div>
                <div className="border-l-2 border-emerald-500/50 pl-3 space-y-1">
                  <p className="text-emerald-400">✓ Hash match confirmed</p>
                  <p className="text-emerald-400">✓ Anchor verified on Solana</p>
                  <p className="text-emerald-400">✓ Timestamp validated</p>
                </div>
                <div className="border-t border-slate-700/50 pt-2 mt-2">
                  <p className="text-slate-400">Result: <span className="text-emerald-400 font-semibold">INTEGRITY CONFIRMED</span></p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Legal Admissibility - Asymmetric */}
      <Section className="py-32">
        <Container size="wide">
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
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
                  {[
                    { label: 'Authentication', desc: 'Cryptographic proof satisfies FRE 901 requirements' },
                    { label: 'Chain of Custody', desc: 'Immutable audit trail from capture to presentation' },
                    { label: 'Tamper Evidence', desc: 'Any alteration immediately detectable via hash mismatch' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-900/30 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="receipt-terminal rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Sample Expert Testimony</h3>
                <blockquote className="space-y-4 text-sm text-slate-400 italic">
                  <p>
                    &ldquo;The SHA-256 hash algorithm is widely accepted in the scientific community 
                    as a reliable method for verifying digital file integrity...&rdquo;
                  </p>
                  <p>
                    &ldquo;By comparing the hash value of the submitted video file against the hash 
                    recorded on the Solana blockchain at the time of capture, we can 
                    mathematically prove whether the file has been altered...&rdquo;
                  </p>
                  <p>
                    &ldquo;In my professional opinion, this cryptographic verification method provides 
                    a higher degree of certainty than traditional chain-of-custody documentation.&rdquo;
                  </p>
                </blockquote>
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 font-mono">
                    — Example framework for expert witness testimony
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
