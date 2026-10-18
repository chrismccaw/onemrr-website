---
target: onemrr.dev homepage
total_score: 25
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
target_identity: "file:/Users/cmccaw/Projects/onemrr-website/src/pages/index.astro"
target_fingerprint: "sha256:92b4f4d42600157ba5caff8b62e1cc4979f3c9cdad376400483070bb3081c084"
target_path: /Users/cmccaw/Projects/onemrr-website/src/pages/index.astro
timestamp: 2026-10-18T23-16-29Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser)

Design Health: H1 3, H2 3, H3 2, H4 3, H5 3, H6 3, H7 n/a, H8 2, H9 3, H10 3 = 25/36 (69%, Good).

Specificity: content specific (honest, reconciled demos; Bluebird Bakery thread); scaffold generic (eyebrow/h2/lede/dark-panel repeated). Detector: src clean; dist 42 findings, mostly intentional (.app shadow token x12, avatar initials x16, wordmark mint, mocked toast/email footer); real: FAQ/.note line length ~90ch, Shopify badge 4.2:1.

Priority issues:
- [P0] Three-part promise not visible above the fold: hero notice hidden ~55% of loop, below fold on phone; no Act in hero. Fix: notice in resting frame with "Draft ready · Review email"; drop dead padding. /impeccable layout
- [P1] Phone demo feedback off-screen (Signals stage 1079px in 812 viewport; Retention buttons vs status 660px apart). Fix: chip-strip steps + caption under steps <560px; status above panel. /impeccable adapt
- [P1] Triad labels inconsistent; nav omits Retention; no phone nav. Fix: Understand/Detect/Act nav, retitle How, compact phone menu. /impeccable clarify
- [P2] Hero loop unpausable on touch; "every billing platform" and "Give them a reason to stay" overclaim. /impeccable harden
- [P2] CTAs have no risk reducer; secondary CTA skips the story. /impeccable clarify

Personas: Jordan (h1 doesn't name product; code block implies dev work; no cost), Riley (97% click-through funnel; "23 customers" shows 4), Casey (no nav, off-screen feedback, notice below fold).

Minor: mint used for bullets; demo orange out-pulls CTA; FAQ line length; final CTA band reads as demo; founder photo.
Rejected: moving Reconcile (brief order); self-hosting claim (no license).
