"use client";

import { useState, FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from 'react-slide-fade-in'

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  timeline: string;
  details: string;
};

const SERVICES = [
  "Brand identity",
  "Web design",
  "Product design",
  "Development",
  "Consulting",
];

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  timeline: "",
  details: "",
};

const inputClasses =
  "w-full rounded-xl border border-(--field-border) bg-(--field-bg) px-4 py-3.5 text-[15px] text-(--foreground) placeholder:text-(--placeholder) transition-colors duration-150 focus:border-orange-500 focus:bg-(--field-focus) focus:outline-none";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setStatus("submitting");
      // Replace with your real endpoint, e.g. /api/contact
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("sent");
      setForm(initialState);
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
     <FadeIn 
                          from="bottom"
                          positionOffset={100}
                          triggerOffset={50}
                          delayInMilliseconds={0}
    
                        >

    <div     id="contact"
    className="flex  w-full items-start justify-center  px-5 py-12 sm:py-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[420px] flex-col gap-3.5"
      >
        <div className="mb-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-(--foreground)">
            Contact me
          </h1>
          <p className="mx-auto mt-2 max-w-[34ch] text-sm leading-relaxed text-(--muted-foreground)">
            Cultivating connections: reach out and connect with me
          </p>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          autoComplete="name"
          required
          className={inputClasses}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          required
          className={inputClasses}
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          autoComplete="tel"
          className={inputClasses}
        />

     

        <input
          type="text"
          placeholder="Timeline"
          value={form.timeline}
          onChange={(e) => update("timeline", e.target.value)}
          className={inputClasses}
        />

        <textarea
          placeholder="Project details..."
          value={form.details}
          onChange={(e) => update("details", e.target.value)}
          rows={4}
          className={`${inputClasses} min-h-[92px] resize-y leading-relaxed`}
        />

        {error && <p className="-mt-1 text-[13px] text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1.5 w-full rounded-full bg-(--submit-bg) px-5 py-3.5 text-[15px] font-semibold text-(--submit-foreground) ring-1 ring-(--border-soft) transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          {status === "submitting"
            ? "Sending..."
            : status === "sent"
            ? "Sent"
            : "Send message"}
        </button>

        {status === "sent" && (
          <p className="mt-1 text-center text-[13px] text-green-400">
            Thanks — your message is on its way. I&apos;ll be in touch soon.
          </p>
        )}
      </form>
    </div>
                            </FadeIn>

  );
}
