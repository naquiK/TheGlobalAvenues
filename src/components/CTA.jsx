import { Mail, Phone, ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSideSlideAnimation } from '../hooks/useScrollAnimation'
import { submitContactForm } from '../services/contactFormService'

export default function CTA() {
  const contentRef = useRef(null)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useSideSlideAnimation(contentRef, 'left')
  useSideSlideAnimation(formRef, 'right')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      await submitContactForm({
        formName: 'CTA Contact Form',
        source: '/',
        fields: {
          name: formData.name,
          email: formData.email,
          subject: formData.company,
          message: formData.message,
          company: formData.company,
        },
      })
      setStatusMessage('Message sent.')
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (error) {
      setStatusMessage('Message failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden relative">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8 scroll-slide-in-left" style={{ opacity: 0 }}>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to Find Your Next Opportunity?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Connect with The Global Avenues today. Our expert team is ready to help you achieve your career or recruitment goals across the globe.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-primary-foreground/10 rounded-lg card-hover transition-all duration-300 hover:shadow-xl scroll-fade-in stagger-1" data-stagger style={{ animation: 'fadeInUp 0.6s ease-out 0.1s forwards', opacity: 0 }}>
                <Phone className="text-secondary flex-shrink-0 mt-1 icon-bounce" size={24} />
                <div>
                  <p className="text-sm text-primary-foreground/80 font-semibold">Phone</p>
                  <a href="tel:+911146801133" className="font-semibold text-lg hover:text-secondary transition-colors duration-300">+91 11 4680 1133</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary-foreground/10 rounded-lg card-hover transition-all duration-300 hover:shadow-xl scroll-fade-in stagger-2" data-stagger style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards', opacity: 0 }}>
                <Mail className="text-secondary flex-shrink-0 mt-1 icon-bounce" size={24} />
                <div>
                  <p className="text-sm text-primary-foreground/80 font-semibold">Email</p>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=connect%40theglobalavenues.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:text-secondary transition-colors duration-300">connect@theglobalavenues.com</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="btn-secondary inline-flex items-center justify-center gap-2">
                Get Started Now
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button className="px-7 py-3 border border-primary-foreground text-primary-foreground rounded hover:bg-primary-foreground/10 transition-all duration-300 font-semibold cursor-pointer hover:shadow-lg">
                Schedule a Call
              </button>
            </div>
          </div>

          {/* Right Form */}
          <div ref={formRef} className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-xl p-8 lg:p-10 scroll-slide-in-right card-hover" style={{ opacity: 0 }}>
            <h3 className="text-2xl font-bold mb-8 text-primary-foreground">Get in Touch</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="scroll-fade-in" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s forwards', opacity: 0 }}>
                <label className="block text-sm font-semibold mb-2 text-primary-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:border-secondary/80 focus:bg-primary-foreground/20 transition-all duration-300"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="scroll-fade-in" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards', opacity: 0 }}>
                <label className="block text-sm font-semibold mb-2 text-primary-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:border-secondary/80 focus:bg-primary-foreground/20 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="scroll-fade-in" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s forwards', opacity: 0 }}>
                <label className="block text-sm font-semibold mb-2 text-primary-foreground">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:border-secondary/80 focus:bg-primary-foreground/20 transition-all duration-300"
                  placeholder="Your company"
                />
              </div>

              <div className="scroll-fade-in" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s forwards', opacity: 0 }}>
                <label className="block text-sm font-semibold mb-2 text-primary-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:border-secondary/80 focus:bg-primary-foreground/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your needs..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 scroll-fade-in"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.5s forwards', opacity: 0 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {statusMessage ? (
                <p className="text-sm text-primary-foreground/90">{statusMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
