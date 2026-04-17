import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import SectionWrapper from './SectionWrapper'
import type { Project } from '../types/Project'
import { PROJECTS, CATEGORY_FILTERS } from '../constants/projects'
import './Projects.css'

interface ProjectsProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

interface ProjectCardProps {
  project: Project
  onClick: (p: Project) => void
}

const ProjectCard = React.memo<ProjectCardProps>(({ project, onClick }) => (
  <motion.article
    className="project-card"
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    onClick={() => onClick(project)}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(project)
      }
    }}
    aria-label={`Open ${project.title} details`}
  >
    <div className="project-card__meta">
      <span>{project.year}</span>
      <span>·</span>
      <span>{project.category}</span>
    </div>
    <div className="project-card__title">{project.title}</div>
    <p className="project-card__desc">{project.description}</p>
    <div className="project-tags">
      {project.tags.slice(0, 3).map((tag) => (
        <span key={tag} className="project-tag">
          {tag}
        </span>
      ))}
      {project.tags.length > 3 && (
        <span className="project-tag">+{project.tags.length - 3}</span>
      )}
    </div>
  </motion.article>
))
ProjectCard.displayName = 'ProjectCard'

const Projects: React.FC<ProjectsProps> = ({ sectionRef }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    selectedCategory === 'all'
      ? PROJECTS.filter((p) => !p.featured)  // exclude featured when showing the featured card
      : PROJECTS.filter((p) => p.category === selectedCategory)

  const featuredProjects = PROJECTS.filter((p) => p.featured)

  const openModal = useCallback((project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }, [])

  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
        return
      }
      if (e.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      modalRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedProject, closeModal])

  const nextImage = useCallback(() => {
    if (!selectedProject?.imageGallery) return
    const len = selectedProject.imageGallery.length
    setCurrentImageIndex((i) => (i + 1) % len)
  }, [selectedProject])

  const prevImage = useCallback(() => {
    if (!selectedProject?.imageGallery) return
    const len = selectedProject.imageGallery.length
    setCurrentImageIndex((i) => (i - 1 + len) % len)
  }, [selectedProject])

  return (
    <SectionWrapper id="projects" className="projects" sectionRef={sectionRef}>
      <div className="projects__header">
        <div className="projects__section-label">// Work</div>
        <h2 className="projects__title">Featured Projects</h2>
      </div>

      <div className="projects__filters" role="group" aria-label="Filter by category">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill${selectedCategory === cat.id ? ' filter-pill--active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {selectedCategory === 'all' && featuredProjects.length > 0 && (
        <div className="projects__featured">
          {featuredProjects.map((project) => (
            <button
              key={project.id}
              className="featured-card"
              onClick={() => openModal(project)}
              aria-label={`Open ${project.title} details`}
            >
              <div>
                <div className="featured-card__badge">★ Featured</div>
                <div className="featured-card__title">{project.title}</div>
                <div className="featured-card__desc">{project.description}</div>
                <div className="project-tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Visit ${project.title} website (opens in new window)`}
                    >
                      <ExternalLink size={13} />
                      Website
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${project.title} source code on GitHub (opens in new window)`}
                    >
                      <Github size={13} />
                      Code
                    </a>
                  )}
                  {project.extraLinks?.playStore && (
                    <a
                      href={project.extraLinks.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Download on Google Play Store (opens in new window)"
                    >
                      <FaGooglePlay size={13} />
                      Play Store
                    </a>
                  )}
                  {project.extraLinks?.appStore && (
                    <a
                      href={project.extraLinks.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Download on Apple App Store (opens in new window)"
                    >
                      <FaApple size={13} />
                      App Store
                    </a>
                  )}
                </div>
              </div>
              {project.imageUrl && (
                <div className="featured-card__image">
                  <img src={project.imageUrl} alt="" aria-hidden="true" loading="lazy" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <motion.div className="projects__grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={openModal}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              aria-hidden="true"
            />
            <motion.div
              ref={modalRef}
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close project details"
              >
                ×
              </button>

              <h3 id="modal-title" className="modal-title">
                {selectedProject.title}
              </h3>

              {selectedProject.imageGallery && selectedProject.imageGallery.length > 0 && (
                <div className="modal-image-container">
                  <img
                    src={selectedProject.imageGallery[currentImageIndex]}
                    alt={`${selectedProject.title} screenshot ${currentImageIndex + 1} of ${selectedProject.imageGallery.length}`}
                    className="modal-image"
                  />
                  {selectedProject.imageGallery.length > 1 && (
                    <>
                      <button
                        className="gallery-nav gallery-nav--prev"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        className="gallery-nav gallery-nav--next"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        ›
                      </button>
                      <div className="gallery-indicators" role="tablist">
                        {selectedProject.imageGallery.map((url, i) => (
                          <button
                            key={url}
                            className={`gallery-indicator${i === currentImageIndex ? ' gallery-indicator--active' : ''}`}
                            onClick={() => setCurrentImageIndex(i)}
                            role="tab"
                            aria-selected={i === currentImageIndex}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <p className="modal-description">{selectedProject.longDescription}</p>

              <div className="modal-tags-title">Technologies</div>
              <div className="project-tags">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="modal-links">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label={`Visit ${selectedProject.title} website (opens in new window)`}
                  >
                    <ExternalLink size={15} />
                    Visit Website
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label={`View ${selectedProject.title} source code on GitHub (opens in new window)`}
                  >
                    <Github size={15} />
                    View Code
                  </a>
                )}
                {selectedProject.extraLinks?.playStore && (
                  <a
                    href={selectedProject.extraLinks.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label="Download on Google Play Store (opens in new window)"
                  >
                    <FaGooglePlay size={15} />
                    Google Play
                  </a>
                )}
                {selectedProject.extraLinks?.appStore && (
                  <a
                    href={selectedProject.extraLinks.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label="Download on Apple App Store (opens in new window)"
                  >
                    <FaApple size={15} />
                    App Store
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

export default Projects
