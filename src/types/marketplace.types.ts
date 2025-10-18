// Feature 8: Marketplace Type System
export interface MarketplaceItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  longDescription: string;
  author: MarketplaceAuthor;
  version: string;
  category: string;
  tags: string[];
  price: Price;
  downloads: number;
  rating: Rating;
  reviews: ItemReview[];
  screenshots: string[];
  documentation: string;
  changelog: ChangelogEntry[];
  dependencies: ItemDependency[];
  compatibility: Compatibility;
  license: License;
  repository?: string;
  homepage?: string;
  createdAt: Date;
  updatedAt: Date;
  status: ItemStatus;
  featured: boolean;
}

export enum ItemType {
  COMPONENT = 'component',
  TEMPLATE = 'template',
  PLUGIN = 'plugin',
  THEME = 'theme',
  LIBRARY = 'library',
  TOOL = 'tool',
}

export interface MarketplaceAuthor {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  verified: boolean;
  totalItems: number;
  totalDownloads: number;
  averageRating: number;
}

export interface Price {
  amount: number;
  currency: string;
  type: PriceType;
  trialDays?: number;
  subscriptionInterval?: 'monthly' | 'yearly';
}

export enum PriceType {
  FREE = 'free',
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  PAY_WHAT_YOU_WANT = 'pay_what_you_want',
}

export interface Rating {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ItemReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  response?: AuthorResponse;
}

export interface AuthorResponse {
  content: string;
  createdAt: Date;
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
  }[];
}

export interface ItemDependency {
  name: string;
  version: string;
  required: boolean;
}

export interface Compatibility {
  minVersion: string;
  maxVersion?: string;
  platforms: string[];
  browsers: string[];
}

export interface License {
  type: LicenseType;
  url?: string;
  text?: string;
}

export enum LicenseType {
  MIT = 'MIT',
  APACHE_2 = 'Apache-2.0',
  GPL_3 = 'GPL-3.0',
  BSD_3 = 'BSD-3-Clause',
  PROPRIETARY = 'Proprietary',
  CUSTOM = 'Custom',
}

export enum ItemStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  REJECTED = 'rejected',
  DEPRECATED = 'deprecated',
  REMOVED = 'removed',
}

// Feature 9: Purchase and Installation
export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  price: number;
  currency: string;
  status: PurchaseStatus;
  purchasedAt: Date;
  license: PurchaseLicense;
  receipt: string;
}

export enum PurchaseStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface PurchaseLicense {
  key: string;
  activations: number;
  maxActivations: number;
  expiresAt?: Date;
}

export interface Installation {
  id: string;
  userId: string;
  projectId: string;
  itemId: string;
  version: string;
  installedAt: Date;
  status: InstallationStatus;
  config?: Record<string, any>;
}

export enum InstallationStatus {
  INSTALLED = 'installed',
  UPDATING = 'updating',
  REMOVING = 'removing',
  ERROR = 'error',
}

// Feature 10: Collections and Curation
export interface Collection {
  id: string;
  name: string;
  description: string;
  curator: string;
  items: string[];
  followers: number;
  visibility: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

export interface CuratedList {
  id: string;
  title: string;
  description: string;
  category: string;
  items: MarketplaceItem[];
  order: number;
  featured: boolean;
  createdAt: Date;
}
