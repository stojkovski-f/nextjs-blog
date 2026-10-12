export const FOUNDATIONAL_SLUGS = [
  {
    slug: "bolan-grunder",
    order: 1,
  },
  {
    slug: "kontantinsats-skuldkvot",
    order: 2,
  },
  {
    slug: "bostadsratt-vs-villa",
    order: 3,
  },
  {
    slug: "budget-total-kostnad",
    order: 4,
  },
  {
    slug: "kopprocessen-budgivning",
    order: 5,
  },
  {
    slug: "due-diligence-forening",
    order: 6,
  },
  {
    slug: "forsta-gangskopare-stod",
    order: 7,
  },
] as const;

export type FoundationalSlug = (typeof FOUNDATIONAL_SLUGS)[number]["slug"];

export function isFoundationalSlug(slug: string): slug is FoundationalSlug {
  return FOUNDATIONAL_SLUGS.some((item) => item.slug === slug);
}
