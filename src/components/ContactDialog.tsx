import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import './ContactDialog.css'

interface ContactDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface FormFields {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

type SendStatus = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TO_EMAIL = 'michaelpaulquimson@gmail.com'

const ContactDialog: React.FC<ContactDialogProps> = ({ isOpen, onClose }) => {
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SendStatus>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)

  const resetForm = useCallback(() => {
    setFields({ name: '', email: '', message: '' })
    setErrors({})
    setStatus('idle')
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(resetForm, 300)
  }, [onClose, resetForm])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
        return
      }
      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, input, textarea, [tabindex]:not([tabindex="-1"])'
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
      dialogRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!fields.name.trim()) errs.name = 'Name is required'
    if (!fields.email.trim()) {
      errs.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(fields.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!fields.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus('loading')

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        {
          from_name: fields.name,
          from_email: fields.email,
          message: fields.message,
          to_email: TO_EMAIL,
          reply_to: fields.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string
      )
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="contact-dialog__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="contact-dialog__container" onClick={handleClose}>
            <motion.div
              ref={dialogRef}
              className="contact-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-dialog-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="contact-dialog__close"
                onClick={handleClose}
                aria-label="Close contact form"
              >
                ×
              </button>

              <div className="contact-dialog__label">// Contact</div>
              <h2 id="contact-dialog-title" className="contact-dialog__title">
                Get in Touch
              </h2>

              {status === 'success' ? (
                <div className="contact-dialog__success">
                  <div className="contact-dialog__success-icon" aria-hidden="true">✓</div>
                  <div className="contact-dialog__success-title">Message sent!</div>
                  <p className="contact-dialog__success-body">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  className="contact-dialog__form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="contact-dialog__field">
                    <label htmlFor="contact-name" className="contact-dialog__field-label">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`contact-dialog__input${errors.name ? ' contact-dialog__input--error' : ''}`}
                      placeholder="Your name"
                      value={fields.name}
                      onChange={handleChange}
                      autoComplete="name"
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span id="contact-name-error" className="contact-dialog__error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="contact-dialog__field">
                    <label htmlFor="contact-email" className="contact-dialog__field-label">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`contact-dialog__input${errors.email ? ' contact-dialog__input--error' : ''}`}
                      placeholder="your@email.com"
                      value={fields.email}
                      onChange={handleChange}
                      autoComplete="email"
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span id="contact-email-error" className="contact-dialog__error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="contact-dialog__field">
                    <label htmlFor="contact-message" className="contact-dialog__field-label">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={`contact-dialog__textarea${errors.message ? ' contact-dialog__textarea--error' : ''}`}
                      placeholder="What's on your mind?"
                      value={fields.message}
                      onChange={handleChange}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <span id="contact-message-error" className="contact-dialog__error" role="alert">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {status === 'error' && (
                    <p className="contact-dialog__send-error" role="alert">
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="contact-dialog__submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContactDialog
