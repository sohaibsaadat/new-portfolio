"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { adminRequest } from "../adminApi";

type Skill = { _id: string; title: string; description: string; svg: string };
type SkillsResponse = { success: boolean; skills: Skill[] };
const EMPTY_SKILL = { title: "", description: "" };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(EMPTY_SKILL);
  const [svg, setSvg] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadSkills() {
    const data = await adminRequest<SkillsResponse>("get-all-skills");
    setSkills(data.skills);
  }

  useEffect(() => {
    let active = true;
    adminRequest<SkillsResponse>("get-all-skills")
      .then((data) => { if (active) setSkills(data.skills); })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load skills."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function resetForm() {
    setEditing(null);
    setForm(EMPTY_SKILL);
    setSvg(null);
  }

  function editSkill(skill: Skill) {
    setEditing(skill);
    setForm({ title: skill.title, description: skill.description });
    setSvg(null);
  }

  async function saveSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    if (svg) body.append("svg", svg);
    try {
      await adminRequest(editing ? `update-skill/${editing._id}` : "create-skill", {
        method: editing ? "PATCH" : "POST",
        body,
      });
      await loadSkills();
      setNotice(editing ? "Skill updated." : "Skill added.");
      resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save skill.");
    } finally {
      setBusy(false);
    }
  }

  async function removeSkill(id: string) {
    if (!window.confirm("Delete this skill?")) return;
    setError("");
    try {
      await adminRequest(`delete-skill/${id}`, { method: "DELETE" });
      setSkills((items) => items.filter((skill) => skill._id !== id));
      if (editing?._id === id) resetForm();
      setNotice("Skill deleted.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete skill.");
    }
  }

  const fieldClass = "mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-400";

  return (
    <div className="mx-auto max-w-6xl">
      <div><p className="text-sm text-orange-300">Portfolio content</p><h1 className="mt-1 text-3xl font-semibold">Skills</h1><p className="mt-2 text-sm text-zinc-400">Add skills with an SVG icon, or update and remove existing entries.</p></div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-300">{notice}</p>}
      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={saveSkill} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold">{editing ? "Edit skill" : "New skill"}</h2>{editing && <button type="button" onClick={resetForm} className="text-xs text-zinc-400">Cancel</button>}</div>
          <label className="mt-5 block text-sm text-zinc-300">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">Description<textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">SVG icon{editing && <span className="text-zinc-500"> (optional when editing)</span>}<input required={!editing} type="file" accept=".svg,image/svg+xml" onChange={(event) => setSvg(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200" /></label>
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-60">{busy ? "Saving…" : editing ? "Save changes" : "Add skill"}</button>
        </form>
        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Your skills</h2><span className="text-sm text-zinc-500">{skills.length} total</span></div>
          {loading ? <p className="rounded-xl border border-white/10 p-5 text-sm text-zinc-400">Loading skills…</p> : skills.length === 0 ? <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-zinc-400">No skills yet. Upload an SVG to add one.</p> :
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((skill) => <article key={skill._id} className="flex gap-4 rounded-xl border border-white/10 bg-zinc-900 p-4">
                <Image src={skill.svg} alt="" width={40} height={40} unoptimized className="h-10 w-10 shrink-0 object-contain" />
                <div className="min-w-0 flex-1"><h3 className="font-medium">{skill.title}</h3><p className="mt-1 text-sm text-zinc-400">{skill.description}</p><div className="mt-3 flex gap-2"><button onClick={() => editSkill(skill)} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">Edit</button><button onClick={() => removeSkill(skill._id)} className="rounded-md border border-red-400/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10">Delete</button></div></div>
              </article>)}
            </div>}
        </section>
      </div>
    </div>
  );
}
