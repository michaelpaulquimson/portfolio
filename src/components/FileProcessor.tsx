import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Download, Upload, Trash2, Loader, FileCheck } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import imageCompression from 'browser-image-compression'
import { useTheme } from '../contexts/ThemeContext'
import './FileProcessor.css'

interface FileItem {
  id: string
  file: File
  name: string
  size: string
  type: 'pdf' | 'image'
}

const FileProcessor: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [pdfFiles, setPdfFiles] = useState<FileItem[]>([])
  const [imageFiles, setImageFiles] = useState<FileItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'pdf' | 'image'>('pdf')

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = (files: FileList | null, type: 'pdf' | 'image') => {
    if (!files) return

    const newFiles: FileItem[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type
    }))

    if (type === 'pdf') {
      setPdfFiles(prev => [...prev, ...newFiles])
    } else {
      setImageFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string, type: 'pdf' | 'image') => {
    if (type === 'pdf') {
      setPdfFiles(prev => prev.filter(f => f.id !== id))
    } else {
      setImageFiles(prev => prev.filter(f => f.id !== id))
    }
  }

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) return

    setIsProcessing(true)
    try {
      const mergedPdf = await PDFDocument.create()

      for (const fileItem of pdfFiles) {
        const arrayBuffer = await fileItem.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, 'merged-document.pdf')
    } catch (error) {
      console.error('Error merging PDFs:', error)
      alert('Error merging PDFs. Please make sure all files are valid PDF documents.')
    } finally {
      setIsProcessing(false)
    }
  }

  const compressImages = async () => {
    if (imageFiles.length === 0) return

    setIsProcessing(true)
    try {
      const compressedFiles = await Promise.all(
        imageFiles.map(async (fileItem) => {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: fileItem.file.type as any
          }

          try {
            const compressedFile = await imageCompression(fileItem.file, options)
            return {
              file: compressedFile,
              originalName: fileItem.name,
              originalSize: fileItem.file.size,
              compressedSize: compressedFile.size
            }
          } catch (error) {
            console.error(`Error compressing ${fileItem.name}:`, error)
            return null
          }
        })
      )

      const validFiles = compressedFiles.filter(f => f !== null)

      if (validFiles.length === 1) {
        // Single file - download directly
        const item = validFiles[0]!
        saveAs(item.file, `compressed-${item.originalName}`)
      } else if (validFiles.length > 1) {
        // Multiple files - create zip (simplified approach: download separately)
        validFiles.forEach((item, index) => {
          if (item) {
            setTimeout(() => {
              saveAs(item.file, `compressed-${item.originalName}`)
            }, index * 500) // Stagger downloads
          }
        })
      }

      // Show compression stats
      const totalOriginal = validFiles.reduce((sum, item) => sum + (item?.originalSize || 0), 0)
      const totalCompressed = validFiles.reduce((sum, item) => sum + (item?.compressedSize || 0), 0)
      const savings = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)
      
      alert(`Compression complete! Original: ${formatFileSize(totalOriginal)}, Compressed: ${formatFileSize(totalCompressed)} (${savings}% reduction)`)
    } catch (error) {
      console.error('Error compressing images:', error)
      alert('Error compressing images. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearFiles = (type: 'pdf' | 'image') => {
    if (type === 'pdf') {
      setPdfFiles([])
    } else {
      setImageFiles([])
    }
  }

  return (
    <motion.section
      className={`file-processor ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="file-processor-container">
        <motion.div 
          className="processor-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="header-icons">
            <FileText className="processor-icon" size={32} />
            <Image className="processor-icon" size={32} />
          </div>
          <h2>File Processor</h2>
          <p>Merge PDF documents and compress images with ease</p>
        </motion.div>

        <div className="tab-navigation">
          <motion.button
            className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={20} />
            PDF Merger
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image size={20} />
            Image Compressor
          </motion.button>
        </div>

        <motion.div
          className="processor-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'pdf' ? (
            <div className="pdf-merger">
              <div className="upload-section">
                <div className="upload-area">
                  <input
                    type="file"
                    id="pdf-upload"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files, 'pdf')}
                    className="file-input"
                  />
                  <label htmlFor="pdf-upload" className="upload-label">
                    <Upload size={48} />
                    <span>Drop PDF files here or click to browse</span>
                    <small>Select multiple PDF files to merge</small>
                  </label>
                </div>
              </div>

              {pdfFiles.length > 0 && (
                <div className="file-list">
                  <div className="list-header">
                    <h3>PDF Files ({pdfFiles.length})</h3>
                    <button
                      onClick={() => clearFiles('pdf')}
                      className="clear-btn"
                      title="Clear all files"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="files">
                    {pdfFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        className="file-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="file-info">
                          <FileText size={20} className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{file.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id, 'pdf')}
                          className="remove-btn"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {pdfFiles.length >= 2 && (
                <motion.button
                  onClick={mergePDFs}
                  disabled={isProcessing}
                  className="process-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="spinner" size={20} />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Merge {pdfFiles.length} PDFs
                    </>
                  )}
                </motion.button>
              )}
            </div>
          ) : (
            <div className="image-compressor">
              <div className="upload-section">
                <div className="upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'image')}
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    <Upload size={48} />
                    <span>Drop images here or click to browse</span>
                    <small>Select JPG, PNG, or WebP images to compress</small>
                  </label>
                </div>
              </div>

              {imageFiles.length > 0 && (
                <div className="file-list">
                  <div className="list-header">
                    <h3>Images ({imageFiles.length})</h3>
                    <button
                      onClick={() => clearFiles('image')}
                      className="clear-btn"
                      title="Clear all files"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="files">
                    {imageFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        className="file-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="file-info">
                          <Image size={20} className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{file.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id, 'image')}
                          className="remove-btn"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {imageFiles.length > 0 && (
                <motion.button
                  onClick={compressImages}
                  disabled={isProcessing}
                  className="process-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="spinner" size={20} />
                      Compressing Images...
                    </>
                  ) : (
                    <>
                      <FileCheck size={20} />
                      Compress {imageFiles.length} Image{imageFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FileProcessor
