'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container } from '@/components/ui/layout';
import { SectionHeading, Badge, Card, Button } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';

/**
 * For Agencies / Government Page
 * B2G-specific: deployment model, compliance posture, procurement contact
 */

export default function GovernmentPage() {
  const [activeTab, setActiveTab] = useState<'deployment' | 'security' | 'compliance'>('deployment');

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
            <div className="inline-flex items-center gap-2 p-1 rounded-full border border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setActiveTab('deployment')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                  activeTab === 'deployment'
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Deployment
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                  activeTab === 'security'
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                  activeTab === 'compliance'
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Compliance
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Tab content */}
      {activeTab === 'deployment' && (
        <Section className="py-16">
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
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Your infrastructure. Your control.
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Truthline deploys entirely within your agency's existing infrastructure. 
                    No cloud dependencies. No external data transfers. No third-party access 
                    to sensitive footage.
                  </p>
                </div>

                <Card>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Deployment Options</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-900/30 border border-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">On-Premise Server</p>
                        <p className="text-sm text-slate-500">Deploy on your existing server hardware in your secure facility</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-900/30 border border-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Private Cloud (GovCloud)</p>
                        <p className="text-sm text-slate-500">AWS GovCloud, Azure Government, or other FedRAMP environments</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-sky-900/30 border border-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Air-Gapped Deployment</p>
                        <p className="text-sm text-slate-500">Fully isolated networks with no external connectivity</p>
                      </div>
                    </li>
                  </ul>
                </Card>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4">Technical Requirements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">CPU</p>
                      <p className="text-slate-300">8+ cores (16+ recommended)</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">RAM</p>
                      <p className="text-slate-300">32GB minimum</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">GPU</p>
                      <p className="text-slate-300">NVIDIA T4 or equivalent</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Storage</p>
                      <p className="text-slate-300">SSD with 500GB+ available</p>
                    </div>
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
                    {/* Agency boundary */}
                    <div className="rounded-2xl border-2 border-dashed border-slate-700 p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 text-center">
                        Agency Perimeter
                      </p>
                      
                      <div className="space-y-4">
                        {/* Body cameras */}
                        <div className="flex items-center justify-center gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center">
                              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 text-center">Body Cameras</p>

                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>

                        {/* Truthline server */}
                        <div className="rounded-xl border border-sky-800 bg-sky-950/30 p-4">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg border border-sky-700 bg-sky-900/50 flex items-center justify-center">
                              <span className="text-sm font-bold text-sky-400">T</span>
                            </div>
                            <span className="text-sm font-semibold text-sky-300">Truthline Server</span>
                          </div>
                          <p className="text-xs text-slate-500 text-center">Detection + Verification Layer</p>
                        </div>

                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>

                        {/* Evidence storage */}
                        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
                          <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm font-semibold text-slate-300">Evidence Storage</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* External blockchain */}
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>

                    <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-4">
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
        <Section className="py-16">
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
                <StaggerItem>
                  <Card>
                    <div className="w-10 h-10 rounded-xl border border-emerald-800 bg-emerald-950/30 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Encryption at Rest</h3>
                    <p className="text-sm text-slate-400">AES-256 encryption for all stored evidence and metadata</p>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card>
                    <div className="w-10 h-10 rounded-xl border border-sky-800 bg-sky-950/30 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Encryption in Transit</h3>
                    <p className="text-sm text-slate-400">TLS 1.3 for all network communications</p>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card>
                    <div className="w-10 h-10 rounded-xl border border-violet-800 bg-violet-950/30 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Audit Logging</h3>
                    <p className="text-sm text-slate-400">Comprehensive logs of all system access and actions</p>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card>
                    <div className="w-10 h-10 rounded-xl border border-amber-800 bg-amber-950/30 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Role-Based Access</h3>
                    <p className="text-sm text-slate-400">Granular permissions based on role and clearance level</p>
                  </Card>
                </StaggerItem>
              </StaggerGrid>
            </div>
          </Container>
        </Section>
      )}

      {activeTab === 'compliance' && (
        <Section className="py-16">
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
                  While we don't claim certification until formally audited, our design decisions 
                  are guided by these standards from day one.
                </p>
              </motion.div>

              <Card>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-slate-300">CJIS</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">CJIS Security Policy</h3>
                      <p className="text-sm text-slate-400">
                        Criminal Justice Information Services security requirements for handling 
                        FBI criminal justice information. Our architecture supports agencies in 
                        maintaining CJIS compliance through on-premise deployment and strict 
                        access controls.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-slate-300">FedRAMP</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">FedRAMP Ready</h3>
                      <p className="text-sm text-slate-400">
                        When deployed on FedRAMP-authorized cloud infrastructure (AWS GovCloud, 
                        Azure Government), Truthline inherits the underlying platform's 
                        FedRAMP authorization.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-slate-300">FRE</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">Federal Rules of Evidence</h3>
                      <p className="text-sm text-slate-400">
                        Our cryptographic verification model aligns with FRE Rule 901(b)(9) for 
                        authentication of digital evidence through hashing and blockchain-based 
                        timestamping.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-slate-300">State</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">State Record Retention</h3>
                      <p className="text-sm text-slate-400">
                        Configurable retention policies to comply with state-specific body camera 
                        footage retention requirements. Automatic archival and deletion workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="rounded-2xl border border-amber-800 bg-amber-950/20 p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-400 mb-1">Compliance Disclaimer</p>
                    <p className="text-sm text-slate-400">
                      Truthline is designed to support compliance with the frameworks listed above, 
                      but we do not claim formal certification until completing independent audits. 
                      We work with each agency's legal and compliance teams to ensure deployment 
                      meets their specific requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Procurement CTA */}
      <Section className="py-32">
        <Container size="narrow">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 text-center">
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

// Helper components for staggered grid
function StaggerGrid({ children, columns = 2, className = '' }: { children: React.ReactNode; columns?: number; className?: string }) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${columnClasses[columns as keyof typeof columnClasses]} ${className}`}>
      {children}
    </div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={transitions.reveal}
      className={className}
    >
      {children}
    </motion.div>
  );
}
