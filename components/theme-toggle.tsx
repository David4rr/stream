'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Extend CSSStyleDeclaration to include webkit-prefixed properties
interface CustomCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitClipPath?: string;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const currentTheme = theme || 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    const isDark = currentTheme === 'dark'

    // Circle color = new theme color
    const circleColor = isDark ? '#ffffff' : '#171717'

    // Create overlay with clip-path
    const overlay = document.createElement('div')

    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      background: ${circleColor};
      clip-path: circle(0% at ${x}px ${y}px);
      transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      -webkit-clip-path: circle(0% at ${x}px ${y}px);
    `

    document.body.appendChild(overlay)

    // Force reflow
    void overlay.offsetWidth

    // Start animation
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(150% at ${x}px ${y}px)`
      ;(overlay.style as CustomCSSStyleDeclaration).webkitClipPath = `circle(150% at ${x}px ${y}px)`
    })

    // Change theme
    setTimeout(() => {
      setTheme(newTheme)
    }, 200)

    // Cleanup
    setTimeout(() => {
      overlay.remove()
    }, 850)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="text-gray-900 dark:text-white hover:bg-gray-100/20 dark:hover:bg-gray-800/50 relative"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
