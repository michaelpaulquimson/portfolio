import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Globe, Copy, Check, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import './APITester.css'

interface RequestHistory {
  id: string
  method: string
  url: string
  status: number
  timestamp: Date
  responseTime: number
}

const APITester: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<RequestHistory[]>([])

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setResponse('')
    setResponseStatus(null)
    setResponseTime(null)

    const startTime = Date.now()

    try {
      let parsedHeaders = {}
      try {
        parsedHeaders = JSON.parse(headers)
      } catch {
        parsedHeaders = {}
      }

      const config: RequestInit = {
        method,
        headers: parsedHeaders,
      }

      if (method !== 'GET' && body.trim()) {
        config.body = body
      }

      const res = await fetch(url, config)
      const endTime = Date.now()
      const duration = endTime - startTime

      setResponseTime(duration)
      setResponseStatus(res.status)

      const contentType = res.headers.get('content-type')
      let responseText = ''

      if (contentType?.includes('application/json')) {
        const jsonData = await res.json()
        responseText = JSON.stringify(jsonData, null, 2)
      } else {
        responseText = await res.text()
      }

      setResponse(responseText)

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        status: res.status,
        timestamp: new Date(),
        responseTime: duration
      }

      setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Keep last 10 requests

    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime
      setResponseTime(duration)
      setResponseStatus(0)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyResponse = async () => {
    if (!response) return

    try {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy response:', error)
    }
  }

  const getStatusColor = (status: number | null) => {
    if (status === null || status === 0) return 'var(--error-color)'
    if (status >= 200 && status < 300) return 'var(--success-color)'
    if (status >= 300 && status < 400) return 'var(--warning-color)'
    return 'var(--error-color)'
  }

  const getStatusIcon = (status: number | null) => {
    if (status === null || status === 0) return <AlertCircle size={16} />
    if (status >= 200 && status < 300) return <CheckCircle size={16} />
    return <AlertCircle size={16} />
  }

  return (
    <motion.section
      className={`api-tester ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="api-tester-container">
        <motion.div 
          className="api-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Globe className="api-icon" size={32} />
          <h2>API Tester</h2>
          <p>Test REST APIs with custom headers and request bodies</p>
        </motion.div>

        <div className="api-content">
          <motion.form 
            className="api-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="url-section">
              <div className="method-url-row">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="method-select"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="url-input"
                  required
                />
                <motion.button
                  type="submit"
                  className="send-btn"
                  disabled={isLoading || !url.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock size={18} />
                    </motion.div>
                  ) : (
                    <Send size={18} />
                  )}
                  {isLoading ? 'Sending...' : 'Send'}
                </motion.button>
              </div>
            </div>

            <div className="headers-section">
              <label htmlFor="headers">Headers (JSON):</label>
              <textarea
                id="headers"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="headers-input"
                rows={3}
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>

            {method !== 'GET' && (
              <div className="body-section">
                <label htmlFor="body">Request Body:</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="body-input"
                  rows={4}
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
          </motion.form>

          <motion.div 
            className="api-results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="response-header">
              <h3>Response</h3>
              {responseStatus !== null && (
                <div className="response-meta">
                  <div 
                    className="status-badge"
                    style={{ color: getStatusColor(responseStatus) }}
                  >
                    {getStatusIcon(responseStatus)}
                    <span>{responseStatus === 0 ? 'Error' : responseStatus}</span>
                  </div>
                  {responseTime !== null && (
                    <div className="time-badge">
                      <Clock size={14} />
                      <span>{responseTime}ms</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="response-content">
              {response ? (
                <div className="response-display">
                  <div className="response-actions">
                    <motion.button
                      onClick={handleCopyResponse}
                      className="copy-response-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Copy Response"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </motion.button>
                  </div>
                  <pre className="response-text">{response}</pre>
                </div>
              ) : (
                <div className="response-placeholder">
                  <Globe size={48} className="placeholder-icon" />
                  <p>API response will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {history.length > 0 && (
          <motion.div 
            className="request-history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Recent Requests</h3>
            <div className="history-list">
              {history.map(item => (
                <motion.div 
                  key={item.id}
                  className="history-item"
                  onClick={() => setUrl(item.url)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="history-method">{item.method}</div>
                  <div className="history-url">{item.url}</div>
                  <div 
                    className="history-status"
                    style={{ color: getStatusColor(item.status) }}
                  >
                    {item.status}
                  </div>
                  <div className="history-time">{item.responseTime}ms</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default APITester
