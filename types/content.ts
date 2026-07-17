/**
 * Shared content model. Every layer speaks these types: mock JSON,
 * services, /api handlers, components, and the future CMS + backend.
 */

export type Lang = "en" | "ar";

/** A field available in both English and Arabic (used by the Grill). */
export type Localized<T = string> = { en: T; ar: T };

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
  mapUrl?: string;
}

export interface Hours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Contact {
  phone: string;
  email: string;
  socials?: SocialLink[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** Longer copy shown in the product detail dialog. */
  details?: string;
  /** Display string, e.g. "$12" or "$6–9" (display-only; supports ranges). */
  price?: string;
  /** Thumbnail / main photo path; placeholder until real photos land. */
  image?: string;
  /** Extra photos shown in the detail dialog (beyond `image`). */
  gallery?: string[];
  /** Small descriptor chips shown in the dialog, e.g. ["House Favorite", "Tequila"]. */
  tags?: string[];
  /** True while this is an invented example item pending the client's real list. */
  mock?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  /** Short label for the tab bar; falls back to `title`. */
  tabLabel?: string;
  intro: string;
  items: MenuItem[];
}

export interface MomentItem extends ImageAsset {
  id: string;
  type: "image" | "video";
  /** Frame shown before playback; effectively required when type is "video". */
  poster?: string;
  caption?: string;
}

/** One selectable option inside a build-your-own-bowl step. */
export interface BowlOption {
  id: string;
  name: string;
  description?: string;
  /** Upcharge shown on the chip, e.g. "+$2". Omit for included options. */
  price?: string;
  image?: string;
  /** True while this is an invented example pending the client's real list. */
  mock?: boolean;
}

/** A single step of the bowl builder (base, protein, spread, toppings). */
export interface BowlStep {
  id: string;
  /** e.g. "Choose your rice". */
  title: string;
  /** Short helper line under the title. */
  hint?: string;
  /** Allow more than one pick (toppings). Defaults to single-select. */
  multi?: boolean;
  options: BowlOption[];
}

/** The "Build Your Own Bowl" interactive block — Grill's signature feature. */
export interface BowlBuilder {
  eyebrow: string;
  title: string;
  intro: string;
  /** Base price the bowl starts at, e.g. "$12". Display-only. */
  basePrice?: string;
  steps: BowlStep[];
}

export type BusinessId = "bar" | "grill";

/** A business as shown on the hub chooser. */
export interface BrandCard {
  id: BusinessId;
  name: string;
  kind: string;
  blurb: string;
  href: string;
  buildingPhoto: ImageAsset;
  /** Shared key linking the hub photo to the destination hero (morph). */
  transitionName: string;
  mood: "night" | "day";
  /** Shows a "Halal Certified" badge on the card when true. */
  halal?: boolean;
}

/** HUB (`/`) content. */
export interface Brand {
  name: string;
  established: number;
  location: string;
  tagline: string;
  message: string;
  walkNote: string;
  businesses: BrandCard[];
}

/** BAR (`/bar`) — English only. */
export interface Bar {
  id: "bar";
  name: string;
  kind: string;
  established: number;
  tagline: string;
  blurb: string;
  about: string;
  aboutImage: ImageAsset;
  address: Address;
  contact: Contact;
  hours: Hours[];
  heroImage: ImageAsset;
  transitionName: string;
  menu: MenuCategory[];
  moments: MomentItem[];
}

/** GRILL (`/grill`) — bilingual (Arabic content rendered in a later pass). */
export interface Grill {
  id: "grill";
  name: Localized;
  kind: Localized;
  cuisine: Localized;
  halalCertified: boolean;
  tagline: Localized;
  blurb: Localized;
  /** About copy — bilingual field; English is rendered in this pass. */
  about: Localized;
  aboutImage: ImageAsset;
  /** Chef credited on the grilled-entrées story. */
  chef: { name: string; note: Localized };
  address: Address;
  contact: Contact;
  hours: Hours[];
  heroImage: ImageAsset;
  transitionName: string;
  /** Wraps, burgers, salads, grilled entrées — English for now. */
  menu: MenuCategory[];
  /** Signature build-your-own-bowl block. */
  bowl: BowlBuilder;
  moments: MomentItem[];
  /** True while contact details are placeholders awaiting the real values. */
  mockContact?: boolean;
}
