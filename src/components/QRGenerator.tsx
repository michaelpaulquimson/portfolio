import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Download, Copy, Check } from 'lucide-react'
import QRCode from 'qrcode'
import { useTheme } from '../contexts/ThemeContext'
import './QRGenerator.css'

const QRGenerator: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateQR = async (inputText: string) => {
    if (!inputText.trim()) {
      setQrDataUrl('')
      return
    }

    setIsGenerating(true)
    try {
      const dataUrl = await QRCode.toDataURL(inputText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generateQR(text)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [text])

  const handleDownload = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrDataUrl
    link.click()
  }

  const handleCopy = async () => {
    if (!qrDataUrl) return

    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy QR code:', error)
    }
  }

  return (
    <motion.section
      className={`qr-generator ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="qr-generator-container">
        <motion.div 
          className="qr-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <QrCode className="qr-icon" size={32} />
          <h2>QR Code Generator</h2>
          <p>Enter any text or URL to generate a QR code instantly</p>
        </motion.div>

        <div className="qr-content">
          <motion.div 
            className="input-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="qr-input">Enter text or URL:</label>
            <textarea
              id="qr-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text, URL, or any content here..."
              rows={4}
              className="qr-input"
            />
          </motion.div>

          <motion.div 
            className="qr-output"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="qr-display">
              {isGenerating ? (
                <motion.div 
                  className="qr-loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <QrCode size={48} />
                </motion.div>
              ) : qrDataUrl ? (
                <motion.div 
                  className="qr-image-container"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img src={qrDataUrl} alt="Generated QR Code" className="qr-image" />
                  <div className="qr-actions">
                    <motion.button
                      onClick={handleDownload}
                      className="qr-action-btn download-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download QR Code"
                    >
                      <Download size={20} />
                    </motion.button>
                    <motion.button
                      onClick={handleCopy}
                      className="qr-action-btn copy-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="qr-placeholder">
                  <QrCode size={64} className="placeholder-icon" />
                  <p>Your QR code will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default QRGenerator
