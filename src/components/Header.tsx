import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import './Header.css'

const Header: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.header
      className="header"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="header-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="header-content">
        <motion.div className="hero-section" variants={itemVariants}>
          <motion.h1 
            className="name"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            MICHAEL PAUL QUIMSON
          </motion.h1>
          <motion.div 
            className="title"
            variants={itemVariants}
          >
            <span className="title-text">Senior Solutions Architect</span>
            <span className="title-accent"> & Full Stack Developer</span>
          </motion.div>
        </motion.div>

        <motion.div className="contact-info" variants={itemVariants}>
          <motion.div 
            className="contact-item"
            whileHover={{ scale: 1.05, color: "#00f5ff" }}
            transition={{ duration: 0.2 }}
          >
            <MapPin size={18} />
            <span>Brookside Hills Subdivision, Cainta, Rizal 1900</span>
          </motion.div>
          <motion.div 
            className="contact-item"
            whileHover={{ scale: 1.05, color: "#00f5ff" }}
            transition={{ duration: 0.2 }}
          >
            <Phone size={18} />
            <span>(63) 905-6691964</span>
          </motion.div>
          <motion.div 
            className="contact-item"
            whileHover={{ scale: 1.05, color: "#00f5ff" }}
            transition={{ duration: 0.2 }}
          >
            <Mail size={18} />
            <span>michaelpaulquimson@gmail.com</span>
          </motion.div>
        </motion.div>

        <motion.div className="social-links" variants={itemVariants}>
          {/* <motion.a
            href="#"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Github size={24} />
          </motion.a> */}
            <motion.a
            href="https://www.linkedin.com/in/michaelpaulquimson/"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            target="_blank"
            rel="noopener noreferrer"
            >
            <Linkedin size={24} />
            </motion.a>
          {/* <motion.a
            href="mailto:michaelpaulquimson@gmail.com"
            className="social-link"
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Mail size={24} />
          </motion.a> */}
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
