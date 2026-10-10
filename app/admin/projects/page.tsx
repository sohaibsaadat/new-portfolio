"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { adminRequest } from "../adminApi";

type Project = { _id: string; title: string; description: string; image: string; stack: string[]; github: string; live: string };
type ProjectsResponse = { success: boolean; projects: Project[] };

const EMPTY_PROJECT = { title: "", description: "", stack: "", github: "", live: "" };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProjects() {
    const data = await adminRequest<ProjectsResponse>("get-all-project");
    setProjects(data.projects);
  }

  useEffect(() => {
    let active = true;
    adminRequest<ProjectsResponse>("get-all-project")
      .then((data) => { if (active) setProjects(data.projects); })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load projects."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function startEdit(project: Project) {
    setEditing(project);
    setForm({ title: project.title, description: project.description, stack: project.stack.join(", "), github: project.github || "", live: project.live || "" });
    setImage(null);
    setNotice("");
  }

  function resetForm() {
    setEditing(null);
    setForm(EMPTY_PROJECT);
    setImage(null);
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("image", image);
    try {
      await adminRequest(editing ? `update-project/${editing._id}` : "create-project", {
        method: editing ? "PATCH" : "POST",
        body: payload,
      });
      await loadProjects();
      setNotice(editing ? "Project updated." : "Project added.");
      resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save project.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(id: string) {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setError("");
    try {
      await adminRequest(`delete-project/${id}`, { method: "DELETE" });
      setProjects((current) => current.filter((project) => project._id !== id));
      if (editing?._id === id) resetForm();
      setNotice("Project deleted.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete project.");
    }
  }

  const fieldClass = "mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-400";

  return (
    <div className="mx-auto max-w-6xl">
      <div><p className="text-sm text-orange-300">Portfolio content</p><h1 className="mt-1 text-3xl font-semibold">Projects</h1><p className="mt-2 text-sm text-zinc-400">Add work to your portfolio or update existing project details.</p></div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-300">{notice}</p>}
      <div className="mt-7 grid items-start gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={saveProject} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold">{editing ? "Edit project" : "New project"}</h2>{editing && <button type="button" onClick={resetForm} className="text-xs text-zinc-400 hover:text-white">Cancel</button>}</div>
          <label className="mt-5 block text-sm text-zinc-300">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">Description<textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">Tech stack <span className="text-zinc-500">(comma separated)</span><input value={form.stack} onChange={(event) => setForm({ ...form, stack: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">GitHub URL<input type="url" value={form.github} onChange={(event) => setForm({ ...form, github: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">Live demo URL<input type="url" value={form.live} onChange={(event) => setForm({ ...form, live: event.target.value })} className={fieldClass} /></label>
          <label className="mt-4 block text-sm text-zinc-300">Project image{editing && <span className="text-zinc-500"> (optional unless replacing)</span>}<input required={!editing} accept="image/*" type="file" onChange={(event) => setImage(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200" /></label>
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-60">{busy ? "Saving…" : editing ? "Save changes" : "Add project"}</button>
        </form>
        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Your projects</h2><span className="text-sm text-zinc-500">{projects.length} total</span></div>
          {loading ? <p className="rounded-xl border border-white/10 p-5 text-sm text-zinc-400">Loading projects…</p> : projects.length === 0 ? <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-zinc-400">No projects yet. Add your first project using the form.</p> :
            <div className="grid gap-3 sm:grid-cols-2">
              {projects.map((project) => <article key={project._id} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                {project.image && <Image src={project.image} alt="" width={800} height={400} unoptimized className="h-36 w-full object-cover" />}
                <div className="p-4"><h3 className="font-medium">{project.title}</h3><p className="mt-1 line-clamp-2 text-sm text-zinc-400">{project.description}</p><p className="mt-3 text-xs text-orange-300">{project.stack.join(" · ")}</p>
                  <div className="mt-4 flex gap-2"><button onClick={() => startEdit(project)} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">Edit</button><button onClick={() => removeProject(project._id)} className="rounded-md border border-red-400/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10">Delete</button></div>
                </div>
              </article>)}
            </div>}
        </section>
      </div>
    </div>
  );
}
