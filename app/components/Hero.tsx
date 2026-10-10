
'use client'
import React, { useEffect, useState } from 'react'
import { SocialIcon } from 'react-social-icons'
import TypewriterComponent from 'typewriter-effect'
import SohaibImage from './SohaibImage'
import { PUBLIC_API } from "../admin/adminApi";
import { FadeIn } from 'react-slide-fade-in'

type SocialLink = { platform: string; url: string };
type HeroContact = { socials: SocialLink[]; email: string; phone: string };
const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: 'LinkedIn', url: 'https://linkedin.com' },
  { platform: 'GitHub', url: 'https://github.com' },
  { platform: 'Instagram', url: 'https://instagram.com' },
  { platform: 'X', url: 'https://x.com' },
];

const Hero = () => {
const [socials, setSocials] = useState(DEFAULT_SOCIALS);
const [resumeUrl, setResumeUrl] = useState("");
const [projectCount, setProjectCount] = useState(7);
const [repoCount, setRepoCount] = useState(24);


useEffect(() => {
  fetch(`${PUBLIC_API}/get-contact`)
    .then((response) => response.json())
    .then((data: { success: boolean; contact: HeroContact }) => {
      if (data.success && Array.isArray(data.contact.socials)) setSocials(data.contact.socials);
    })
    .catch((error) => console.error("Load portfolio contact error:", error));
  fetch(`${PUBLIC_API}/get-resume`)
    .then((response) => response.json())
    .then((data: { success: boolean; resume: { url: string } | null }) => {
      if (data.success && data.resume?.url) setResumeUrl(data.resume.url);
    })
    .catch((error) => console.error("Load portfolio resume error:", error));
  fetch(`${PUBLIC_API}/get-all-project`)
    .then((response) => response.json())
    .then((data: { success: boolean; projects: unknown[] }) => {
      if (data.success && Array.isArray(data.projects)) setProjectCount(data.projects.length);
    })
    .catch((error) => console.error("Load project count error:", error));


 fetch("https://api.github.com/users/sohaibsaadat")
    .then((response) => response.json())
    .then((response)=> setRepoCount(response.public_repos))
    .catch((error) => console.error("Load portfolio resume error:", error));


}, []);
  return (
    <div id="home" className='flex lg:flex-row min-h-screen flex-col   pt-30 '>
     <div className=' flex  flex-col gap-12 lg:px-15 px-0 w-full'>
       <FadeIn 
      from="bottom"
      positionOffset={50}
      triggerOffset={50}
      delayInMilliseconds={0}
    >

 <div className='w-full flex lg:text-start text-center flex-col gap-8 justify-center'>
      <h1 className='text-(--muted-foreground) text-xl '>Hi I am</h1>
      <h1 className='text-(--subtle-foreground) text-2xl font-semibold tracking-widest -mt-8 '>Sohaib Ali</h1>
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-orange-600 via-orange-400 to-orange-500 bg-clip-text text-transparent">
<TypewriterComponent  options={{
    strings: ['Full Stack Developer...', ' MERN Stack Developer...', ' PERN Stack Developer...'],
    autoStart: true,
    loop: true,
  }}   />

      </h1>

      <div className='flex w-full justify-center gap-4'>
        {socials.map((social) => <SocialIcon key={`${social.platform}-${social.url}`} className='border-2 border-orange-600 rounded-full scale-80' url={social.url}/>)}
      </div>
<div className=' gap-4 flex  justify-center'>
  <a href="#contact" className='bg-orange-500 text-white lg:px-10 px-5 py-1 lg:py-3 rounded-lg'>Contact</a>
  {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" className='border-(--border) border lg:px-5 px-3 py-1 lg:py-3 text-(--subtle-foreground) rounded-lg'>Download resume</a>}
</div>
     </div>
         

<div className='flex justify-between rounded bg-(--hero-stats-bg) p-2 m-2 '>

  <div className='flex flex-col justify-center items-center border-r p-2 w-1/3 border-(--border) '>
    <p className='text-orange-500 font-semibold text-[clamp(1rem,3vw,4rem)]'>2 Years+</p>
    <p className='text-(--foreground) font-semibold'>Experience</p>
  </div>
  <div className='flex flex-col justify-center items-center border-r p-2 w-1/3 border-(--border) '>
    <p className='text-orange-500 font-semibold text-[clamp(1rem,3vw,4rem)]'>{projectCount}+</p>
    <p className='text-(--foreground) font-semibold'>Projects</p>
  </div>
  <div className='flex flex-col justify-center items-center p-2 w-1/3 border-(--border) '>
    <p className='text-orange-500 font-semibold text-[clamp(1rem,3vw,4rem)]'>{repoCount}+</p>
    <p className='text-(--foreground) font-semibold'>GitHub Repos</p>
  </div>
</div>

</FadeIn>
     </div>
    
      {/* Main Outer Container */}
   <SohaibImage/>

    </div>
  )
}

export default Hero
