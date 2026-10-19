/**
 * schema.org structured data. Keep it within the README "Claims": no ratings, reviews or
 * customer counts, and the only offer listed is the Free plan until paid plans are live.
 */
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
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free plan, free forever" },
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
