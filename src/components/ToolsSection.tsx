import React, { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import './ToolsSection.css'

const QRGenerator = lazy(() => import('./QRGenerator'))
const APITester = lazy(() => import('./APITester'))
const FileProcessor = lazy(() => import('./FileProcessor'))

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
        <div className="tools-section__heading">
          <div className="section-label">
            <span className="section-label__num">03</span> Utility tools
          </div>
          <h2 className="tools-section__title">
            Small tools, <em>built in.</em>
          </h2>
        </div>
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
                <Suspense fallback={null}>
                  <QRGenerator />
                </Suspense>
              </div>
              <div
                id="tool-panel-api"
                role="tabpanel"
                aria-labelledby="tool-tab-api"
                hidden={activeTool !== 'api'}
              >
                <Suspense fallback={null}>
                  <APITester />
                </Suspense>
              </div>
              <div
                id="tool-panel-file"
                role="tabpanel"
                aria-labelledby="tool-tab-file"
                hidden={activeTool !== 'file'}
              >
                <Suspense fallback={null}>
                  <FileProcessor />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

export default ToolsSection
