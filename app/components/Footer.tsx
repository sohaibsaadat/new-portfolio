"use client";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { Mail, Phone } from "lucide-react";
import { PUBLIC_API } from "../admin/adminApi";

const NAV_LINKS = ["Home", "Services", "About me", "Portfolio", "Contact me"];
type ContactInfo = { email: string; phone: string; socials: { platform: string; url: string }[] };


export default function Footer() {
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "", socials: [] });

  useEffect(() => {
    fetch(`${PUBLIC_API}/get-contact`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load contact details");
        const data = await response.json();
        if (data.success) setContact(data.contact);
      })
      .catch((error) => console.error("Load footer contact error:", error));
  }, []);

  return (
    <footer className="w-full px-6 pb-8 pt-9 sm:px-10 sm:pb-6 sm:pt-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 sm:gap-5">
        <a href="#" className="text-2xl font-bold tracking-wide text-orange-500 sm:text-lg">
          SOHAIB ALI
        </a>

        <nav className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:gap-x-8">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <a
                key={link}
                href={["#home", "#services", "#about", "#projects"][NAV_LINKS.indexOf(link)]}
                className="text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground) sm:text-[13px]"
              >
                {link}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground) sm:hidden"
          >
            Contact me
          </a>
          <a
            href="#contact"
            className="hidden text-[13px] text-(--muted-foreground) transition-colors hover:text-(--foreground) sm:inline"
          >
            Contact me
          </a>
        </nav>

        <div className="flex items-center gap-3 sm:gap-2.5">
          {contact.socials.map((social) => <SocialIcon key={`${social.platform}-${social.url}`} url={social.url} style={{ height: 36, width: 36 }} />)}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          {contact.email && <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground) sm:text-[13px]"
          >
            <Mail className="h-[18px] w-[18px] sm:h-4 sm:w-4" />
            {contact.email}
          </a>}
          {contact.phone && <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2 text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground) sm:text-[13px]"
          >
            <Phone className="h-[18px] w-[18px] sm:h-4 sm:w-4" />
            {contact.phone}
          </a>}
        </div>

        <div className="mt-2 w-full border-t border-(--border-soft) pt-4 text-center sm:mt-1 sm:pt-3">
          <p className="text-xs text-(--muted-foreground)">
            Developed by Sohaib Ali
          </p>
        </div>
      </div>
    </footer>
  );
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M6.5 4.5c2.5 2.8 5.6 8 6.3 15" strokeLinecap="round" />
      <path d="M2.2 13c4.7 1.1 10.2 0.6 14-2" strokeLinecap="round" />
      <path d="M4 6.5c3.3 2.7 9 3.8 15.5 2.7" strokeLinecap="round" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="sans-serif"
      >
        Be
      </text>
    </svg>
  );
}
