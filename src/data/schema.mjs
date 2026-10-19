/**
 * schema.org structured data. Keep it within the README "Claims": no ratings, reviews or
 * customer counts. Offers come from src/data/plans.mjs: Free, plus Launch and Growth once paid plans are live.
 */
import { plans, pricing } from "./plans.mjs";

const SITE = "https://onemrr.dev/";

export const organization = {
  "@type": "Organization",
  "@id": `${SITE}#organization`,
  name: "OneMRR",
  url: SITE,
  email: "hello@onemrr.dev",
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE}#website`,
  name: "OneMRR",
  url: SITE,
  publisher: { "@id": organization["@id"] },
};

export const softwareApplication = {
  "@type": "SoftwareApplication",
  "@id": `${SITE}#app`,
  name: "OneMRR",
  url: SITE,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "MRR, ARR and churn analytics across Stripe, the Shopify App Store and the Wix App Market, with Churn Signals, retention emails and cancellation surveys.",
  publisher: { "@id": organization["@id"] },
  offers: plans
    .filter((p) => p.price === 0 || pricing.paidPlansLive)
    .map((p) => ({
      "@type": "Offer",
      name: `OneMRR ${p.name}`,
      price: String(p.price),
      priceCurrency: pricing.currency,
      description: p.outcome,
      url: `${SITE}pricing`,
      ...(p.price ? { priceSpecification: { "@type": "UnitPriceSpecification", price: String(p.price), priceCurrency: pricing.currency, billingDuration: "P1M", unitText: "MONTH" } } : {}),
    })),
};

/** @param {{ q: string, a: string }[]} faqs */
export const faqPage = (faqs) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
