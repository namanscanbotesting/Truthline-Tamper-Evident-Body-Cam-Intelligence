'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { transitions } from '@/lib/styles/tokens';

/**
 * Navigation link component with subtle hover animation
 */
function NavLink({ 
  href, 
  children
}: { 
  href: string; 
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <motion.span
        className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        whileHover={{ y: -1 }}
        transition={transitions.hover}
      >
        {children}
      </motion.span>
    </Link>
  );
}

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#05070d]/80 border-b border-slate-800/50"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
            <span className="text-lg font-semibold text-slate-100">T</span>
          </div>
          <div>
            <p className="font-semibold text-slate-100 text-sm">Truthline</p>
            <p className="text-xs text-slate-500">Tamper-Evident Evidence Intelligence</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/product">Product</NavLink>
          <NavLink href="/trust">Trust & Verification</NavLink>
          <NavLink href="/government">For Agencies</NavLink>
          <NavLink href="/demo">Demo</NavLink>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link 
            href="/request-pilot"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Request a Pilot
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
                <span className="text-lg font-semibold text-slate-100">T</span>
              </div>
              <div>
                <p className="font-semibold text-slate-100 text-sm">Truthline</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Tamper-evident body camera intelligence for law enforcement agencies.
              Real-time detection, cryptographic verification, institutional trust.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/product" className="text-slate-400 hover:text-white transition">How It Works</Link></li>
              <li><Link href="/trust" className="text-slate-400 hover:text-white transition">Trust & Verification</Link></li>
              <li><Link href="/demo" className="text-slate-400 hover:text-white transition">Live Demo</Link></li>
            </ul>
          </div>

          {/* Agency Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              For Agencies
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/government" className="text-slate-400 hover:text-white transition">Deployment</Link></li>
              <li><Link href="/request-pilot" className="text-slate-400 hover:text-white transition">Request a Pilot</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Truthline. Built for institutional integrity.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CJIS-Aligned Architecture
            </span>
            <span>Self-Hosted Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
