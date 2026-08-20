import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AccessibilityContext = createContext(null)

const TEXT_SIZES = ['default', 'large', 'xlarge']

export function AccessibilityProvider({ children }) {
  const [textSize, setTextSize] = useState('default')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('a11y-text-large', 'a11y-text-xlarge')
    if (textSize === 'large') root.classList.add('a11y-text-large')
    if (textSize === 'xlarge') root.classList.add('a11y-text-xlarge')
  }, [textSize])

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-high-contrast', highContrast)
  }, [highContrast])

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-reduced-motion', reducedMotion)
  }, [reducedMotion])

  const cycleTextSize = () => {
    setTextSize((current) => {
      const idx = TEXT_SIZES.indexOf(current)
      return TEXT_SIZES[(idx + 1) % TEXT_SIZES.length]
    })
  }

  const value = useMemo(
    () => ({
      textSize,
      setTextSize,
      cycleTextSize,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion
    }),
    [textSize, highContrast, reducedMotion]
  )

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}
