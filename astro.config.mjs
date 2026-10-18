import { defineConfig } from "astro/config";

// Static output for S3 + CloudFront. Directory URLs ("/privacy/") are rewritten to
// index.html by the CloudFront function in infra/website.yml.
export default defineConfig({
  site: "https://onemrr.dev",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory", inlineStylesheets: "auto" },
  compressHTML: true,
  // Keep scripts as files so the Content-Security-Policy can be script-src 'self'.
  vite: { build: { assetsInlineLimit: 0 } },
});
