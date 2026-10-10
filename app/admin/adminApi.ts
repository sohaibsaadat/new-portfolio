export const ADMIN_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export const PUBLIC_API = ADMIN_API;

export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  console.log(ADMIN_API);
  
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  if (token) headers.set("token", token);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const response = await fetch(`${ADMIN_API}/${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data as T;
}

export const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: "⌂" },
  { label: "Projects", href: "/admin/projects", icon: "▧" },
  { label: "Skills", href: "/admin/skills", icon: "✳" },
  { label: "Contact", href: "/admin/contact", icon: "◎" },
  { label: "Resume", href: "/admin/resume", icon: "▤" },
];
