export type CreatorStatus = 'not_applied' | 'pending' | 'accepted' | 'not_accepted';

export type CampaignStep =
  | 'interest_check'
  | 'invitation'
  | 'product_phase'
  | 'order_placed'
  | 'order_received'
  | 'content_upload'
  | 'content_review'
  | 'compliance_feedback'
  | 'content_approved'
  | 'completed';

export interface SocialStats {
  platform: 'tiktok' | 'instagram';
  handle: string;
  followers: string;
  engagementRate: string;
  avgViews?: string; // TikTok-specific: avg views per video
  topCountry: string;
  topGender: string;
  topAgeRange: string;
}

export interface PastPost {
  id: string;
  platform: 'tiktok' | 'instagram_reel' | 'instagram_carousel' | 'instagram_story';
  link: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  status: 'approved' | 'needs_improvement' | 'missing';
  note?: string;
}

export interface Notification {
  id: string;
  type: 'campaign_invite' | 'compliance_feedback' | 'reminder' | 'acceptance' | 'content_approved' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  campaignId?: string;
  actionUrl?: string;
}

export type ContentLinkEntry = {
  id: string;
  platform: string;
  type: 'link' | 'upload';
  url: string;
  /** Simulated uploaded file name (prototype only) */
  fileName?: string;
  /** Caption / written text accompanying the upload */
  caption?: string;
};

export type PostingScheduleType = 'asap' | 'specific_date' | 'window';

export interface ProductOption {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  size?: string;
  stock?: number;
  price?: number;
}

export interface Campaign {
  id: string;
  brandName: string;
  brandColor?: string;
  title: string;
  description: string;
  compensationType: string;
  currentStep: CampaignStep;
  requirements: string[];
  hashtags: string[];
  contentDueDate: string;
  publishWindowStart: string;
  publishWindowEnd: string;
  paymentDetails: string;
  productType: 'gift_card' | 'product_choice';
  productCode?: string;
  productOptions?: ProductOption[];
  selectedProduct?: string;
  orderConfirmationNumber?: string;
  stepTimestamps?: Record<string, string>;
  contentSubmissions: ContentLinkEntry[];
  complianceFeedback?: string;
  complianceChecklist?: ComplianceItem[];
  complianceNotes?: string;
  publishedLinks: ContentLinkEntry[];
  brandThankYou?: string;
  declined?: boolean;
  declineReason?: string;
  // Brief summary shown during interest check
  briefSummary: string[];
  // Platforms required for this campaign
  requiredPlatforms: string[];
  // Admin override: force publish window open for demo
  publishWindowOpen?: boolean;
  // Posting schedule — how/when the creator should publish after approval
  postingSchedule: PostingScheduleType;
  postingDate?: string; // for 'specific_date' type
  // Brand about text for the brief
  brandAbout?: string;
  // Content deliverables (separate from requirements for display)
  contentDeliverables?: string[];
  // Other instructions (separate from requirements)
  otherInstructions?: string[];
  // Terms text (paragraph form)
  termsText?: string;
}

export const CAMPAIGN_STEPS: { key: CampaignStep; label: string }[] = [
  { key: 'interest_check', label: 'Brief' },
  { key: 'product_phase', label: 'Product' },
  { key: 'content_upload', label: 'Content' },
  { key: 'content_approved', label: 'Publish' },
  { key: 'completed', label: 'Complete' },
];

export function getStepIndex(step: CampaignStep): number {
  switch (step) {
    case 'interest_check':
    case 'invitation':
      return 0;
    case 'product_phase':
    case 'order_placed':
    case 'order_received':
      return 1;
    case 'content_upload':
    case 'content_review':
    case 'compliance_feedback':
      return 2;
    case 'content_approved':
      return 3;
    case 'completed':
      return 4;
  }
}

export const ALL_STEPS_ORDERED: CampaignStep[] = [
  'interest_check',
  'invitation',
  'product_phase',
  'order_placed',
  'order_received',
  'content_upload',
  'content_review',
  'compliance_feedback',
  'content_approved',
  'completed',
];
