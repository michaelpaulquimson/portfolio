import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import QRGenerator from './QRGenerator'
import APITester from './APITester'
import FileProcessor from './FileProcessor'
import './ToolsSection.css'

type ToolId = 'qr' | 'api' | 'file'

interface ToolsSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const TOOLS: { id: ToolId; icon: string; name: string; sub: string }[] = [
  { id: 'qr', icon: '⬡', name: 'QR Generator', sub: 'Text → QR code' },
  { id: 'api', icon: '⟳', name: 'API Tester', sub: 'HTTP requests' },
  { id: 'file', icon: '⬢', name: 'File Processor', sub: 'Compress · Convert' },
]

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolId>('qr')

  return (
    <SectionWrapper id="tools" className="tools-section" sectionRef={sectionRef}>
      <div className="tools-section__header">
        <div className="tools-section__label">// Utility Tools</div>
        <button
          className="tools-section__toggle"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls="tools-expanded"
        >
          {isExpanded ? '▴ Collapse' : '▾ Expand'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="tools-expanded"
            className="tools-section__expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="tools-section__preview">
              {TOOLS.map((t) => (
                <div key={t.id} className="tool-preview-card">
                  <div className="tool-preview-card__icon">{t.icon}</div>
                  <div className="tool-preview-card__name">{t.name}</div>
                  <div className="tool-preview-card__sub">{t.sub}</div>
                </div>
              ))}
            </div>

            <div className="tool-tab-bar" role="tablist">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  id={`tool-tab-${t.id}`}
                  className={`tool-tab${activeTool === t.id ? ' tool-tab--active' : ''}`}
                  onClick={() => setActiveTool(t.id)}
                  role="tab"
                  aria-selected={activeTool === t.id}
                  aria-controls={`tool-panel-${t.id}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="tool-content">
              <div
                id="tool-panel-qr"
                role="tabpanel"
                aria-labelledby="tool-tab-qr"
                hidden={activeTool !== 'qr'}
              >
                {activeTool === 'qr' && <QRGenerator />}
              </div>
              <div
                id="tool-panel-api"
                role="tabpanel"
                aria-labelledby="tool-tab-api"
                hidden={activeTool !== 'api'}
              >
                {activeTool === 'api' && <APITester />}
              </div>
              <div
                id="tool-panel-file"
                role="tabpanel"
                aria-labelledby="tool-tab-file"
                hidden={activeTool !== 'file'}
              >
                {activeTool === 'file' && <FileProcessor />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

export default ToolsSection
