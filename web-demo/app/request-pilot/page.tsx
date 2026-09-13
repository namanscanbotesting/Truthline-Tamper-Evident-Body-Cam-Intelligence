'use client';

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { Header, Footer } from '@/components/ui/navigation';
import { Section, Container } from '@/components/ui/layout';
import { SectionHeading, Badge, Card, Button } from '@/components/ui/common';
import { transitions } from '@/lib/styles/tokens';

/**
 * Request a Pilot Page
 * Qualifying form + calendar booking for B2G sales motion
 */

interface FormData {
  agencyName: string;
  agencyType: string;
  officerCount: string;
  currentBodyCamVendor: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  timeline: string;
  budgetStatus: string;
  deploymentInterest: string[];
  additionalNotes: string;
}

export default function RequestPilotPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    agencyName: '',
    agencyType: '',
    officerCount: '',
    currentBodyCamVendor: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    timeline: '',
    budgetStatus: '',
    deploymentInterest: [],
    additionalNotes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      deploymentInterest: prev.deploymentInterest.includes(value)
        ? prev.deploymentInterest.filter(v => v !== value)
        : [...prev.deploymentInterest, value],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // In production, this would submit to your CRM/backend
    console.log('Pilot request submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen bg-[#05070d]">
        <Header />
        
        <section className="pt-32 pb-16">
          <Container size="narrow">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h1 className="text-3xl font-semibold text-white md:text-4xl">
                Request received.
              </h1>
              
              <p className="max-w-lg mx-auto text-slate-400">
                Thank you for your interest in Truthline. Our team will review your request 
                and reach out within 2 business days to discuss next steps.
              </p>

              <div className="pt-8">
                <a href="/">
                  <Button variant="outline">Return to Home</Button>
                </a>
              </div>
            </motion.div>
          </Container>
        </section>

        <Footer />
      </div>
    );
  }

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
            <Badge variant="info">Request a Pilot</Badge>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Bring Truthline to your agency.
            </h1>
            <p className="max-w-2xl mx-auto text-base text-slate-400">
              Tell us about your agency and deployment needs. We'll coordinate with your 
              IT team to ensure seamless integration during the pilot period.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Progress indicator */}
      <Section className="py-8">
        <Container>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > s ? 'bg-sky-500' : 'bg-slate-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            {step === 1 && 'Agency Information'}
            {step === 2 && 'Contact Details'}
            {step === 3 && 'Deployment Preferences'}
          </p>
        </Container>
      </Section>

      {/* Form */}
      <Section className="py-16">
        <Container size="narrow">
          <form onSubmit={handleSubmit}>
            <Card className="p-8 md:p-12">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Agency Information</h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Agency Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.agencyName}
                        onChange={(e) => handleChange('agencyName', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="e.g., Springfield Police Department"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Agency Type *
                      </label>
                      <select
                        required
                        value={formData.agencyType}
                        onChange={(e) => handleChange('agencyType', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="">Select type</option>
                        <option value="municipal">Municipal Police</option>
                        <option value="county">County Sheriff</option>
                        <option value="state">State Police</option>
                        <option value="federal">Federal Agency</option>
                        <option value="university">University Police</option>
                        <option value="transit">Transit Authority</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Number of Officers *
                      </label>
                      <select
                        required
                        value={formData.officerCount}
                        onChange={(e) => handleChange('officerCount', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="">Select range</option>
                        <option value="1-25">1-25 officers</option>
                        <option value="26-100">26-100 officers</option>
                        <option value="101-500">101-500 officers</option>
                        <option value="501-1000">501-1,000 officers</option>
                        <option value="1000+">1,000+ officers</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Current Body Camera Vendor (if applicable)
                      </label>
                      <input
                        type="text"
                        value={formData.currentBodyCamVendor}
                        onChange={(e) => handleChange('currentBodyCamVendor', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="e.g., Axon, Motorola Solutions, WatchGuard"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => setStep(2)}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleChange('contactName', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title / Role *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleChange('contactName', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="e.g., Chief of Police, IT Director"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="official@agency.gov"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project Timeline *
                      </label>
                      <select
                        required
                        value={formData.timeline}
                        onChange={(e) => handleChange('timeline', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate (within 30 days)</option>
                        <option value="quarter">This Quarter</option>
                        <option value="6months">Within 6 Months</option>
                        <option value="exploring">Just Exploring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Budget Status *
                      </label>
                      <select
                        required
                        value={formData.budgetStatus}
                        onChange={(e) => handleChange('budgetStatus', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="">Select status</option>
                        <option value="approved">Budget Approved</option>
                        <option value="pending">Budget Pending Approval</option>
                        <option value="grant">Seeking Grant Funding</option>
                        <option value="exploring">Exploring Options</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-white mb-6">Deployment Preferences</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Deployment Model Interest *
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { value: 'on-premise', label: 'On-Premise Server', desc: 'Deploy on your existing hardware' },
                        { value: 'govcloud', label: 'AWS GovCloud', desc: 'FedRAMP-authorized cloud' },
                        { value: 'azure-gov', label: 'Azure Government', desc: 'Microsoft GovCloud' },
                        { value: 'air-gapped', label: 'Air-Gapped', desc: 'Fully isolated network' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                            formData.deploymentInterest.includes(option.value)
                              ? 'border-sky-800 bg-sky-950/30'
                              : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.deploymentInterest.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-300">{option.label}</p>
                            <p className="text-xs text-slate-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleChange('additionalNotes', e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                      placeholder="Tell us about any specific requirements, use cases, or questions..."
                    />
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-400">
                      By submitting this form, you agree to be contacted by our team regarding 
                      your pilot request. We respect your privacy and will never share your 
                      information with third parties.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit">
                      Submit Request
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          </form>
        </Container>
      </Section>

      {/* Alternative contact */}
      <Section className="py-16">
        <Container size="narrow">
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-400">
              Prefer to speak directly? Contact our government sales team:
            </p>
            <a
              href="mailto:government@truthline.com"
              className="text-base font-semibold text-sky-400 hover:text-sky-300"
            >
              government@truthline.com
            </a>
            <p className="text-xs text-slate-500">
              Accepting purchase orders and government contracting vehicles.
            </p>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
