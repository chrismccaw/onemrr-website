import type { APIRoute } from "astro";

const PAGES = ["/", "/churn-signals", "/integrations", "/pricing", "/security", "/docs", "/privacy", "/terms"];

export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${PAGES.map((p) => `<url><loc>${new URL(p, site)}</loc></url>`).join("")}</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
