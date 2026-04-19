import React from 'react'
import SectionWrapper from './SectionWrapper'
import './Resume.css'

interface ExperienceItem {
  title: string
  company: string
  period: string
  bullets: string[]
  isCurrent: boolean
}

interface ResumeProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Senior Solutions Architect',
    company: 'Eclaro Business Solutions',
    period: 'FEB 2025 – MAR 2026',
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
    period: 'JUN 2021 – FEB 2025 · 3 yrs 11 mos',
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
    period: 'FEB 2020 – JUN 2021 · 1 yr 4 mos',
    isCurrent: false,
    bullets: [
      'Integrated third-party APIs to expand platform capabilities and improve user experience.',
      'Worked with business analysts and designers to assess feasibility and translate requirements into working software.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Collabera Technologies',
    period: 'JUN 2019 – FEB 2020 · 8 mos',
    isCurrent: false,
    bullets: [
      'Resolved user-reported issues by digging into root cause, not just the symptom.',
      'Participated in code reviews and pair programming — learning as much as contributing.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'LakbayPH Travel Services',
    period: 'JUL 2017 – MAY 2019 · 1 yr 11 mos',
    isCurrent: false,
    bullets: [
      'Designed database schemas and built RESTful APIs for a live travel services platform.',
      'Developed a mobile-friendly web app that improved how customers discovered and booked services.',
    ],
  },
]

const PRIMARY_SKILLS = ['React', 'Angular', 'TypeScript', 'Node.js', 'Flutter', 'Python']
const OTHER_SKILLS = [
  'AWS', 'Docker', 'MongoDB', 'REST APIs', 'Dart', 'Git', 'CI/CD', 'OpenShift',
]
const AI_SKILLS = [
  'OpenAI Codex', 'LLM Integration', 'Claude Code', 'AI-Assisted Development',
]

const calculateTotalYears = (): string => {
  const start = new Date(2017, 6)
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return `${Math.floor(totalMonths / 12)}+`
}

const TOTAL_YEARS = calculateTotalYears()

const Resume: React.FC<ResumeProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="resume" className="resume" sectionRef={sectionRef}>
      <div className="resume__header">
        <div className="resume__section-label">// Experience</div>
        <h2 className="resume__title">
          {TOTAL_YEARS} Years Building
          <br />
          Software That Matters
        </h2>
        <p className="resume__summary">
          Full-stack developer and solutions architect with 8+ years shipping production-ready systems across diverse industries. Known for picking up new technologies fast and applying them to real problems. Treats AI not as a shortcut but as a genuine force multiplier — compressing delivery timelines while keeping quality at the center.
        </p>
      </div>

      <div className="resume__body">
        <div>
          <div className="timeline__col-title">Work History</div>
          <div className="timeline">
            {EXPERIENCE.map((exp, i) => (
              <div key={exp.company + exp.period} className="timeline__item">
                <div className="timeline__spine">
                  <div
                    className={`timeline__dot${exp.isCurrent ? '' : ' timeline__dot--past'}`}
                  />
                  {i < EXPERIENCE.length - 1 && <div className="timeline__line" />}
                </div>
                <div className="timeline__content">
                  <div className="timeline__company">{exp.company}</div>
                  <div className="timeline__role">{exp.title}</div>
                  <div className="timeline__period">{exp.period}</div>
                  <ul className="timeline__bullets">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="skills__col-title">Skills</div>
          <div className="skills__grid">
            {PRIMARY_SKILLS.map((s) => (
              <span key={s} className="skill-chip skill-chip--primary">
                {s}
              </span>
            ))}
            {OTHER_SKILLS.map((s) => (
              <span key={s} className="skill-chip">
                {s}
              </span>
            ))}
          </div>
          <div className="skills__col-title skills__col-title--ai">AI & Tooling</div>
          <div className="skills__grid">
            {AI_SKILLS.map((s) => (
              <span key={s} className="skill-chip skill-chip--ai">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="resume__bottom">
        <div>
          <div className="edu-cert__col-title">Education</div>
          <div className="edu-cert__card">
            <div className="edu-cert__name">B.S. Information Technology</div>
            <div className="edu-cert__sub">Informatics College Eastwood</div>
            <div className="edu-cert__date">2013 – 2016 · Philippines</div>
          </div>
        </div>

        <div>
          <div className="edu-cert__col-title">Certifications</div>
          <div className="edu-cert__card">
            <div className="edu-cert__name">AWS Certified Cloud Practitioner</div>
            <div className="edu-cert__date">Feb 2021 – Feb 2024</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Resume
