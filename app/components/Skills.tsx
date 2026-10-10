"use client";
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { PUBLIC_API } from "../admin/adminApi";
import { FadeIn } from 'react-slide-fade-in'


interface Skill {
  _id?: string;
  title: string;
  description: string;
  svg: string;
}

const DEFAULT_SKILLS: Skill[] = [
  { title: "React.js", description: "Building dynamic, highly interactive user interfaces with reusable component architecture.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { title: "TypeScript", description: "Writing clean, type-safe, and maintainable code to prevent runtime errors.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { title: "Node.js", description: "Structuring fast, scalable server-side applications and RESTful backend APIs.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { title: "PostgreSQL", description: "Designing robust relational databases, optimizing queries, and managing data persistence.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { title: "Socket.io", description: "Enabling real-time bidirectional communication for live chat and instant notification systems.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  { title: "Tailwind CSS", description: "Crafting modern, responsive, and mobile-friendly UI designs with utility-first CSS.", svg: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
];

const Skills = () => {
  const [skillData, setSkillData] = useState<Skill[]>(DEFAULT_SKILLS);

  useEffect(() => {
    fetch(`${PUBLIC_API}/get-all-skills`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load skills");
        const data = await response.json();
        if (data.success && Array.isArray(data.skills)) {
          setSkillData(data.skills.map((skill: { _id: string; title: string; description: string; svg: string }) => ({
            _id: skill._id,
            title: skill.title,
            description: skill.description,
            svg: skill.svg,
          })));
        }
      })
      .catch((error) => console.error("Load portfolio skills error:", error));
  }, []);
  return (
    <div id='skill' className=' py-8'>
      <div className='flex flex-col items-center     gap-4'>
        <h1 className='text-(--foreground) text-3xl font-bold text-center '>Skills</h1>
        <p className='text-gray-500 lg:text-xl w-full  lg:w-1/2 text-xs text-center '>&quot;Specializing in scalable full-stack web apps, clean backend architecture, and seamless real-time user experiences.&quot;</p>
      </div>
 <section id="services" className={`w-full px-3 py-6 sm:px-6 sm:py-10 lg:px-10`}>
      {/*
        Columns:
        - 360px se chota screen  -> 1 div
        - 360px+ (iPhone 16 etc) -> 2 divs
        - md (768px+) tablet/desktop -> 3 divs
      */}
      <div className="mx-auto  cursor-pointer grid max-w-5xl  grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
        {skillData.map((item, i) => (
           <FadeIn 
                from="bottom"
                positionOffset={50}
                triggerOffset={50}
                delayInMilliseconds={0}
                 key={item._id || item.title || i}
              >
          <article
           
            className="flex hover:-translate-y-2 hover:border-orange-500 border-2 border-(--border-soft) transition-all duration-200 ease-in-out hover:border-2 flex-col items-center rounded-xl bg-(--surface) px-3 py-5 text-center ring-1 ring-(--border-soft) sm:rounded-2xl sm:px-5 sm:py-8 lg:px-6 lg:py-10"
          >
            {/* Icon: screen ke sath bara hota hai */}
            <div className="h-5 w-5 text-orange-500 sm:h-7 sm:w-7 lg:h-9 lg:w-9">
             <Image src={item.svg} alt="" width={36} height={36} unoptimized />
            </div>

            <h3 className="mt-2 text-sm font-semibold text-orange-500 sm:mt-3 sm:text-lg lg:text-xl">
              {item.title}
            </h3>

            <p className="mt-2 text-[11px] leading-snug text-(--muted-foreground) sm:mt-3 sm:text-sm lg:text-base">
              {item.description}
            </p>
          </article></FadeIn>
        ))}
      </div>
    </section>
    </div>
  )
}

export default Skills
