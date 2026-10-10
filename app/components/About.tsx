"use client";
import React, { useEffect, useState } from 'react'
import SohaibImage from './SohaibImage'
import { PUBLIC_API } from "../admin/adminApi";
import { FadeIn } from 'react-slide-fade-in'

const About = () => {
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    fetch(`${PUBLIC_API}/get-resume`)
      .then((response) => response.json())
      .then((data: { success: boolean; resume: { url: string } | null }) => {
        if (data.success && data.resume?.url) setResumeUrl(data.resume.url);
      })
      .catch((error) => console.error("Load resume link error:", error));
  }, []);
  
  return (
     <FadeIn 
          from="bottom"
          positionOffset={100}
          triggerOffset={50}
          delayInMilliseconds={0}
        > 
    <div id="about" className='flex flex-col gap-8'>
        <div className='flex items-center flex-col gap-4'>
        <h1 className='text-(--foreground) text-3xl font-bold text-center '>About Me</h1>
        <p className='text-gray-500 lg:text-xl w-full  lg:w-1/2 text-xs text-center '>&quot;A full-stack developer passionate about building clean, performant web applications and crafting intuitive user experiences from the ground up.&quot;</p>
      </div>
      <div className='flex lg:flex-row items-center justify-center  flex-col gap-4'>
        <div className=' w-full lg:w-1/3'>
 <SohaibImage/>
         </div>
 <div className='flex flex-col lg:w-1/2 w-full items-center gap-8'>
<p className='text-(--subtle-foreground) text-justify'>

I’m a Full Stack Developer focused on building modern, scalable, and user-friendly web applications from end to end.

I work across the frontend and backend, using technologies like React.js, Next.js, TypeScript, Tailwind CSS, Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, and Socket.IO. I enjoy turning complex requirements into clean, maintainable solutions and building features such as authentication, real-time communication, role-based access, API integrations, and database-driven applications.

I’m passionate about writing clean code, improving application performance, and continuously exploring modern technologies to build better products. My goal is to create software that is not only visually polished but also **reliable, scalable, and practical for real-world users**.

Outside of development, I’m a huge cricket fan. 🏏

</p>
 {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" className="w-1/3 bg-orange-500 text-center text-white px-1 py-2 rounded-lg hover:scale-105 transition-all duration-400 ease-in-out cursor-pointer text-sm font-semibold">Download CV</a>}
 </div>

      </div>
     

    </div>
    </FadeIn>
  )
}

export default About
