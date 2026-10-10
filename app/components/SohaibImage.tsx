import React from "react";

type TechIcon = { name: string; src: string };

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// Apne icons yahan badlo (public folder ke path bhi de sakte ho, jaise "/icons/react.svg")
const icons: TechIcon[] = [
  { name: "React", src: `${CDN}/react/react-original.svg` },
  { name: "TypeScript", src: `${CDN}/typescript/typescript-original.svg` },
  { name: "Tailwind CSS", src: `${CDN}/tailwindcss/tailwindcss-original.svg` },
  { name: "Node.js", src: `${CDN}/nodejs/nodejs-original.svg` },
  { name: "JavaScript", src: `${CDN}/javascript/javascript-original.svg` },
  { name: "Git", src: `${CDN}/git/git-original.svg` },
];

// Ek poora chakkar kitne seconds mein (kam = tez)
const DURATION = 24;

const spin = "animate-[spin_24s_linear_infinite] motion-reduce:animate-none";

export default function SohaibImage() {
  return (
    <div
      className={`flex w-full items-center justify-center  px-4 py-8 sm:py-12 `}
    >
      {/* Wrapper: square rehta hai, screen ke hisaab se scale hota hai */}
      <div className="relative aspect-square w-full max-w-60 sm:max-w-85 md:max-w-105 lg:max-w-100">
        {/* Circle */}
        <div className="absolute inset-0 rounded-full bg-(--orbit-bg) ring-1 ring-(--border-soft)" />

        {/* Orbit: ring ghoomti hai, icons circle ke kinare par */}
        <div
          className={`absolute inset-0 ${spin}`}
          style={{ animationDuration: `${DURATION}s` }}
        >
          {icons.map((icon, i) => {
            const angle = (i / icons.length) * 2 * Math.PI - Math.PI / 2;
            const left = 50 + 50 * Math.cos(angle);
            const top = 50 + 50 * Math.sin(angle);

            return (
              <div
                key={icon.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {/* Ulta ghoomta hai taake icon seedha rahe */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-(--orbit-icon-bg) p-2 ring-1 ring-(--border-soft) sm:h-11 sm:w-11 md:h-14 md:w-14 md:p-3 ${spin}`}
                  style={{
                    animationDuration: `${DURATION}s`,
                    animationDirection: "reverse",
                  }}
                >
                  <img
                    src={icon.src}
                    alt={icon.name}
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Person: circle ke bottom se aligned, thora upar bahar nikalta hua */}
        <img
          src="/sohaib.png"
          alt="Sohaib"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[112%] w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom "
        />
      </div>
    </div>
  );
}
