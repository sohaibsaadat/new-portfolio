'use client'
import { Menu, SunMoon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { PUBLIC_API } from "../admin/adminApi";


const Navbar = () => {

    const [open,setOpen] = useState(false)
    const [resumeUrl,setResumeUrl] =useState("")

     useEffect(() => {
        fetch(`${PUBLIC_API}/get-resume`)
          .then((response) => response.json())
          .then((data: { success: boolean; resume: { url: string } | null }) => {
            if (data.success && data.resume?.url) setResumeUrl(data.resume.url);
          })
          .catch((error) => console.error("Load resume link error:", error));
      }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme")
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.dataset.theme = savedTheme
    }
  }, [])

  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    const nextTheme = currentTheme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem("portfolio-theme", nextTheme)
  }

  const renderThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle light/dark theme"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--muted-foreground) transition-colors hover:bg-(--surface-muted) hover:text-(--foreground)"
    >
            <SunMoon size={18} />
    </button>
  )

    const navItems = [
        {
            name:"Home",
            id:"home"
        },
        {
            name:"About Me",
            id:"about"
        },
        {
            name:"Skills",
            id:"skill"
        },
        {
            name:"Projects",
            id:"projects"
        },
        {
            name:"Contact",
            id:"contact"
        }
    ]
  return (
    <>
    <div className="flex sm:hidden  absolute top-0 left-0 w-full z-50  items-center p-3">
        <div className="flex w-1/3 items-center gap-2">
        <Menu onClick={()=>setOpen(!open)} className=" text-orange-600 "/>
        {renderThemeToggle()}
        </div>
         <h1 className="w-1/3 text-orange-500 font-bold text-xl italic">
        Sohaib Ali.
      </h1>
 {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" className="w-1/3 bg-orange-500 text-center text-white px-1 py-2 rounded-lg hover:scale-105 transition-all duration-400 ease-in-out cursor-pointer text-sm font-semibold">Download CV</a>}

    </div>

     <div
  className={`
    fixed top-0 left-0 z-50 p-4 h-screen w-full bg-(--drawer-bg)
    transform transition-transform duration-300 ease-in-out
    flex flex-col items-center gap-8 sm:hidden

    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
>
  <X className="text-orange-500  scale-150  " onClick={() => setOpen(false)} />
  <div className="w-full">
    <ul className="w-full  items-center justify-center gap-8  flex flex-col ">
        {
            navItems.map((nav,index)=>(
                <a className="text-center hover:text-orange-600 cursor-pointer w-full text-(--muted-foreground) text-2xl border-b border-(--border-soft)" key={index} href={nav.id}>

{nav.name}
                </a>
            ))
        }
        
    </ul>
  </div>
</div>
    

{/* Mobile Display End */}

     <div className="sm:flex hidden  absolute top-0 left-0 w-full z-50 md:px-16 px-4 py-4  justify-between items-center">
      <div className="text-orange-500 cursor-pointer font-bold text-[clamp(1rem,3vw,4rem)] italic">
        Sohaib Ali.
      </div>
      <div className="flex-1">
        <ul className="text-(--muted-foreground) text-[clamp(1rem,2vw,1rem)] flex justify-center lg:gap-12 gap-4 items-center">
            {
                navItems.map((nav,index)=>(
                     <a key={index} href={`#${nav.id}`} className="group hover:text-orange-400 cursor-pointer transition-all ease-in-out duration-200  ">{nav.name}
                <span className="block max-w-0 h-1 group-hover:max-w-full transition-all duration-400 ease-in-out bg-orange-400"></span>
            </a>
                ))
            }
         
             </ul>
      </div>
      <div className="flex items-center gap-2">
        {renderThemeToggle()}
        {resumeUrl && 
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-400 ease-in-out cursor-pointer font-semibold">Download CV</a>

        }
      </div>
    </div>  


  
    </>
       
  )
}

export default Navbar
