// src/contexts/ThemeContext.tsx - Theme context provider
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  background: string
  backgroundSecondary: string
  text: string
  textSecondary: string
  border: string
}

interface ThemeTypography {
  fontFamily: string
  headingFontFamily: string
  baseFontSize: number
  lineHeight: number
  headingWeight: string
}

interface ThemeSpacing {
  containerMaxWidth: string
  borderRadius: string
  shadowStyle: string
}

interface ThemeButtons {
  style: string
  buttonRadius: string
}

interface ThemeAnimations {
  enableAnimations: boolean
  animationSpeed: string
}

export interface Theme {
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  buttons: ThemeButtons
  animations: ThemeAnimations
}

interface ThemeContextType {
  theme: Theme | null
  loading: boolean
  refreshTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  loading: true,
  refreshTheme: async () => {},
})

export const useTheme = () => useContext(ThemeContext)

// Font family mappings - uses CSS variables from fonts.ts
const fontFamilyMap: Record<string, string> = {
  inter: "var(--font-inter)",
  roboto: "var(--font-roboto)",
  'open-sans': "var(--font-open-sans)",
  poppins: "var(--font-poppins)",
  lato: "var(--font-lato)",
  montserrat: "var(--font-montserrat)",
  nunito: "var(--font-nunito)",
  'source-sans': "var(--font-source-sans)",
  'work-sans': "var(--font-work-sans)",
  raleway: "var(--font-raleway)",
  playfair: "var(--font-playfair)",
  merriweather: "var(--font-merriweather)",
  'space-grotesk': "var(--font-space-grotesk)",
  'dm-sans': "var(--font-dm-sans)",
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

// Border radius mappings
const borderRadiusMap: Record<string, string> = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '12px',
  xl: '16px',
  rounded: '20px',
}

// Shadow style mappings
const shadowStyleMap: Record<string, string> = {
  none: 'none',
  subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  dramatic:
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

// Animation speed mappings
const animationSpeedMap: Record<string, string> = {
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
}

// Button radius mappings
const buttonRadiusMap: Record<string, string> = {
  none: '0px',
  small: '6px',
  medium: '8px',
  large: '12px',
  pill: '9999px',
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTheme = async () => {
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/theme?t=${Date.now()}`, {
        cache: 'no-store',
      })
      const data = await response.json()

      if (data.success) {
        setTheme(data.theme)
        applyThemeToDOM(data.theme)
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshTheme = async () => {
    setLoading(true)
    await fetchTheme()
  }

  useEffect(() => {
    fetchTheme()
  }, [])

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement

    // Apply color variables
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-secondary', theme.colors.secondary)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-success', theme.colors.success)
    root.style.setProperty('--color-warning', theme.colors.warning)
    root.style.setProperty('--color-error', theme.colors.error)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-background-secondary', theme.colors.backgroundSecondary)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--color-border', theme.colors.border)

    // Apply typography variables
    const fontFamily =
      fontFamilyMap[theme.typography.fontFamily] || fontFamilyMap.inter
    const headingFontFamily =
      theme.typography.headingFontFamily === 'inherit'
        ? fontFamily
        : fontFamilyMap[theme.typography.headingFontFamily] || fontFamily

    root.style.setProperty('--font-family', fontFamily)
    root.style.setProperty('--font-family-heading', headingFontFamily)
    root.style.setProperty('--font-size-base', `${theme.typography.baseFontSize}px`)
    root.style.setProperty('--line-height', String(theme.typography.lineHeight))
    root.style.setProperty('--heading-weight', theme.typography.headingWeight)

    // Apply spacing variables
    root.style.setProperty('--container-max-width', theme.spacing.containerMaxWidth)
    root.style.setProperty(
      '--border-radius',
      borderRadiusMap[theme.spacing.borderRadius] || borderRadiusMap.medium,
    )
    root.style.setProperty(
      '--shadow',
      shadowStyleMap[theme.spacing.shadowStyle] || shadowStyleMap.medium,
    )

    // Apply button variables
    root.style.setProperty(
      '--button-radius',
      buttonRadiusMap[theme.buttons.buttonRadius] || buttonRadiusMap.medium,
    )

    // Apply animation variables
    root.style.setProperty(
      '--animation-speed',
      animationSpeedMap[theme.animations.animationSpeed] || animationSpeedMap.normal,
    )

    // Add/remove animations class
    if (!theme.animations.enableAnimations) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, loading, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
