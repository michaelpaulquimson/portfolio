import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Globe, Copy, Check, AlertCircle, CheckCircle, Clock, List } from 'lucide-react'
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

interface FreeAPI {
  name: string
  url: string
  method: string
  description: string
  headers?: string
  body?: string
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
  const [showApiList, setShowApiList] = useState(false)

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

  const freeAPIs: FreeAPI[] = [
    {
      name: "JSONPlaceholder - Posts",
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "GET",
      description: "Fake REST API for testing and prototyping"
    },
    {
      name: "JSONPlaceholder - Single Post",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      method: "GET",
      description: "Get a single post by ID"
    },
    {
      name: "JSONPlaceholder - Create Post",
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      description: "Create a new post",
      body: '{\n  "title": "Test Post",\n  "body": "This is a test post",\n  "userId": 1\n}'
    },
    {
      name: "Cat Facts",
      url: "https://catfact.ninja/fact",
      method: "GET",
      description: "Random cat facts"
    },
    {
      name: "Dog API - Random Image",
      url: "https://dog.ceo/api/breeds/image/random",
      method: "GET",
      description: "Random dog images"
    },
    {
      name: "Quotes API",
      url: "https://zenquotes.io/api/random",
      method: "GET",
      description: "Random inspirational quotes"
    },
    {
      name: "REST Countries",
      url: "https://restcountries.com/v3.1/all?fields=name,capital,population,flags,region",
      method: "GET",
      description: "Information about all countries"
    },
    {
      name: "REST Countries - By Name",
      url: "https://restcountries.com/v3.1/name/philippines",
      method: "GET",
      description: "Search countries by name"
    },
    {
      name: "IP Information",
      url: "https://httpbin.org/ip",
      method: "GET",
      description: "Get your IP address"
    },
    {
      name: "UUID Generator",
      url: "https://httpbin.org/uuid",
      method: "GET",
      description: "Generate a random UUID"
    },
    {
      name: "HTTPBin - POST Test",
      url: "https://httpbin.org/post",
      method: "POST",
      description: "Test POST requests",
      body: '{\n  "name": "Test User",\n  "email": "test@example.com"\n}'
    },
    {
      name: "Advice API",
      url: "https://api.adviceslip.com/advice",
      method: "GET",
      description: "Random advice slips"
    }
  ]

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

  const loadFreeAPI = (api: FreeAPI) => {
    setUrl(api.url)
    setMethod(api.method)
    if (api.headers) {
      setHeaders(api.headers)
    }
    if (api.body) {
      setBody(api.body)
    } else {
      setBody('')
    }
    setShowApiList(false)
  }

  return (
    <motion.section
      id="api-tester"
      className={`api-tester ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
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

        <motion.div 
          className="free-apis-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="free-apis-header">
            <h3>Try Free APIs</h3>
            <motion.button
              className="toggle-api-list-btn"
              onClick={() => setShowApiList(!showApiList)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List size={18} />
              {showApiList ? 'Hide APIs' : 'Show Free APIs'}
            </motion.button>
          </div>
          
          {showApiList && (
            <motion.div 
              className="api-grid"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {freeAPIs.map((api, index) => (
                <motion.div
                  key={api.name}
                  className="api-card"
                  onClick={() => loadFreeAPI(api)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      loadFreeAPI(api)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Load ${api.name} API test`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="api-card-header">
                    <h4>{api.name}</h4>
                    <span className={`method-badge ${api.method.toLowerCase()}`}>
                      {api.method}
                    </span>
                  </div>
                  <p className="api-description">{api.description}</p>
                  <code className="api-url">{api.url}</code>
                </motion.div>
              ))}
            </motion.div>
          )}
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
