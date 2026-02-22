"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Download, Loader, Linkedin, Github, Mail, Instagram, MessageCircle } from 'lucide-react'

// Icon mapping
const ICON_MAP = {
  Linkedin: Linkedin,
  Github: Github,
  Mail: Mail,
  Instagram: Instagram,
  MessageCircle: MessageCircle,
}

export default function Hero() {
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('/api/hero?type=content')
      const data = await response.json()
      
      if (data.success && data.content) {
        setHeroData(data.content)
      } else {
        setError('Failed to load hero content')
      }
    } catch (err) {
      console.error('Failed to fetch hero content:', err)
      setError('Failed to load hero content')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-gray-50">
        <div className="min-h-[500px] flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </section>
    )
  }

  if (error || !heroData) {
    return (
      <section className="w-full bg-gray-50">
        <div className="min-h-[500px] flex items-center justify-center">
          <p className="text-gray-600">{error || 'No hero content available'}</p>
        </div>
      </section>
    )
  }

  return (
    // add background image with opacity
    <section className="w-full bg-[url('/img/Hero.svg')] bg-cover bg-center relative">
      {/* Overlay for opacity */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="mx-auto px-6 md:px-12 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          
          {/* Left Side - Profile Image with Neon Circle */}
          {heroData.profileImage && (
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* Neon Blue Circle Background */}
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-600 bg-blue-50"
                  style={{
                    boxShadow: '0 0 40px rgba(37, 99, 235, 0.9), inset 0 0 40px rgba(37, 99, 235, 0.2)'
                  }}
                ></div>
                
                {/* Profile Image */}
                <Image
                  src={heroData.profileImage}
                  alt={heroData.name}
                  width={320}
                  height={320}
                  className="relative z-10 w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
            </div>
          )}

          {/* Right Side - Content */}
          <div className="md:w-1/2 order-1 md:order-2 inset-0 shadow-[inset_-40px_40px_40px_rgba(255,255,255,0.1),inset_40px_-40px_40px_rgba(165,165,165,0.1),0_4px_4px_rgba(0,0,0,0.25)] rounded-xl p-8 backdrop-blur-[25px]">
            
            {/* Greeting with Highlighted Name */}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-3 leading-tight text-gray-800">
              Hi! I'm <span className="text-blue-700">{heroData.name}</span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl md:text-2xl text-gray-600 font-medium mb-6 text-gray-800">
              {heroData.title}
            </h2>

            {/* Description */}
            <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-8">
              {heroData.description}
            </p>

            {/* Download Resume Button */}
            {heroData.resumeUrl && heroData.resumeUrl !== '#' && (
              <div className="mb-8">
                <Link
                  href={heroData.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </Link>
              </div>
            )}

            {/* Social Media Links */}
            {heroData.social && heroData.social.length > 0 && (
              <div className="flex gap-6 md:gap-8">
                {heroData.social.map((social) => {
                  const Icon = ICON_MAP[social.icon]
                  if (!Icon) return null
                  
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className={`text-gray-700 transition-all duration-200 hover:scale-125 ${social.color}`}
                    >
                      <Icon className="w-7 h-7 md:w-8 md:h-8" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}