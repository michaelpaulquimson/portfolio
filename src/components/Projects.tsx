import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Layers, Filter } from 'lucide-react'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'
import type { Project } from '../types/Project'
import { PROJECTS, CATEGORY_FILTERS } from '../constants/projects'
import './Projects.css'

/**
 * Projects Component
 *
 * Displays a filterable grid of portfolio projects with category filters,
 * featured projects section, and detailed project modals.
 *
 * Features:
 * - Category-based filtering
 * - Featured projects showcase
 * - Modal with detailed project information
 * - Responsive grid layout
 * - Smooth animations
 */
const Projects: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory)

  const featuredProjects = PROJECTS.filter(p => p.featured)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }


  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }

  const handleNextImage = () => {
    if (selectedProject?.imageGallery) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.imageGallery!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handlePrevImage = () => {
    if (selectedProject?.imageGallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.imageGallery!.length - 1 : prev - 1
      )
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <motion.section
      id="projects"
      className={`projects ${isDarkMode ? 'dark' : 'light'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      aria-label="Portfolio projects"
    >
      {/* Header */}
      <motion.div
        className="projects-header"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="section-label" aria-hidden="true">
          <Layers size={20} />
          <span>Portfolio</span>
        </div>
        <h2 className="section-title">
          <span className="title-main">Featured Work</span>
          <span className="title-accent"> & Projects</span>
        </h2>
        <p className="section-description">
          A selection of projects showcasing my expertise in full-stack development,
          mobile applications, and innovative web solutions.
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        className="category-filters"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        role="toolbar"
        aria-label="Filter projects by category"
      >
        <div className="filter-label" aria-hidden="true">
          <Filter size={16} />
          <span>Filter by:</span>
        </div>
        <div className="filter-buttons" role="group" aria-label="Project categories">
          {CATEGORY_FILTERS.map((cat) => (
            <motion.button
              key={cat.id}
              className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-pressed={selectedCategory === cat.id}
              aria-label={`Filter by ${cat.label}`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Projects Section */}
      {selectedCategory === 'all' && (
        <motion.div
          className="featured-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="featured-title">Featured Projects</h3>
          <div className="featured-grid" role="list" aria-label="Featured projects">
            {featuredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className="featured-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                onClick={() => handleProjectClick(project)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleProjectClick(project)
                  }
                }}
                aria-label={`${project.title}: ${project.description}`}
              >
                <div className="featured-card-bg" aria-hidden="true"></div>
                {project.imageUrl && (
                  <div className="featured-card-image">
                    <img src={project.imageUrl} alt={`${project.title} preview`} />
                  </div>
                )}
                <div className="featured-card-content">
                  <div className="featured-card-header">
                    <span className="project-year">{project.year}</span>
                    <span className="project-category">{project.category}</span>
                  </div>
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags" role="list" aria-label="Technologies used">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag" role="listitem">{tag}</span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="tag tag-more" role="listitem">+{project.tags.length - 3}</span>
                    )}
                  </div>
                  <div className="project-links">
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View website of ${project.title} (opens in new window)`}
                        title="Visit Website"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${project.githubUrl.includes('play.google.com') ? 'Download on Google Play Store' : `View source code of ${project.title} on GitHub`} (opens in new window)`}
                        title={project.githubUrl.includes('play.google.com') ? 'Get it on Google Play' : 'View on GitHub'}
                      >
                        {project.githubUrl.includes('play.google.com') ? <FaGooglePlay size={16} /> : <Github size={16} />}
                      </motion.a>
                    )}
                    {project.extraLinks?.appStore && (
                      <motion.a
                        href={project.extraLinks.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Download on Apple App Store (opens in new window)`}
                        title="Download on the App Store"
                      >
                        <FaApple size={16} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Projects Grid */}
      <motion.div
        className="projects-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className={`project-card ${project.featured ? 'featured-badge' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              exit="exit"
              layout
              whileHover={{ y: -8 }}
              onClick={() => handleProjectClick(project)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleProjectClick(project)
                }
              }}
              aria-label={`${project.title}: ${project.description}`}
            >
              <div className="project-card-header">
                <div className="project-meta">
                  <span className="project-year">{project.year}</span>
                  <span className="project-divider" aria-hidden="true">•</span>
                  <span className="project-category">{project.category}</span>
                </div>
                {project.featured && (
                  <span className="featured-label">Featured</span>
                )}
              </div>
              <h4 className="project-title">{project.title}</h4>
              <p className="project-description">{project.description}</p>
              <div className="project-tags" role="list" aria-label="Technologies used">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag" role="listitem">{tag}</span>
                ))}
              </div>
              <div className="project-footer">
                <div className="project-links">
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View live demo of ${project.title} (opens in new window)`}
                    >
                      <ExternalLink size={16} />
                      <span>Website</span>
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${project.githubUrl.includes('play.google.com') ? 'Download on Google Play Store' : `View source code of ${project.title} on GitHub`} (opens in new window)`}
                    >
                      {project.githubUrl.includes('play.google.com') ? <FaGooglePlay size={16} /> : <Github size={16} />}
                      <span>{project.githubUrl.includes('play.google.com') ? 'Play Store' : 'Code'}</span>
                    </motion.a>
                  )}
                  {project.extraLinks?.appStore && (
                    <motion.a
                      href={project.extraLinks.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Download on Apple App Store (opens in new window)`}
                    >
                      <FaApple size={16} />
                      <span>App Store</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              aria-hidden="true"
            />
            <motion.div
              className="project-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <button
                className="modal-close"
                onClick={handleCloseModal}
                aria-label="Close project details"
              >
                ×
              </button>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-meta">
                    <span className="project-year">{selectedProject.year}</span>
                    <span className="project-divider" aria-hidden="true">•</span>
                    <span className="project-category">{selectedProject.category}</span>
                  </div>
                  <h3 id="modal-title" className="modal-title">{selectedProject.title}</h3>
                </div>
                <div className="modal-body">
                  {selectedProject.imageGallery && selectedProject.imageGallery.length > 0 ? (
                    <div className="modal-gallery">
                      <div className="modal-image-container">
                        <img
                          src={selectedProject.imageGallery[currentImageIndex]}
                          alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                          className="modal-image"
                        />
                        {selectedProject.imageGallery.length > 1 && (
                          <>
                            <button
                              className="gallery-nav gallery-nav-prev"
                              onClick={handlePrevImage}
                              aria-label="Previous image"
                            >
                              ‹
                            </button>
                            <button
                              className="gallery-nav gallery-nav-next"
                              onClick={handleNextImage}
                              aria-label="Next image"
                            >
                              ›
                            </button>
                            <div className="gallery-indicators">
                              {selectedProject.imageGallery.map((_, index) => (
                                <button
                                  key={index}
                                  className={`gallery-indicator ${index === currentImageIndex ? 'active' : ''}`}
                                  onClick={() => setCurrentImageIndex(index)}
                                  aria-label={`Go to image ${index + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : selectedProject.imageUrl ? (
                    <div className="modal-image-container">
                      <img
                        src={selectedProject.imageUrl}
                        alt={`${selectedProject.title} preview`}
                        className="modal-image"
                      />
                    </div>
                  ) : null}
                  <p id="modal-description" className="modal-description">{selectedProject.longDescription}</p>
                  <div className="modal-tags">
                    <h4>Technologies Used</h4>
                    <div className="project-tags" role="list" aria-label="Technologies used">
                      {selectedProject.tags.map((tag, i) => (
                        <span key={i} className="tag" role="listitem">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="modal-links">
                    {selectedProject.liveUrl && (
                      <motion.a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`View website of ${selectedProject.title} (opens in new window)`}
                      >
                        <ExternalLink size={18} />
                        <span>Visit Website</span>
                      </motion.a>
                    )}
                    {selectedProject.githubUrl && (
                      <motion.a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`${selectedProject.githubUrl.includes('play.google.com') ? 'Download on Google Play Store' : `View source code of ${selectedProject.title} on GitHub`} (opens in new window)`}
                      >
                        {selectedProject.githubUrl.includes('play.google.com') ? <FaGooglePlay size={18} /> : <Github size={18} />}
                        <span>{selectedProject.githubUrl.includes('play.google.com') ? 'Download on Play Store' : 'View Source Code'}</span>
                      </motion.a>
                    )}
                    {selectedProject.extraLinks?.appStore && (
                      <motion.a
                        href={selectedProject.extraLinks.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-link"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Download on Apple App Store (opens in new window)`}
                      >
                        <FaApple size={18} />
                        <span>Download on App Store</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default Projects
