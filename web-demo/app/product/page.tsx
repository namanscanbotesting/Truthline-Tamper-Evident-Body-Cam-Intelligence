'use client';

import { motion } from 'framer-motion';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';

/**
 * Product / How It Works Page
 * Scrollytelling walkthrough of the 4 capabilities
 */

export default function ProductPage() {
  const capabilities = [
    {
      number: '01',
      title: 'Real-Time Detection',
      subtitle: 'AI-powered analysis as events unfold',
      description: 'Our detection pipeline processes audio and visual streams simultaneously, identifying critical moments the instant they occur. Gunshots, raised voices, sudden movements — flagged immediately for supervisor review.',
      features: [
        'Audio event classification (gunshots, screams, glass break)',
        'Visual anomaly detection (rapid movement, crowd formation)',
        'Multi-stream synchronization',
        'Sub-second alert latency',
      ],
      icon: '🎯',
      accent: 'sky',
    },
    {
      number: '02',
      title: 'Tamper-Evident Hashing',
      subtitle: 'Cryptographic fingerprints for every event',
      description: 'The moment an event is detected, we generate a SHA-256 hash of the footage segment. This cryptographic fingerprint is mathematically impossible to forge — any alteration to the file produces a completely different hash.',
      features: [
        'SHA-256 cryptographic hashing',
        'Per-event hash generation',
        'Hash stored separately from footage',
        'Instant integrity verification',
      ],
      icon: '🔐',
      accent: 'emerald',
    },
    {
      number: '03',
      title: 'On-Chain Anchoring',
      subtitle: 'Permanent blockchain timestamp',
      description: 'Each hash is written to the Solana blockchain with a precise timestamp. This creates an immutable, publicly-verifiable record that proves when the evidence was captured — and that it hasn\'t been altered since.',
      features: [
        'Solana blockchain anchoring',
        'Immutable transaction records',
        'Public verifiability',
        'Low-cost, high-throughput transactions',
      ],
      icon: '⛓️',
      accent: 'violet',
    },
    {
      number: '04',
      title: 'Public Verification',
      subtitle: 'Anyone can verify, anytime',
      description: 'Our verification endpoint is publicly accessible. Provide a receipt ID or upload a file to independently confirm evidence integrity. No account required. No gatekeeping. Mathematical proof, available to all.',
      features: [
        'Open verification API',
        'Receipt lookup by ID',
        'File hash comparison',
        'Blockchain transaction explorer',
      ],
      icon: '✓',
      accent: 'amber',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#05070d]">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitions.reveal}
            className="text-center space-y-6"
          >
            <Badge variant="info">How It Works</Badge>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Four layers of intelligence.
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-400">
              From real-time detection to cryptographic verification — 
              every capability designed to serve institutional integrity.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Capabilities - detailed scroll sections */}
      {capabilities.map((cap, index) => (
        <Section
          key={cap.number}
          className={`py-32 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}
        >
          <Container>
            <div className={`grid gap-16 lg:grid-cols-2 lg:items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={transitions.reveal}
              >
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-6 ${
                  cap.accent === 'sky' ? 'border-sky-800 bg-sky-950/30' :
                  cap.accent === 'emerald' ? 'border-emerald-800 bg-emerald-950/30' :
                  cap.accent === 'violet' ? 'border-violet-800 bg-violet-950/30' :
                  'border-amber-800 bg-amber-950/30'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    cap.accent === 'sky' ? 'text-sky-400' :
                    cap.accent === 'emerald' ? 'text-emerald-400' :
                    cap.accent === 'violet' ? 'text-violet-400' :
                    'text-amber-400'
                  }`}>
                    {cap.number}
                  </span>
                  <span className="text-sm font-medium text-slate-300">{cap.title}</span>
                </div>

                <h2 className="text-3xl font-semibold text-white mb-4">
                  {cap.subtitle}
                </h2>

                <p className="text-slate-400 leading-relaxed mb-8">
                  {cap.description}
                </p>

                <ul className="space-y-4">
                  {cap.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...transitions.reveal, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <svg className={`w-5 h-5 mt-0.5 shrink-0 ${
                        cap.accent === 'sky' ? 'text-sky-500' :
                        cap.accent === 'emerald' ? 'text-emerald-500' :
                        cap.accent === 'violet' ? 'text-violet-500' :
                        'text-amber-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual/diagram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ ...transitions.reveal, delay: 0.2 }}
                className="relative"
              >
                <Card className="aspect-square flex items-center justify-center p-8">
                  {index === 0 && (
                    // Real-time detection visualization
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Audio Stream</span>
                        <span className="text-xs text-emerald-400">● Live</span>
                      </div>
                      <div className="h-20 flex items-end gap-1">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 bg-sky-500/60 rounded-t"
                            animate={{
                              height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
                            }}
                            transition={{
                              duration: 0.3,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              delay: i * 0.03,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-xs text-slate-500">Visual Stream</span>
                        <span className="text-xs text-emerald-400">● Live</span>
                      </div>
                      <div className="aspect-video rounded-lg bg-slate-800/50 flex items-center justify-center">
                        <motion.div
                          className="w-24 h-16 border-2 border-sky-500 rounded"
                          animate={{
                            borderColor: ['#0ea5e9', '#38bdf8', '#0ea5e9'],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {index === 1 && (
                    // Hash visualization
                    <div className="w-full text-center space-y-6">
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                        <p className="text-xs text-slate-500 mb-2">Original File</p>
                        <div className="h-12 w-full bg-slate-800 rounded flex items-center justify-center">
                          <span className="text-xs text-slate-400 font-mono">video.mp4</span>
                        </div>
                      </div>
                      
                      <motion.svg
                        className="w-8 h-8 mx-auto text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ y: 0 }}
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </motion.svg>

                      <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/30">
                        <p className="text-xs text-emerald-400 mb-2">SHA-256 Hash</p>
                        <p className="text-xs text-emerald-300 font-mono break-all">
                          a3f2b8c1d4e5f6789012345678...
                        </p>
                      </div>
                    </div>
                  )}

                  {index === 2 && (
                    // Blockchain visualization
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((block, i) => (
                          <motion.div
                            key={block}
                            className="w-12 h-12 rounded-lg border border-violet-800 bg-violet-950/30 flex items-center justify-center"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="text-xs text-violet-400 font-mono">#{100 + i}</span>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        Your hash anchored in block <span className="text-violet-400 font-mono">#103</span>
                      </p>
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                        <p className="text-xs text-slate-500 mb-1">Transaction Signature</p>
                        <p className="text-xs text-slate-300 font-mono break-all">
                          5KtPnQm7Hx2Yw9Vb3Nc8Jf4Ls6Mg1Ph9Rw2Tk7Xz4Yz8...
                        </p>
                      </div>
                    </div>
                  )}

                  {index === 3 && (
                    // Verification visualization
                    <div className="w-full space-y-4">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                      >
                        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-emerald-400">Verification Successful</p>
                        <p className="text-xs text-slate-500 mt-1">Hash matches on-chain record</p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">File Hash:</span>
                          <span className="text-slate-300 font-mono">a3f2...1234</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Chain Hash:</span>
                          <span className="text-slate-300 font-mono">a3f2...1234</span>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-xs text-emerald-400">✓ Match confirmed</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </Container>
        </Section>
      ))}

      {/* CTA */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to see it in action?
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Try our interactive demo to experience the complete flow from upload to verification.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/demo">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  Try the Demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </a>
              <a href="/request-pilot">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Request a Pilot
                </motion.button>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
