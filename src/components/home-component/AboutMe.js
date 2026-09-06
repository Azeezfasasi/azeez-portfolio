'use client';

import { ArrowUpRight, Check, Loader, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

const DEFAULT_CONTENT = {
  eyebrow: 'About me',
  title: 'I turn complex product ideas into fast, thoughtful experiences.',
  paragraphs: [
    'I am a Product-Focused Frontend Engineer with over 5 years of experience architecting, building, and optimizing scalable web applications. My core expertise lies in crafting high-performance user interfaces using React, Next.js, and Tailwind CSS, backed by robust server-side integrations using Node.js and MongoDB.',
    'Throughout my career, I have focused on writing clean, modular code, optimizing web performance and Core Web Vitals, and translating complex business requirements into seamless, responsive user experiences. Having managed over 90 repositories and deployed numerous live production systems, I treat version control, performance architecture, and clean UI state management as first-class citizens.',
  ],
  expertise: [
    { label: 'Frontend', items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3'] },
    { label: 'Backend & DB', items: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs'] },
    { label: 'Tools & Workflow', items: ['Git', 'GitHub', 'CI/CD', 'Vercel Deployment', 'SEO Optimization'] },
  ],
  availability: 'Open to permanent, full-time roles in Germany, Europe, or North America. Available for relocation or remote opportunities.',
  email: 'info@azeezportfolio.com',
};

export default function AboutMe() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about-me')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) setContent(data.data);
      })
      .catch((error) => console.error('Failed to fetch About Me content:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="bg-slate-950 py-20"><div className="flex justify-center"><Loader className="h-8 w-8 animate-spin text-cyan-400" /></div></section>;

  return (
    <section id="about-me" className="overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:px-10">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">{content.eyebrow}</p>
          <h2 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{content.title}</h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-slate-300 sm:text-lg">
            {content.paragraphs?.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
          </div>
          <div className="mt-10 border-l-2 border-cyan-400 pl-5 text-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">Currently available</p>
            <p className="mt-2 max-w-xl leading-7">{content.availability}</p>
          </div>
          <a href={`mailto:${content.email}`} className="mt-10 inline-flex items-center gap-3 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
            <Mail className="h-5 w-5" /> Let&apos;s connect <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
        <div className="border-t border-slate-700 pt-8 lg:border-l lg:border-t-0 lg:pl-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Technical expertise</p>
          <div className="mt-7 space-y-8">
            {content.expertise?.map((group) => (
              <div key={group.label}>
                <h3 className="text-xl font-semibold text-white">{group.label}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.items?.map((item) => <li key={item} className="flex items-center gap-3 text-slate-300"><Check className="h-4 w-4 shrink-0 text-cyan-400" />{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-slate-700 pt-6 text-sm text-slate-400"><span className="text-2xl font-bold text-white">90+</span><span className="ml-3">repositories managed and production systems shipped</span></div>
        </div>
      </div>
    </section>
  );
}
