import React from 'react'
import Hero from '@/components/home-component/Hero'
import OurServices from '@/components/home-component/OurServices'
import HomeAbout from '@/components/home-component/HomeAbout'
import FeaturedProjects from '@/components/home-component/FeaturedProjects'
import TestimonialsSection from '@/components/home-component/TestimonialsSection'
import CallToAction from '@/components/home-component/CallToAction'
import RequestQuote from '@/components/home-component/RequestQuote'
import ClientsLogoSlider from '@/components/home-component/ClientsLogoSlider'
import SubscribeToNewsletter from '@/components/home-component/SubscribeToNewsletter'
import HomeStats from '@/components/home-component/HomeStats'
import MyLanguagesServices from '@/components/home-component/MyLanguagesServices'
import HistoryMilestones from '@/components/home-component/HistoryMilestones'
import AboutMe from '@/components/home-component/AboutMe'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutMe />
      <HomeStats />
      <MyLanguagesServices />
      <FeaturedProjects />
      <HistoryMilestones />
      <ClientsLogoSlider />
      <TestimonialsSection />
      <CallToAction />
      <RequestQuote />
      <SubscribeToNewsletter />
    </>
  )
}
