import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Award, GraduationCap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import './Resume.css'

interface ExperienceItem {
  title: string
  company: string
  location: string
  duration: string
  description: string[]
}

interface EducationItem {
  degree: string
  school: string
  duration: string
  location: string
}

interface CertificationItem {
  name: string
  date: string
}

const Resume: React.FC = () => {
  const { isDarkMode } = useTheme()
  
  // Function to calculate duration from start date to present
  const calculateDurationFromStart = (startMonth: string, startYear: number): string => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
    
    // Convert month name to number
    const monthMap: { [key: string]: number } = {
      'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
      'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
    }
    
    const startMonthNum = monthMap[startMonth]
    
    let totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonthNum)
    
    // If we haven't reached the start month in the current year, subtract a month
    if (totalMonths < 0) {
      totalMonths = 0
    }
    
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    
    if (years === 0 && months === 0) {
      return "Less than 1 month"
    } else if (years === 0) {
      return `${months} ${months === 1 ? 'mo' : 'mos'}`
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'yr' : 'yrs'}`
    } else {
      return `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const experiences: ExperienceItem[] = [
    {
      title: "Senior Solutions Architect",
      company: "Eclaro Business Solutions, Philippines",
      location: "Philippines",
      duration: `FEB 2025 - PRESENT (${calculateDurationFromStart('FEB', 2025)})`,
      description: [
        "Provide technical guidance on system development and integration",
        "Review code for alignment with architecture standards",
        "Support resolution of complex production issues"
      ]
    },
    {
      title: "Senior Full Stack Developer",
      company: "Eclaro Business Solutions, Philippines",
      location: "Philippines",
      duration: "JUN 2021 - FEB 2025 (3 yrs 11 mos)",
      description: [
        "Developed features, fixed bugs, and provided production support",
        "Maintained clear developer documentation for future reference",
        "Improved performance through debugging, refactoring, and applying best practices"
      ]
    },
    {
      title: "Application Developer",
      company: "AXA Philippines",
      location: "Philippines",
      duration: "FEB 2020 - JUN 2021 (1 yr 4 mos)",
      description: [
        "Integrated third-party APIs to enhance application functionality",
        "Assessed design feasibility based on user and software requirements",
        "Collaborated with the team to resolve development challenges"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "Collabera Technologies Private Limited, Philippines",
      location: "Philippines",
      duration: "JUN 2019 - FEB 2020 (8 mos)",
      description: [
        "Identified and fixed defects to resolve user-reported issues",
        "Participated in code reviews and pair programming to uphold quality"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "LakbayPH Travel Services Inc., Philippines",
      location: "Philippines",
      duration: "JUL 2017 - MAY 2019 (1 yr 11 mos)",
      description: [
        "Designed database schemas",
        "Built mobile-friendly website",
        "Developed and integrated RESTful APIs"
      ]
    }
  ]

  const education: EducationItem[] = [
    {
      degree: "Bachelor of Science, Information Technology",
      school: "Informatics College Eastwood",
      duration: "2013 - 2016",
      location: "Philippines"
    }
  ]

  const certifications: CertificationItem[] = [
    {
      name: "AWS Certified Cloud Practitioner",
      date: "(Feb 2021 - Feb 2024)"
    }
  ]

  const summary = "Passionate developer with 7+ years of experience in full-stack software development. Skilled in frontend and backend, including database schema design, using JavaScript, TypeScript, and Python. Familiar with cloud platforms like AWS and Google Firebase. Co-authored the development of a mobile app for a non-profit using Flutter and Dart, and continue to maintain and add new features. Enjoys solving complex problems with user-focused solutions and exploring new technologies, including AI to streamline project delivery. Always eager to learn and adapt to new challenges."

  return (
    <motion.div
      id="resume"
      className={`resume ${isDarkMode ? 'dark' : 'light'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="summary-section" variants={itemVariants}>
        <h2 className="section-title">
          <span className="title-text">Summary</span>
          <div className="title-underline"></div>
        </h2>
        <motion.p 
          className="summary-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: isDarkMode 
              ? "0 10px 30px rgba(0, 245, 255, 0.1)" 
              : "0 10px 30px rgba(37, 99, 235, 0.1)" 
          }}
        >
          {summary}
        </motion.p>
      </motion.section>

      <motion.section className="experience-section" variants={itemVariants}>
        <h2 className="section-title">
          <span className="title-text">Experience</span>
          <div className="title-underline"></div>
        </h2>
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="experience-item"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: isDarkMode 
                  ? "0 10px 30px rgba(0, 245, 255, 0.1)" 
                  : "0 10px 30px rgba(37, 99, 235, 0.1)" 
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="experience-header">
                <div className="experience-title-group">
                  <h3 className="experience-title">{exp.title}</h3>
                  <h4 className="experience-company">{exp.company}</h4>
                </div>
                <div className="experience-meta">
                  <div className="duration">
                    <Calendar size={16} />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="location">
                    <MapPin size={16} />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>
              <ul className="experience-description">
                {exp.description.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="education-certifications-row">
        <motion.section className="education-section" variants={itemVariants}>
          <h2 className="section-title">
            <span className="title-text">Education</span>
            <div className="title-underline"></div>
          </h2>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="education-item"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: isDarkMode 
                  ? "0 10px 30px rgba(0, 245, 255, 0.1)" 
                  : "0 10px 30px rgba(37, 99, 235, 0.1)" 
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="education-header">
                <GraduationCap size={20} className="education-icon" />
                <div className="education-content">
                  <h3 className="education-degree">{edu.degree}</h3>
                  <h4 className="education-school">{edu.school}</h4>
                  <div className="education-meta">
                    <span className="education-duration">{edu.duration}</span>
                    <span className="education-location">{edu.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section className="certifications-section" variants={itemVariants}>
          <h2 className="section-title">
            <span className="title-text">Certifications</span>
            <div className="title-underline"></div>
          </h2>
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="certification-item"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: isDarkMode 
                  ? "0 10px 30px rgba(0, 245, 255, 0.1)" 
                  : "0 10px 30px rgba(37, 99, 235, 0.1)" 
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="certification-header">
                <Award size={20} className="certification-icon" />
                <div className="certification-content">
                  <h3 className="certification-name">{cert.name}</h3>
                  <span className="certification-date">{cert.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </motion.div>
  )
}

export default Resume
