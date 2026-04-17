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
    period: 'FEB 2025 – Present',
    isCurrent: true,
    bullets: [
      'Provide technical guidance on system development and integration',
      'Review code for alignment with architecture standards',
      'Support resolution of complex production issues',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Eclaro Business Solutions',
    period: 'JUN 2021 – FEB 2025 · 3 yrs 11 mos',
    isCurrent: false,
    bullets: [
      'Developed features, fixed bugs, and provided production support',
      'Maintained clear developer documentation for future reference',
      'Improved performance through debugging and refactoring',
    ],
  },
  {
    title: 'Application Developer',
    company: 'AXA Philippines',
    period: 'FEB 2020 – JUN 2021 · 1 yr 4 mos',
    isCurrent: false,
    bullets: [
      'Integrated third-party APIs to enhance application functionality',
      'Assessed design feasibility based on requirements',
      'Collaborated with the team to resolve development challenges',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Collabera Technologies',
    period: 'JUN 2019 – FEB 2020 · 8 mos',
    isCurrent: false,
    bullets: [
      'Identified and fixed defects to resolve user-reported issues',
      'Participated in code reviews and pair programming',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'LakbayPH Travel Services',
    period: 'JUL 2017 – MAY 2019 · 1 yr 11 mos',
    isCurrent: false,
    bullets: [
      'Designed database schemas and built mobile-friendly web app',
      'Developed and integrated RESTful APIs',
    ],
  },
]

const PRIMARY_SKILLS = ['React', 'TypeScript', 'Node.js', 'Swift', 'Flutter', 'Python']
const OTHER_SKILLS = [
  'React Native', 'PostgreSQL', 'AWS', 'Firebase', 'Docker',
  'GraphQL', 'REST APIs', 'Dart', 'Git', 'Vite',
]

const calculateTotalYears = (): string => {
  const start = new Date(2017, 6)
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return `${Math.floor(totalMonths / 12)}+`
}

const Resume: React.FC<ResumeProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="resume" className="resume" sectionRef={sectionRef}>
      <div className="resume__header">
        <div className="resume__section-label">// Experience</div>
        <h2 className="resume__title">
          {calculateTotalYears()} Years Building
          <br />
          Software That Matters
        </h2>
        <p className="resume__summary">
          Passionate full-stack engineer spanning frontend, backend, and mobile. Skilled in
          JavaScript, TypeScript, and Python across cloud platforms. Co-built a Flutter app
          serving a non-profit community.
        </p>
      </div>

      <div className="resume__body">
        <div>
          <div className="timeline__col-title">Work History</div>
          <div className="timeline">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="timeline__item">
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
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
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
