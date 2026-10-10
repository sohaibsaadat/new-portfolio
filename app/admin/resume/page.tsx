"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminRequest } from "../adminApi";

type Resume = { url: string; filename: string; updatedAt: string };
type ResumeResponse = { success: boolean; resume: Resume | null };

export default function ResumeAdminPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminRequest<ResumeResponse>("get-resume")
      .then((data) => setResume(data.resume))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load resume."))
      .finally(() => setLoading(false));
  }, []);

  async function uploadResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    const body = new FormData();
    body.append("resume", file);
    try {
      const data = await adminRequest<ResumeResponse>("resume", { method: "PUT", body });
      setResume(data.resume);
      setFile(null);
      event.currentTarget.reset();
      setNotice("Resume uploaded successfully.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to upload resume.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div><p className="text-sm text-orange-300">Portfolio settings</p><h1 className="mt-1 text-3xl font-semibold">Resume</h1><p className="mt-2 text-sm text-zinc-400">Upload a PDF to publish it, or upload a new file to replace the current resume.</p></div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-300">{notice}</p>}
      <section className="mt-7 rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-7">
        <h2 className="font-semibold">Current resume</h2>
        {loading ? <p className="mt-4 text-sm text-zinc-400">Loading resume…</p> : resume ? <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 p-4">
          <div><p className="font-medium">{resume.filename || "Resume PDF"}</p><p className="mt-1 text-xs text-zinc-500">{resume.updatedAt ? `Updated ${new Date(resume.updatedAt).toLocaleDateString()}` : "Uploaded"}</p></div>
          <a href={resume.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5">View PDF ↗</a>
        </div> : <p className="mt-4 rounded-xl border border-dashed border-white/15 p-5 text-sm text-zinc-400">No resume uploaded yet.</p>}
        <form onSubmit={uploadResume} className="mt-7">
          <label className="block text-sm text-zinc-300">Choose a PDF<input required accept="application/pdf,.pdf" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2.5 file:text-zinc-200" /></label>
          <button disabled={saving} className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-60">{saving ? "Uploading…" : resume ? "Replace resume" : "Upload resume"}</button>
        </form>
      </section>
    </div>
  );
}
