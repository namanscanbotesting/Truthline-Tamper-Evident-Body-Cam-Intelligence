'use client';

import { motion } from 'framer-motion';
import { Suspense, useState, useRef } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card, Button } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';

/**
 * Live Demo Page — Interactive product tour
 * Reframed from raw test harness to guided experience
 */

export default function DemoPage() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    {
      number: 1,
      title: 'Upload footage',
      description: 'Drag and drop or select body camera footage. We support common formats including MP4, MOV, and AVI.',
      icon: '📁',
    },
    {
      number: 2,
      title: 'AI analysis runs',
      description: 'Our detection pipeline analyzes audio and visual streams in real-time, flagging critical events.',
      icon: '🎯',
    },
    {
      number: 3,
      title: 'Receipt generated',
      description: 'Every detected event generates a tamper-evident receipt with SHA-256 hash anchored on-chain.',
      icon: '🔐',
    },
    {
      number: 4,
      title: 'Verify anytime',
      description: 'Anyone can independently verify evidence integrity by matching file hashes against blockchain records.',
      icon: '✓',
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
            <Badge variant="info">Interactive Demo</Badge>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              See Truthline in action.
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-400">
              Experience the complete flow from upload to verification. 
              This demo shows how every piece of footage gets analyzed, hashed, and anchored for permanent audit.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Step indicator */}
      <Section className="py-8">
        <Container>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                  step >= i 
                    ? 'border-sky-800 bg-sky-950/30' 
                    : 'border-slate-800 bg-slate-900/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= i ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  {s.number}
                </div>
                <span className={`hidden md:block text-sm font-medium ${
                  step >= i ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  {s.title}
                </span>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Demo stage */}
      <Section className="py-16">
        <Container size="wide">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 min-h-[400px]">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl border border-slate-700 bg-slate-800/50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload your footage</h3>
                  <p className="text-slate-400 max-w-md">
                    Select a video file to begin the demo. In production, this would connect to your agency's body camera system.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={() => setStep(1)}
                  />
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Use Sample Video
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="info">Analyzing</Badge>
                  <span className="text-sm text-slate-400">Processing footage...</span>
                </div>
                
                {/* Fake analysis UI */}
                <div className="rounded-2xl border border-slate-800 bg-black/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-400">Audio stream</span>
                    <span className="text-xs text-emerald-400">Active</span>
                  </div>
                  <div className="h-16 flex items-end gap-1">
                    {Array.from({ length: 40 }).map((_, i) => (
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
                          delay: i * 0.02,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-black/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-400">Visual stream</span>
                    <span className="text-xs text-emerald-400">Active</span>
                  </div>
                  <div className="aspect-video rounded-lg bg-slate-800/50 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-2">Simulated detection overlay</p>
                      <div className="w-32 h-20 border-2 border-sky-500 rounded mx-auto" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={() => setStep(2)}>
                    Continue to Receipt
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="success">Receipt Generated</Badge>
                </div>

                <Card className="font-mono text-sm">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event ID</p>
                      <p className="text-slate-300">evt_7k2m9n4p6q8r</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
                      <p className="text-slate-300">{new Date().toISOString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SHA-256 Hash</p>
                      <p className="text-slate-300 break-all">
                        a3f2b8c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">IPFS CID</p>
                      <p className="text-slate-300">
                        QmX7Yn9Kp2Zm4Ht3Rw5Vb8Nc6Qd9Jf1Ls4Mg7Ph2Tk8Wx3Yz
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Solana Tx</p>
                      <p className="text-slate-300">
                        5KtPnQm7Hx2Yw9Vb3Nc8Jf4Ls6Mg1Ph9Rw2Tk7Xz4Yz8...
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Verify Receipt
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Verification Successful</h3>
                  <p className="text-slate-400 max-w-md">
                    The hash matches the on-chain record. Evidence integrity confirmed.
                    This receipt can be independently verified by anyone with the original file.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Start Over
                  </Button>
                  <a href="/request-pilot">
                    <Button>Request a Pilot</Button>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to deploy Truthline in your agency?
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Schedule a pilot deployment with our team. We'll work with your IT staff to ensure seamless integration.
            </p>
            <a href="/request-pilot">
              <Button size="lg">Request a Pilot</Button>
            </a>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
