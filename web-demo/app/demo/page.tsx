'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container } from '@/components/ui/layout';
import { Badge, Card, Button } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';
import { Upload, Crosshair, Lock, CheckCircle2, ArrowRight, FileVideo, Activity, Box } from 'lucide-react';

export default function DemoPage() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Upload footage', icon: Upload },
    { number: 2, title: 'AI analysis runs', icon: Crosshair },
    { number: 3, title: 'Receipt generated', icon: Lock },
    { number: 4, title: 'Verify anytime', icon: CheckCircle2 },
  ];

  return (
    <div className="relative min-h-screen">
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
                    : 'border-slate-800 bg-[#0c1424]'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-sky-500 text-slate-950' : 'bg-[#162032] text-slate-500'
                }`}>
                  <s.icon className="w-4 h-4" />
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
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12 min-h-[400px]">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl border border-slate-700 bg-[#0c1424] flex items-center justify-center">
                  <Upload className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload your footage</h3>
                  <p className="text-slate-400 max-w-md">
                    Select a video file to begin the demo. In production, this would connect to your agency&apos;s body camera system.
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
                
                {/* Visual stream placeholder */}
                <div className="rounded-2xl border border-slate-800 bg-[#080e1a] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4 text-sky-400" />
                      <span className="text-sm text-slate-400">Visual stream</span>
                    </div>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="aspect-video rounded-lg bg-[#0c1424] flex items-center justify-center border border-slate-800">
                    <div className="text-center">
                      <Box className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500 mb-2">Simulated detection overlay</p>
                      <div className="w-32 h-20 border-2 border-sky-500/50 rounded mx-auto flex items-center justify-center">
                        <Crosshair className="w-6 h-6 text-sky-400/50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio stream placeholder */}
                <div className="rounded-2xl border border-slate-800 bg-[#080e1a] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-sky-400" />
                      <span className="text-sm text-slate-400">Audio stream</span>
                    </div>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="h-16 flex items-end gap-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-sky-500/40 rounded-t"
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

                <div className="receipt-terminal rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event ID</p>
                      <p className="text-slate-300 font-mono text-sm">evt_7k2m9n4p6q8r</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Timestamp</p>
                      <p className="text-slate-300 font-mono text-sm">{new Date().toISOString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SHA-256 Hash</p>
                      <p className="hash-value text-slate-300">
                        a3f2b8c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">IPFS CID</p>
                      <p className="hash-value text-slate-300">
                        QmX7Yn9Kp2Zm4Ht3Rw5Vb8Nc6Qd9Jf1Ls4Mg7Ph2Tk8Wx3Yz
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Solana Tx</p>
                      <p className="hash-value text-slate-300">
                        5KtPnQm7Hx2Yw9Vb3Nc8Jf4Ls6Mg1Ph9Rw2Tk7Xz4Yz8...
                      </p>
                    </div>
                  </div>
                </div>

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
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
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
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to deploy Truthline in your agency?
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Schedule a pilot deployment with our team. We&apos;ll work with your IT staff to ensure seamless integration.
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
