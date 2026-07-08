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
  address: Address;
  contact: Contact;
  hours: Hours[];
  heroImage: ImageAsset;
  transitionName: string;
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
  address: Address;
  contact: Contact;
  hours: Hours[];
  heroImage: ImageAsset;
  transitionName: string;
  /** True while contact details are placeholders awaiting the real values. */
  mockContact?: boolean;
}
