'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container, StaggerGrid, StaggerItem } from '@/components/ui/layout';
import { SectionHeading, Badge, Card, Button } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';
import { 
  Server, Cloud, Wifi, Shield, Lock, Eye, Users, AlertTriangle,
  ChevronRight, ArrowDown, Database, CheckCircle2, FileCheck
} from 'lucide-react';

export default function GovernmentPage() {
  const [activeTab, setActiveTab] = useState<'deployment' | 'security' | 'compliance'>('deployment');

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
            <Badge variant="info">For Agencies</Badge>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Built for government deployment.
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-400">
              On-premise ready. CJIS-aligned architecture. Zero data leaves your perimeter.
              Designed to meet the stringent requirements of law enforcement technology deployments.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Tab navigation */}
      <Section className="py-8">
        <Container>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1 rounded-full border border-slate-800 bg-[#0c1424]">
              {(['deployment', 'security', 'compliance'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Tab content */}
      {activeTab === 'deployment' && (
        <Section className="py-32">
          <Container size="wide">
            <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={transitions.reveal}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Your infrastructure. Your control.
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Truthline deploys entirely within your agency&apos;s existing infrastructure. 
                    No cloud dependencies. No external data transfers. No third-party access 
                    to sensitive footage.
                  </p>
                </div>

                <Card>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Deployment Options</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: Server, label: 'On-Premise Server', desc: 'Deploy on your existing server hardware in your secure facility' },
                      { icon: Cloud, label: 'Private Cloud (GovCloud)', desc: 'AWS GovCloud, Azure Government, or other FedRAMP environments' },
                      { icon: Wifi, label: 'Air-Gapped Deployment', desc: 'Fully isolated networks with no external connectivity' },
                    ].map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-sky-900/30 border border-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-sky-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="receipt-terminal rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4">Technical Requirements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: 'CPU', value: '8+ cores (16+ recommended)' },
                      { label: 'RAM', value: '32GB minimum' },
                      { label: 'GPU', value: 'NVIDIA T4 or equivalent' },
                      { label: 'Storage', value: 'SSD with 500GB+ available' },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-slate-500 mb-1">{item.label}</p>
                        <p className="text-slate-300 font-mono text-xs">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Deployment diagram */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...transitions.reveal, delay: 0.2 }}
              >
                <Card className="h-full p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">
                    Deployment Architecture
                  </p>
                  
                  <div className="space-y-6">
                    <div className="rounded-2xl border-2 border-dashed border-slate-700 p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 text-center">
                        Agency Perimeter
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-xl border border-slate-700 bg-[#162032] flex items-center justify-center">
                              <Database className="w-5 h-5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 text-center">Body Cameras</p>

                        <div className="flex justify-center">
                          <ArrowDown className="w-4 h-4 text-slate-600" />
                        </div>

                        <div className="rounded-xl border border-sky-800 bg-sky-950/30 p-4">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg border border-sky-700 bg-sky-900/50 flex items-center justify-center">
                              <span className="text-sm font-bold text-sky-400">T</span>
                            </div>
                            <span className="text-sm font-semibold text-sky-300">Truthline Server</span>
                          </div>
                          <p className="text-xs text-slate-500 text-center">Detection + Verification Layer</p>
                        </div>

                        <div className="flex justify-center">
                          <ArrowDown className="w-4 h-4 text-slate-600" />
                        </div>

                        <div className="rounded-xl border border-slate-700 bg-[#162032] p-4">
                          <div className="flex items-center justify-center gap-3">
                            <Database className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-300">Evidence Storage</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowDown className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-semibold text-emerald-300">Solana Blockchain</span>
                        <span className="text-xs text-slate-500">(Hash only, no footage)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 text-center">
                      Only cryptographic hashes leave your perimeter — never the actual footage.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </Section>
      )}

      {activeTab === 'security' && (
        <Section className="py-32">
          <Container size="wide">
            <div className="max-w-3xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={transitions.reveal}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Security by design.
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Every aspect of Truthline is architected with security as the foundation, 
                  not an afterthought. We understand that law enforcement data demands the 
                  highest level of protection.
                </p>
              </motion.div>

              <StaggerGrid columns={2}>
                {[
                  { icon: Lock, label: 'Encryption at Rest', desc: 'AES-256 encryption for all stored evidence and metadata' },
                  { icon: Shield, label: 'Encryption in Transit', desc: 'TLS 1.3 for all network communications' },
                  { icon: Eye, label: 'Audit Logging', desc: 'Comprehensive logs of all system access and actions' },
                  { icon: Users, label: 'Role-Based Access', desc: 'Granular permissions based on role and clearance level' },
                ].map((item) => (
                  <StaggerItem key={item.label}>
                    <Card>
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5 text-sky-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-2">{item.label}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </Container>
        </Section>
      )}

      {activeTab === 'compliance' && (
        <Section className="py-32">
          <Container size="wide">
            <div className="max-w-3xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={transitions.reveal}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Designed for compliance.
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Truthline is architected to align with major law enforcement compliance frameworks. 
                  While we don&apos;t claim certification until formally audited, our design decisions 
                  are guided by these standards from day one.
                </p>
              </motion.div>

              <Card>
                <div className="space-y-6">
                  {[
                    { abbr: 'CJIS', label: 'CJIS Security Policy', desc: 'Criminal Justice Information Services security requirements for handling FBI criminal justice information. Our architecture supports agencies in maintaining CJIS compliance through on-premise deployment and strict access controls.' },
                    { abbr: 'FedRAMP', label: 'FedRAMP Ready', desc: 'When deployed on FedRAMP-authorized cloud infrastructure (AWS GovCloud, Azure Government), Truthline inherits the underlying platform\'s FedRAMP authorization.' },
                    { abbr: 'FRE', label: 'Federal Rules of Evidence', desc: 'Our cryptographic verification model aligns with FRE Rule 901(b)(9) for authentication of digital evidence through hashing and blockchain-based timestamping.' },
                    { abbr: 'State', label: 'State Record Retention', desc: 'Configurable retention policies to comply with state-specific body camera footage retention requirements. Automatic archival and deletion workflows.' },
                  ].map((item, i) => (
                    <div key={item.abbr}>
                      {i > 0 && <div className="border-t border-slate-800 mb-6" />}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl border border-slate-700 bg-[#162032] flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-slate-300">{item.abbr}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-300 mb-1">{item.label}</h3>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="rounded-2xl border border-amber-800/30 bg-amber-950/10 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-400 mb-1">Compliance Disclaimer</p>
                    <p className="text-sm text-slate-400">
                      Truthline is designed to support compliance with the frameworks listed above, 
                      but we do not claim formal certification until completing independent audits. 
                      We work with each agency&apos;s legal and compliance teams to ensure deployment 
                      meets their specific requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Procurement CTA - Single CTA */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-700/50 bg-[#162032] p-8 md:p-12 text-center">
            <Badge variant="info" className="mb-6">Procurement Ready</Badge>
            
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to start a pilot?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              We work directly with agency procurement teams. Request a pilot deployment 
              and our team will coordinate with your IT staff for seamless integration.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="/request-pilot">
                <Button size="lg">Request a Pilot</Button>
              </a>
              <a href="mailto:government@truthline.com">
                <Button variant="outline" size="lg">Contact Sales</Button>
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Accepting purchase orders and government contracting vehicles.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
