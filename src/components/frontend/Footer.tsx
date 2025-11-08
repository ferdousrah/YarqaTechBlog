// src/components/frontend/Footer.tsx - Modern design with Framer Motion
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Twitter, Linkedin, Github, Mail, ArrowUp, Facebook, Instagram, Youtube } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FooterProps {
  settings?: any
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Get settings or use defaults
  const copyrightText = settings?.copyrightText || 'Yarqa Tech. All rights reserved.'
  const footerTagline = settings?.footerTagline || 'Made with passion for developers'
  const showBuiltWith = settings?.showBuiltWith !== false
  const siteDescription = settings?.siteDescription || 'Your source for the latest in technology, development, and innovation. Stay updated with expert insights and tutorials that matter.'
  const contactEmail = settings?.contactEmail || 'hello@yarqatech.com'

  const logoText = {
    first: settings?.logoText?.firstPart || 'Yarqa',
    second: settings?.logoText?.secondPart || 'Tech',
    letter: settings?.logoText?.logoLetter || 'Y',
  }

  // Check for uploaded logo
  const hasUploadedLogo = settings?.logo && typeof settings.logo === 'object' && settings.logo?.url
  const logoUrl = hasUploadedLogo ? settings.logo.url : null

  // Build social links array from settings
  const buildSocialLinks = () => {
    const links = []

    if (settings?.socialLinks?.twitter) {
      links.push({ Icon: Twitter, href: settings.socialLinks.twitter, label: 'Twitter', color: 'hover:text-sky-400' })
    }
    if (settings?.socialLinks?.linkedin) {
      links.push({ Icon: Linkedin, href: settings.socialLinks.linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' })
    }
    if (settings?.socialLinks?.github) {
      links.push({ Icon: Github, href: settings.socialLinks.github, label: 'GitHub', color: 'hover:text-gray-300' })
    }
    if (settings?.socialLinks?.facebook) {
      links.push({ Icon: Facebook, href: settings.socialLinks.facebook, label: 'Facebook', color: 'hover:text-blue-500' })
    }
    if (settings?.socialLinks?.instagram) {
      links.push({ Icon: Instagram, href: settings.socialLinks.instagram, label: 'Instagram', color: 'hover:text-pink-400' })
    }
    if (settings?.socialLinks?.youtube) {
      links.push({ Icon: Youtube, href: settings.socialLinks.youtube, label: 'YouTube', color: 'hover:text-red-500' })
    }

    // Default social links if none configured
    if (links.length === 0) {
      return [
        { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-400' },
        { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-400' },
        { Icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-gray-300' },
        { Icon: Mail, href: `mailto:${contactEmail}`, label: 'Email', color: 'hover:text-red-400' },
      ]
    }

    return links
  }

  const socialLinks = buildSocialLinks()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 border-t border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {logoUrl ? (
                <motion.div whileHover={{ scale: 1.05 }} className="relative h-10 w-auto">
                  <Image
                    src={logoUrl}
                    alt={settings?.siteName || 'Logo'}
                    height={40}
                    width={120}
                    className="h-10 w-auto object-contain"
                  />
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                  >
                    <span className="text-white font-bold text-xl">{logoText.letter}</span>
                  </motion.div>
                  <span className="text-2xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                      {logoText.first}
                    </span>
                    <span className="text-white">{logoText.second}</span>
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              {siteDescription}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-gray-800 rounded-lg text-gray-400 ${color} transition-all duration-300 hover:shadow-lg`}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Blog', 'Categories', 'About'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Newsletter', href: '/#newsletter' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {copyrightText}
              {showBuiltWith && (
                <>
                  {' '}Built with <span className="text-red-400">♥</span> using Next.js & Tailwind CSS
                </>
              )}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{footerTagline}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 z-50 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </footer>
  )
}
