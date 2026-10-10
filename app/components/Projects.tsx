"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PUBLIC_API } from "../admin/adminApi";
import { FadeIn } from 'react-slide-fade-in'

export type Project = {
  _id?: string;
  title: string;
  description: string;
  image: string; // e.g. "/projects/shop.png" (public folder) or full URL
  stack: string[];
  github?: string;
  live?: string;
};

// Replace with your own projects
const defaultProjects: Project[] = [
  {
    title: "ShopEase",
    description:
      "E-commerce store with cart, secure checkout and an admin dashboard for managing products and orders.",
    image: "/projects/shopease.png",
    stack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    github: "https://github.com/your-username/shopease",
    live: "https://shopease.example.com",
  },
  {
    title: "TaskFlow",
    description:
      "Kanban-style task manager with drag and drop boards, due dates and team collaboration.",
    image: "/projects/taskflow.png",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    github: "https://github.com/your-username/taskflow",
    live: "https://taskflow.example.com",
  },
  {
    title: "WeatherNow",
    description:
      "Weather app that shows live conditions and a 7-day forecast for any city, with saved locations.",
    image: "/projects/weathernow.png",
    stack: ["React", "JavaScript", "Tailwind CSS"],
    github: "https://github.com/your-username/weathernow",
    live: "https://weathernow.example.com",
  },
];

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

type ProjectsProps = {
  projects?: Project[];
  className?: string;
};

export default function Projects({
  projects = defaultProjects,
  className = "",
}: ProjectsProps) {
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects);

  useEffect(() => {
    fetch(`${PUBLIC_API}/get-all-project`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load projects");
        const data = await response.json();
        if (data.success && Array.isArray(data.projects)) setVisibleProjects(data.projects);
      })
      .catch((error) => console.error("Load portfolio projects error:", error));
  }, []);

  return (
    <section id="projects" className={`w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl text-center font-bold text-(--foreground) sm:mb-10 sm:text-3xl">
          Projects
        </h2>

        {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
             <FadeIn 
                      from="bottom"
                      positionOffset={100}
                      triggerOffset={50}
                      delayInMilliseconds={0}
                      key={project._id || project.title}

                    >

            <article
              className="group flex flex-col overflow-hidden rounded-2xl bg-(--surface) ring-1 ring-(--border-soft) transition-colors hover:ring-orange-500/40"
            >
              {/* Project picture */}
              <div className="aspect-video w-full overflow-hidden bg-(--surface-deep)">
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  width={1200}
                  height={675}
                  unoptimized
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Name */}
                <h3 className="text-lg font-semibold text-orange-500 sm:text-xl">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-(--muted-foreground)">
                  {project.description}
                </p>

                {/* Tech stack */}
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-(--surface-muted) px-2.5 py-1 text-xs text-(--subtle-foreground) ring-1 ring-(--border-soft)"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {/* Links: pinned to the bottom so all cards line up */}
                <div className="mt-auto flex gap-3 pt-5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-(--subtle-foreground) ring-1 ring-(--border) transition-colors hover:bg-(--surface-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <GithubIcon />
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <ExternalIcon />
                      View
                    </a>
                  )}
                </div>
              </div>
            </article>
                                </FadeIn>

          ))}
        </div>
      </div>
    </section>
  );
}
