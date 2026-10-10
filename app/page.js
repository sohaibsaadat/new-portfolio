import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import About from './components/About'
import Projects from './components/Projects'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

const page = () => {
  return (
    <div className='relative px-5 bg-(--page-bg)'>
      <Navbar/>
      <Hero/>
      <Skills/>
      <About/>
      <Projects/>
      <ContactForm/>
      <Footer/>
    </div>
  )
}

export default page
