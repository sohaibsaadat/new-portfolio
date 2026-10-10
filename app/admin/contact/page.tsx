"use client";

import { FormEvent, useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { adminRequest } from "../adminApi";

type SocialLink = { platform: string; url: string };
type Contact = { email: string; phone: string; socials: SocialLink[] };
type ContactResponse = { success: boolean; contact: Contact };

const CONTACT_DEFAULT: Contact = { email: "", phone: "", socials: [] };
const SOCIAL_PLATFORMS = ["Instagram", "X", "LinkedIn", "GitHub", "YouTube", "Facebook", "TikTok", "Website"];

export default function ContactAdminPage() {
  const [contact, setContact] = useState(CONTACT_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminRequest<ContactResponse>("get-contact")
      .then((data) => setContact({ ...CONTACT_DEFAULT, ...data.contact }))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load contact details."))
      .finally(() => setLoading(false));
  }, []);

  function updateSocial(index: number, field: keyof SocialLink, value: string) {
    setContact((current) => ({ ...current, socials: current.socials.map((link, i) => i === index ? { ...link, [field]: value } : link) }));
  }

  async function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await adminRequest<ContactResponse>("contact", { method: "PUT", body: JSON.stringify(contact) });
      setContact(data.contact);
      setNotice("Contact details saved.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save contact details.");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-400";

  return (
    <div className="mx-auto max-w-4xl">
      <div><p className="text-sm text-orange-300">Portfolio settings</p><h1 className="mt-1 text-3xl font-semibold">Contact & socials</h1><p className="mt-2 text-sm text-zinc-400">Add a URL for each social profile; its icon is generated from that URL.</p></div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-300">{notice}</p>}
      {loading ? <p className="mt-7 text-sm text-zinc-400">Loading contact details…</p> : <form onSubmit={saveContact} className="mt-7 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <h2 className="font-semibold">Contact details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-zinc-300">Email address<input type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} className={fieldClass} /></label>
            <label className="text-sm text-zinc-300">Phone number<input type="tel" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} className={fieldClass} /></label>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Social links</h2><p className="mt-1 text-sm text-zinc-400">Paste the full profile URL, including https://</p></div><button type="button" onClick={() => setContact({ ...contact, socials: [...contact.socials, { platform: "Instagram", url: "" }] })} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5">Add social link</button></div>
          <div className="mt-5 space-y-3">
            {contact.socials.map((social, index) => <div key={`${social.platform}-${index}`} className="flex flex-col gap-3 rounded-xl border border-white/10 p-3 sm:flex-row sm:items-center">
              <SocialIcon url={social.url || `https://${social.platform.toLowerCase()}.com`} style={{ height: 36, width: 36 }} />
              <select value={social.platform} onChange={(event) => updateSocial(index, "platform", event.target.value)} className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white sm:w-36">{SOCIAL_PLATFORMS.map((platform) => <option key={platform}>{platform}</option>)}</select>
              <input required type="url" placeholder="https://…" value={social.url} onChange={(event) => updateSocial(index, "url", event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-400" />
              <button type="button" onClick={() => setContact({ ...contact, socials: contact.socials.filter((_, i) => i !== index) })} className="rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
            </div>)}
            {contact.socials.length === 0 && <p className="rounded-lg border border-dashed border-white/15 p-5 text-center text-sm text-zinc-500">No social profiles added.</p>}
          </div>
        </section>
        <button disabled={saving} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-60">{saving ? "Saving…" : "Save contact details"}</button>
      </form>}
    </div>
  );
}
