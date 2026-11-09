export type Step = { title: string; text: string };
export type Faq = { q: string; a: string };
export type Benefit = { title: string; text: string; icon?: string };

export type ServiceData = {
  icon: string;
  short: string;
  seoTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  problem: string;
  benefits: Benefit[];
  included: string[];
  audience: string[];
  steps: Step[];
  faqs: Faq[];
  whatsappMessage: string;
};

export type Service = {
  id: number;
  slug: string;
  title: string;
  position: number;
  active: boolean;
  updatedAt: string;
} & ServiceData;

export type LandingData = {
  seoTitle: string;
  metaDescription: string;
  kicker: string;
  headline: string;
  subheadline: string;
  problem: string;
  benefits: Benefit[];
  included: string[];
  steps: Step[];
  faqs: Faq[];
  ctaLabel: string;
  serviceSlug: string;
  whatsappMessage: string;
  noindex: boolean;
};

export type Landing = {
  id: number;
  slug: string;
  title: string;
  active: boolean;
  updatedAt: string;
} & LandingData;

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  position: number;
  postCount?: number;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  categoryId: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  author: string;
  status: PostStatus;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  serviceSlug: string;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: number;
  name: string;
  company: string;
  text: string;
  authorized: boolean;
  active: boolean;
  position: number;
};

export type LeadStatus = "novo" | "em_contato" | "proposta" | "cliente" | "descartado";

export type Lead = {
  id: number;
  createdAt: string;
  form: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpj: string;
  companyType: string;
  companySize: string;
  service: string;
  message: string;
  page: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  consentAt: string;
  status: LeadStatus;
  notes: string;
  delivery: string;
};

export type Role = "admin" | "editor";

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  lastLoginAt: string | null;
};
