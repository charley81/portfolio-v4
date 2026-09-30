export type NavigationDestination =
  'capabilities' | 'about' | 'skills' | 'experience' | 'work' | 'contact';

export type ContactMethod = 'email' | 'linkedin' | 'github';
export type ProjectId = 'bassment' | 'marsh_ember';
export type ResumeLocation =
  'desktop_header' | 'mobile_menu' | 'masthead' | 'about' | 'contact';

export interface NavigationItem {
  readonly id: NavigationDestination;
  readonly label: string;
  readonly index: string;
}

export interface Capability {
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

export interface SkillGroup {
  readonly category: string;
  readonly tools: string;
}

export interface ExperienceItem {
  readonly title: string;
  readonly description: string;
}

export interface Project {
  readonly id: ProjectId;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly technologies: string;
  readonly href: string;
}

export const site = {
  brand: 'christopherharley.com',
  title: 'Christopher Harley — Creative Frontend Developer',
  description:
    'I design and build expressive, accessible websites and headless commerce experiences-from high-fidelity interface design through production.',
  canonicalUrl: 'https://christopherharley.com/',
  author: 'Christopher Harley',
  location: 'Charlotte, NC / Remote',
  availability: 'Available for full-time roles, contract work, and freelance',
  menuAvailability: 'Available for full-time roles, contract, and freelance',
  email: 'chrisharley81@gmail.com',
  emailHref: 'mailto:chrisharley81@gmail.com',
  linkedInHref: 'https://www.linkedin.com/in/charley81',
  githubHref: 'https://github.com/charley81',
  resumeHref: '/resume.pdf',
} as const;

export const navigation = [
  { id: 'capabilities', label: 'Capabilities', index: '01' },
  { id: 'about', label: 'About', index: '02' },
  { id: 'skills', label: 'Skills', index: '03' },
  { id: 'experience', label: 'Experience', index: '04' },
  { id: 'work', label: 'Work', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
] as const satisfies readonly NavigationItem[];

export const masthead = {
  heading: 'Creative Frontend Developer',
  description: site.description,
} as const;

export const capabilities = [
  {
    index: '01',
    title: 'Creative Frontend Development',
    description:
      'Expressive, responsive interfaces built with strong typography, thoughtful interaction, and production-ready frontend architecture.',
  },
  {
    index: '02',
    title: 'Design Engineering',
    description:
      'High-fidelity interface design, scalable design systems, accessibility, and careful design-to-code execution.',
  },
  {
    index: '03',
    title: 'Headless Commerce',
    description:
      "Custom storefronts using Shopify's Storefront API, Next.js, structured product data, and flexible editorial content.",
  },
  {
    index: '04',
    title: 'Content-Driven Websites',
    description:
      'Fast marketing and editorial websites powered by Astro, Next.js, Sanity, and maintainable content models.',
  },
] as const satisfies readonly Capability[];

export const aboutParagraphs = [
  'I’m Christopher Harley, a designer and frontend developer who turns ambitious ideas into polished digital experiences. With six years of experience across UX design and development, I’m at my best owning projects from concept through deployment—shaping the strategy, designing the interface, and engineering the finished product without losing sight of performance, accessibility, or the original creative vision.',
  'Before working in digital design and development, I spent ten years in the military as a paratrooper, eventually overseeing a Department of Defense training program for a battalion of more than 400 soldiers and directly leading four junior NCOs. That experience still shapes how I work: disciplined, detail-focused, calm under pressure, and accountable for the outcome.',
  'Away from the screen, I’m a drummer and electronic music producer—two creative practices that keep me experimenting with rhythm, structure, and new ideas. I’m currently open to full-time agency roles, freelance collaborations, and contract opportunities with teams that care about thoughtful design, strong engineering, and work that feels genuinely well made.',
] as const;

export const skills = [
  { category: 'Languages', tools: 'TypeScript · JavaScript · HTML · CSS' },
  {
    category: 'Frontend',
    tools:
      'React · Next.js · Astro · Tailwind CSS · Responsive UI · Accessibility',
  },
  {
    category: 'Commerce & Content',
    tools:
      'Shopify Storefront API · Headless Shopify · Sanity · GROQ · Structured Content',
  },
  {
    category: 'Design',
    tools:
      'Figma · UX/UI Design · Design Systems · Prototyping · Design-to-Code',
  },
  {
    category: 'Quality & Delivery',
    tools:
      'Lighthouse · Performance · SEO · Accessibility Testing · Git · GitHub · Deployment',
  },
  {
    category: 'AI-Assisted Workflow',
    tools:
      'Figma Agents · Figma MCP · OpenAI · AI-Assisted Development · QA Automation',
  },
] as const satisfies readonly SkillGroup[];

export const experience = [
  {
    title: 'Independent Creative Developer',
    description:
      'Designing and building polished marketing, hospitality, and headless commerce experiences from concept through deployment.',
  },
  {
    title: 'Software Engineering',
    description:
      'Previous software engineering experience inside a Fortune 500 organization, contributing within a large professional development environment.',
  },
  {
    title: 'Military Service',
    description:
      'Ten years of service that developed discipline, adaptability, responsibility, and clear communication.',
  },
] as const satisfies readonly ExperienceItem[];

export const projects = [
  {
    id: 'bassment',
    category: 'MUSIC & CULTURE · LIVE PROJECT',
    title: 'BASSMENT',
    description:
      'An immersive digital home for an underground music venue, organized around events, artists, sound, and the physical character of the space. Built to capture the raw energy of live music culture.',
    technologies: 'Next.js · Sanity · TypeScript · Framer Motion',
    href: 'https://clubbassment.com/',
  },
  {
    id: 'marsh_ember',
    category: 'HOSPITALITY · LIVE PROJECT',
    title: 'Marsh & Ember',
    description:
      'A warm, editorial restaurant experience connecting seasonal food, hospitality, private dining, events, and reservations. Lighthouse performance 99, accessibility 100.',
    technologies: 'Astro · Sanity · TypeScript · Tailwind CSS',
    href: 'https://marshandember.netlify.app/',
  },
] as const satisfies readonly Project[];

export const contact = {
  heading: "Let's build something considered.",
  description:
    "I'm currently open to creative frontend, frontend development, design engineering, and headless commerce opportunities-including full-time roles, contract engagements, and select freelance projects.",
  successMessage: 'Thanks for reaching out, I’ll be in touch immediately',
  failureMessage:
    'Something went wrong. Please try again or email me directly at chrisharley81@gmail.com.',
} as const;
