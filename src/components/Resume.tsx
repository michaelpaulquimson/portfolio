import React from 'react'
import SectionWrapper from './SectionWrapper'
import { PROJECTS } from '../constants/projects'
import './Resume.css'

interface ExperienceItem {
  title: string
  company: string
  period: string
  duration?: string
  bullets: string[]
  isCurrent: boolean
}

interface JourneyStep {
  years: string
  duration: string
  name: string
  text: string
  isNow: boolean
}

interface SkillItem {
  name: string
  line: string
}

interface ToolGroup {
  label: string
  items: string[]
  isAi?: boolean
}

interface ResumeProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const JOURNEY: JourneyStep[] = [
  {
    years: '2017 – 2021',
    duration: '3 yrs 10 mos',
    name: 'Hard coder',
    text: 'Wrote and fixed code by hand.',
    isNow: false,
  },
  {
    years: '2021 – 2025',
    duration: '3 yrs 8 mos',
    name: 'AI-assisted',
    text: 'Started using AI tools to speed up routine work.',
    isNow: false,
  },
  {
    years: '2025 – Present',
    duration: '1 yr 9 mos',
    name: 'Working with AI agents',
    text: 'Plan first, split work into small tasks, run AI agents side by side, then check with tests and a second review.',
    isNow: true,
  },
]

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Senior Solutions Architect',
    company: 'Eclaro Business Solutions',
    period: 'Feb 2025 – Nov 2026',
    duration: '1 yr 9 mos',
    isCurrent: true,
    bullets: [
      'Adopted AI agents in daily work: plan first, review every result.',
      'Set up simple checks and notes to keep quality high as we moved faster.',
      'Helped teams choose a technical direction and fix live issues fast.',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Eclaro Business Solutions',
    period: 'Jun 2021 – Feb 2025',
    duration: '3 yrs 8 mos',
    isCurrent: false,
    bullets: [
      'Built and launched features with product and design, from idea to release.',
      'Fixed bugs, improved stability, and wrote guides for new teammates.',
      'Introduced AI coding tools to the team, my first step toward agents.',
    ],
  },
  {
    title: 'Application Developer',
    company: 'AXA Philippines',
    period: 'Feb 2020 – Jun 2021',
    duration: '1 yr 4 mos',
    isCurrent: false,
    bullets: ['Connected the platform to outside services (APIs) and built new features.'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Collabera Technologies',
    period: 'Jun 2019 – Feb 2020',
    duration: '8 mos',
    isCurrent: false,
    bullets: ['Fixed user-reported issues at the source; shipped features step by step.'],
  },
  {
    title: 'Full Stack Developer',
    company: 'LakbayPH',
    period: 'Jul 2017 – May 2019',
    duration: '1 yr 10 mos',
    isCurrent: false,
    bullets: ['Built the database, back end and booking site for a live travel platform.'],
  },
]

const SKILLS: SkillItem[] = [
  { name: 'Ship products', line: 'Idea to launch, solo or in a team.' },
  { name: 'Direct AI agents', line: 'Plan, delegate, review their work.' },
  { name: 'Solution design', line: 'Choose a simple, sensible structure.' },
  { name: 'Quality control', line: 'Tests, reviews, root-cause fixes.' },
  { name: 'Automation', line: 'Automated tests and deployments.' },
]

const TOOLS: ToolGroup[] = [
  { label: 'AI', items: ['Claude Code', 'Codex', 'Gemini'], isAi: true },
  { label: 'Languages', items: ['JavaScript', 'TypeScript', 'Dart'] },
  { label: 'Web', items: ['React', 'Next.js', 'Angular'] },
  { label: 'Backend', items: ['Node.js', 'Hono', 'Express'] },
  { label: 'Database', items: ['PostgreSQL (Supabase)', 'MongoDB'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'Cloudflare', 'DigitalOcean', 'Docker', 'CI/CD'] },
  { label: 'Mobile', items: ['Flutter (iOS & Android)'] },
]

const calculateTotalYears = (): string => {
  const start = new Date(2017, 6)
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return `${Math.floor(totalMonths / 12)}+`
}

const TOTAL_YEARS = calculateTotalYears()
const COMPANY_COUNT = new Set(EXPERIENCE.map((e) => e.company)).size

const STATS = [
  { value: TOTAL_YEARS, label: 'Years shipping' },
  { value: String(COMPANY_COUNT), label: 'Companies' },
  { value: String(PROJECTS.length), label: 'Projects shown below' },
]

const Resume: React.FC<ResumeProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="resume" className="resume" sectionRef={sectionRef}>
      <div className="resume__inner">
        <header className="resume__header">
          <div className="section-label">
            <span className="section-label__num">01</span> Experience
          </div>
          <h2 className="resume__title">
            {TOTAL_YEARS} years building software that <em>matters.</em>
          </h2>
          <p className="resume__summary">
            Software engineer with {TOTAL_YEARS} years building web and mobile apps. I started as a hard coder, writing every line by hand, and now work with AI agents, which help me and my team deliver faster. I've taken products from idea to launch, on my own and in teams, and I pick up new languages and tools as the work needs. I enjoy sharing what works and building together.
          </p>
        </header>

        <dl className="stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__value">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="resume__block">
          <h3 className="block-title">Journey</h3>
          <ol className="journey">
            {JOURNEY.map((step) => (
              <li key={step.name} className={`journey__step${step.isNow ? ' journey__step--now' : ''}`}>
                <div className="journey__when">
                  <span>{step.years}</span>
                  <span className="journey__duration">{step.duration}</span>
                </div>
                <div className="journey__name">{step.name}</div>
                <p className="journey__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="resume__block">
          <h3 className="block-title">Work history</h3>
          <ol className="roles">
            {EXPERIENCE.map((exp) => (
              <li key={exp.company + exp.period} className={`role${exp.isCurrent ? ' role--current' : ''}`}>
                <div className="role__when">
                  <span className="role__period">{exp.period}</span>
                  {exp.duration && <span className="role__duration">{exp.duration}</span>}
                  {exp.isCurrent && <span className="role__badge">Most recent</span>}
                </div>
                <div className="role__what">
                  <div className="role__company">{exp.company}</div>
                  <div className="role__title">{exp.title}</div>
                </div>
                <ul className="role__bullets">
                  {exp.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="resume__block resume__block--split">
          <div>
            <h3 className="block-title">Skills</h3>
            <ul className="skills">
              {SKILLS.map((sk) => (
                <li key={sk.name} className="skill-row">
                  <div className="skill-row__name">{sk.name}</div>
                  <div className="skill-row__line">{sk.line}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="block-title">Tools</h3>
            <ul className="tools">
              {TOOLS.map((group) => (
                <li key={group.label} className="tool-row">
                  <div className="tool-row__label">{group.label}</div>
                  <div className="stack__chips">
                    {group.items.map((item) => (
                      <span key={item} className={`skill-chip${group.isAi ? ' skill-chip--ai' : ''}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="resume__block resume__block--split">
          <div>
            <h3 className="block-title">Education</h3>
            <div className="edu-cert__card">
              <div className="edu-cert__name">BS Information Technology</div>
              <div className="edu-cert__sub">Informatics College Eastwood</div>
              <div className="edu-cert__date">2013 – 2016</div>
            </div>
          </div>
          <div>
            <h3 className="block-title">Certification</h3>
            <div className="edu-cert__card">
              <div className="edu-cert__name">AWS Certified Cloud Practitioner</div>
              <div className="edu-cert__sub">Certification</div>
              <div className="edu-cert__date">2021</div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Resume
