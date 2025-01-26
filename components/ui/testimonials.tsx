'use client'
import { useState, useEffect } from 'react'
import { NeutronIcon } from './icon'

const testimonials = [
  {
    text: "Neutron helps me keep track of all my reading materials in one place. It's simple, fast, and just works.",
    author: "Sofia Davis",
    role: "Product Designer"
  },
  {
    text: "I've tried many bookmarking tools, but Neutron's clean interface and smart organization keeps me coming back.",
    author: "Alex Rivera",
    role: "Software Engineer"
  },
  {
    text: "The automatic article summaries save me so much time. It's like having a personal reading assistant.",
    author: "Emma Chen",
    role: "Content Creator"
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => 
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
          )
          return 0
        }
        return prev + 1
      })
    }, 150) // 15 seconds total duration (150ms * 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex h-full flex-col">
      <div className="absolute inset-0" />
      <div className="relative z-20 flex flex-col items-center text-lg font-medium">
        <div className="flex items-center">
          <NeutronIcon className="h-8 w-8" />
          <span className="ml-2">Neutron</span>
        </div>
        <div className="mt-4 h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg transition-opacity duration-500">
            &quot;{testimonials[currentIndex].text}&quot;
          </p>
          <footer className="text-sm">
            <p className="font-semibold">{testimonials[currentIndex].author}</p>
            <p className="text-zinc-400">{testimonials[currentIndex].role}</p>
          </footer>
        </blockquote>
      </div>
    </div>
  )
} 