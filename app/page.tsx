'use client';

import { motion } from 'framer-motion';
import SpotlightCard from '@/components/SpotlightCard';
import { Github, Linkedin, Twitter, Youtube, Mail } from 'lucide-react';

const contentPillars = [
  {
    title: 'AI & Technology',
    description: 'Exploring the frontier of artificial intelligence and how it transforms creative work.',
    icon: '🤖'
  },
  {
    title: 'Health & Fitness',
    description: 'Optimizing performance and longevity through evidence-based approaches.',
    icon: '💪'
  },
  {
    title: 'Finance & Career',
    description: 'Building wealth and career success in the age of AI and automation.',
    icon: '📈'
  },
  {
    title: 'Style',
    description: 'Curated aesthetics and personal presentation that command presence.',
    icon: '👔'
  },
  {
    title: 'Self-Improvement',
    description: 'Intentional growth, productivity systems, and becoming the architect of your life.',
    icon: '🎯'
  }
];

const socialLinks = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/Christopher-Graves', label: 'GitHub' },
  { icon: Mail, href: 'mailto:christopher.graves09@gmail.com', label: 'Email' }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
};

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="grain" />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 pt-24 pb-16 max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-display text-cream mb-6 tracking-tight">
            Christopher Graves
          </h1>
          <p className="text-xl md:text-2xl text-beige max-w-3xl mx-auto font-light leading-relaxed">
            Principal Software Engineer. Co-founder of{' '}
            <span className="text-burnt font-medium">Cozmos</span>.
            Creator exploring AI, storytelling, and the art of building things that matter.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-6 mb-20"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-burnt hover:border-burnt/50 transition-all duration-300 hover:scale-110"
            >
              <link.icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* Content Pillars */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {contentPillars.map((pillar) => (
            <motion.div key={pillar.title} variants={item}>
              <SpotlightCard className="h-full">
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-2xl font-display text-cream mb-3">{pillar.title}</h3>
                <p className="text-beige/80 leading-relaxed">{pillar.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-4xl mx-auto"
        >
          <SpotlightCard>
            <h2 className="text-4xl font-display text-cream mb-6">The Journey</h2>
            <div className="space-y-4 text-beige/90 leading-relaxed">
              <p>
                By day, I architect systems at scale. By night, I build the future—one ambitious project at a time.
              </p>
              <p>
                <span className="text-burnt font-medium">Cozmos</span> is my current obsession: a marketplace connecting crypto brands with creators, built to move fast and scale faster. We&apos;re pushing to production now, onboarding our first wave of creators.
              </p>
              <p>
                I&apos;m also launching a YouTube channel that breaks the mold—cinematic, authentic, conversational. Think GQ Magazine meets the Creator Economy. No scripts, no hype. Just real stories, real tools, and real frameworks for building a life worth living.
              </p>
              <p className="text-cream font-medium">
                2026 Vision: 500 creators on Cozmos. 100K YouTube subscribers. $15-20K/month from ventures. Full-time on what I love.
              </p>
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="border-t border-cream/10 py-8 mt-20"
      >
        <div className="container mx-auto px-6 text-center text-beige/60 text-sm">
          <p>© 2026 Christopher Graves. Built with intention.</p>
        </div>
      </motion.footer>
    </div>
  );
}
