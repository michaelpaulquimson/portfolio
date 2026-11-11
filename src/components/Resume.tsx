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

interface SkillGroup {
  title: string
  modifier: 'core' | 'platform' | 'ai'
  skills: string[]
}

interface ResumeProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Senior Solutions Architect',
    company: 'Eclaro Business Solutions',
    period: 'Feb 2025 – Mar 2026',
    isCurrent: true,
    bullets: [
      'Guided development teams on architecture and integration decisions, aligning technical direction with business goals.',
      'Conducted code reviews focused on constructive feedback — raising the bar for quality while keeping the team moving.',
      'Collaborated with engineers and stakeholders to triage and resolve production issues.',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Eclaro Business Solutions',
    period: 'Jun 2021 – Feb 2025',
    duration: '3 yrs 11 mos',
    isCurrent: false,
    bullets: [
      'Built and shipped features end-to-end, from requirements gathering to production deployment.',
      'Introduced AI tooling into the team\'s workflow, accelerating delivery without cutting corners on quality.',
      'Wrote and maintained developer documentation to reduce knowledge silos and speed up onboarding.',
    ],
  },
  {
    title: 'Application Developer',
    company: 'AXA Philippines',
    period: 'Feb 2020 – Jun 2021',
    duration: '1 yr 4 mos',
    isCurrent: false,
    bullets: [
      'Integrated third-party APIs to expand platform capabilities and improve user experience.',
      'Worked with business analysts and designers to assess feasibility and translate requirements into working software.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Collabera Technologies',
    period: 'Jun 2019 – Feb 2020',
    duration: '8 mos',
    isCurrent: false,
    bullets: [
      'Resolved user-reported issues by digging into root cause, not just the symptom.',
      'Participated in code reviews and pair programming — learning as much as contributing.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'LakbayPH Travel Services',
    period: 'Jul 2017 – May 2019',
    duration: '1 yr 11 mos',
    isCurrent: false,
    bullets: [
      'Designed database schemas and built RESTful APIs for a live travel services platform.',
      'Developed a mobile-friendly web app that improved how customers discovered and booked services.',
    ],
  },
]

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Core',
    modifier: 'core',
    skills: ['React', 'Angular', 'TypeScript', 'Node.js', 'Flutter', 'Python'],
  },
  {
    title: 'Platform',
    modifier: 'platform',
    skills: ['AWS', 'Docker', 'MongoDB', 'REST APIs', 'Dart', 'Git', 'CI/CD', 'OpenShift'],
  },
  {
    title: 'AI & Tooling',
    modifier: 'ai',
    skills: ['OpenAI Codex', 'LLM Integration', 'Claude Code', 'AI-Assisted Development'],
  },
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
            Full-stack developer and solutions architect with {TOTAL_YEARS} years shipping production-ready systems across diverse industries. Known for picking up new technologies fast and applying them to real problems. Treats AI not as a shortcut but as a genuine force multiplier — compressing delivery timelines while keeping quality at the center.
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

        <div className="resume__block">
          <h3 className="block-title">Stack</h3>
          <div className="stack">
            {SKILL_GROUPS.map((group) => (
              <div key={group.title} className="stack__group">
                <div className="stack__title">{group.title}</div>
                <div className="stack__chips">
                  {group.skills.map((s) => (
                    <span key={s} className={`skill-chip skill-chip--${group.modifier}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume__block resume__block--split">
          <div>
            <h3 className="block-title">Education</h3>
            <div className="edu-cert__card">
              <div className="edu-cert__name">B.S. Information Technology</div>
              <div className="edu-cert__sub">Informatics College Eastwood</div>
              <div className="edu-cert__date">2013 – 2016 · Philippines</div>
            </div>
          </div>
          <div>
            <h3 className="block-title">Certifications</h3>
            <div className="edu-cert__card">
              <div className="edu-cert__name">AWS Certified Cloud Practitioner</div>
              <div className="edu-cert__sub">Amazon Web Services</div>
              <div className="edu-cert__date">Feb 2021 – Feb 2024</div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Resume
