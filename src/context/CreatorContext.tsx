import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CreatorStatus, Campaign, CampaignStep, Notification } from '@/types';
import { ALL_STEPS_ORDERED } from '@/types';

interface CreatorContextType {
  creatorName: string;
  creatorStatus: CreatorStatus;
  campaigns: Campaign[];
  notifications: Notification[];
  unreadCount: number;
  hasSeenCelebration: boolean;
  setCreatorStatus: (status: CreatorStatus) => void;
  submitApplication: (name: string) => void;
  setCampaignStep: (campaignId: string, step: CampaignStep) => void;
  advanceCampaignStep: (campaignId: string) => void;
  updateCampaignField: (campaignId: string, updates: Partial<Campaign>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  dismissCelebration: () => void;
  resetAll: () => void;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-1',
    brandName: '28 Litsea',
    brandColor: '#9B6B4A',
    title: 'Summer Glow Collection Launch',
    description:
      'Create engaging content showcasing our new Summer Glow Collection. We want authentic, creative content that highlights the product benefits and your personal skincare routine.',
    compensationType: 'Free product',
    currentStep: 'interest_check',
    requirements: [
      'Create 1 TikTok video (30-60 seconds) showcasing the product',
      'Create 1 Instagram Reel featuring the product in your skincare routine',
      'Include brand mention @28Litsea in caption',
      'Show product packaging in at least 2 shots',
      'Use natural lighting for all content',
    ],
    contentDeliverables: [
      'Create 1 TikTok video (30–60 seconds) showcasing the product.',
      'Create 1 Instagram Reel featuring the product in your skincare routine.',
    ],
    otherInstructions: [
      'Use campaign hashtag #28Litsea #SummerGlow',
      'Tag @28litsea in all posts',
      'Show product in use (not just unboxing)',
      'Post as soon as possible',
    ],
    hashtags: ['#28Litsea', '#SummerGlow', '#SkincareRoutine', '#Ad', '#Gifted'],
    contentDueDate: '2026-03-20',
    publishWindowStart: '2026-03-25',
    publishWindowEnd: '2026-03-31',
    paymentDetails: 'Free product',
    productType: 'product_choice',
    productCode: 'LYCIA-SUMMER-2026-XK9F',
    productOptions: [
      {
        id: 'prod-1',
        name: 'Summer Glow Serum',
        description: 'Lightweight, vitamin C-infused face serum for a radiant glow',
        imageUrl: '',
        size: '30ml',
        stock: 145,
        price: 42.00,
      },
      {
        id: 'prod-2',
        name: 'Hydra Mist Toner',
        description: 'Refreshing toner with aloe vera and hyaluronic acid',
        imageUrl: '',
        size: '100ml',
        stock: 89,
        price: 36.00,
      },
    ],
    postingSchedule: 'window',
    contentSubmissions: [],
    complianceChecklist: [
      { id: 'c1', category: 'Product Visibility', status: 'needs_improvement', note: 'Product packaging not clearly visible in first 3 seconds of TikTok video' },
      { id: 'c2', category: 'Hashtags', status: 'missing', note: '#Ad hashtag missing from Instagram caption' },
      { id: 'c3', category: 'Lighting', status: 'needs_improvement', note: 'Instagram Reel lighting could be improved — try natural lighting near a window' },
      { id: 'c4', category: 'Brand Mention', status: 'approved', note: 'Great job including @28Litsea!' },
      { id: 'c5', category: 'Video Length', status: 'approved' },
      { id: 'c6', category: 'Content Quality', status: 'approved', note: 'Excellent production quality' },
    ],
    complianceNotes: 'Overall great content! Just a couple of things to fix — the product needs to be more visible early on and please add the #Ad hashtag. Looking forward to the updated version!',
    publishedLinks: [],
    brandThankYou:
      "Thank you so much for being part of our Summer Glow launch! Your content was amazing and we'd love to work with you again. Keep glowing!",
    briefSummary: [
      'Create 1 TikTok + 1 Instagram Reel featuring skincare products',
      'Free products + $50 gift card compensation',
      'Content due by March 20, publish window March 25–31',
    ],
    requiredPlatforms: ['TikTok', 'IG Reel'],
    brandAbout: 'Ulta Beauty is a leading beauty retailer offering a wide range of cosmetics, skincare, and haircare products. Known for its inclusive approach, Ulta provides a unique shopping experience with both high-end and drugstore brands. The brand also emphasizes community engagement and customer satisfaction.',
    termsText: 'You agree to deliver the content described above. All content must be submitted for review before publishing. You agree to keep the product and campaign details confidential until publication. UGC rights granted for 90 days across brand channels.',
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'campaign_invite',
    title: 'New Campaign Opportunity',
    message: '28 Litsea is interested in working with you for their Summer Glow Collection Launch. Are you interested?',
    timestamp: new Date().toISOString(),
    read: false,
    campaignId: 'campaign-1',
    actionUrl: '/campaign/campaign-1',
  },
  {
    id: 'notif-2',
    type: 'acceptance',
    title: 'Welcome to Benable!',
    message: 'Your creator application has been accepted. Start exploring campaigns!',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

const STEP_NOTIFICATION_MAP: Partial<Record<CampaignStep, { type: Notification['type']; title: string; message: string }>> = {
  compliance_feedback: { type: 'compliance_feedback', title: 'Changes Needed', message: 'Your content needs some adjustments. Please review the feedback.' },
  content_approved: { type: 'content_approved', title: 'Content Approved!', message: 'Your content has been approved. Time to publish!' },
  completed: { type: 'general', title: 'Campaign Complete', message: 'Congratulations! Your campaign has been marked as complete.' },
};

function formatStepDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CreatorContext = createContext<CreatorContextType | null>(null);

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [creatorName, setCreatorName] = useState('');
  const [creatorStatus, setCreatorStatus] = useState<CreatorStatus>('accepted');
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false);

  function dismissCelebration() {
    setHasSeenCelebration(true);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      { ...notif, id: `notif-${Date.now()}`, timestamp: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  function submitApplication(name: string) {
    setCreatorName(name);
    setCreatorStatus('pending');
  }

  function setCampaignStep(campaignId: string, step: CampaignStep) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        return {
          ...c,
          currentStep: step,
          stepTimestamps: { ...c.stepTimestamps, [step]: formatStepDate() },
        };
      })
    );
    // Auto-generate notification
    const notifTemplate = STEP_NOTIFICATION_MAP[step];
    if (notifTemplate) {
      addNotification({ ...notifTemplate, campaignId, actionUrl: `/campaign/${campaignId}` });
    }
  }

  function advanceCampaignStep(campaignId: string) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        const currentIndex = ALL_STEPS_ORDERED.indexOf(c.currentStep);
        const nextStep = ALL_STEPS_ORDERED[currentIndex + 1];
        if (!nextStep) return c;
        return {
          ...c,
          currentStep: nextStep,
          stepTimestamps: { ...c.stepTimestamps, [nextStep]: formatStepDate() },
        };
      })
    );
  }

  function updateCampaignField(campaignId: string, updates: Partial<Campaign>) {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...updates } : c))
    );
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function resetAll() {
    setCreatorName('');
    setCreatorStatus('not_applied');
    setCampaigns(INITIAL_CAMPAIGNS);
    setNotifications(INITIAL_NOTIFICATIONS);
  }

  // Expose helpers on window for Figma capture (temporary - remove after)
  useEffect(() => {
    (window as any).__setCampaignStep = (id: string, step: CampaignStep) => {
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, currentStep: step } : c));
    };
    (window as any).__setCreatorStatus = setCreatorStatus;
    (window as any).__setCampaigns = setCampaigns;
  }, []);

  return (
    <CreatorContext.Provider
      value={{
        creatorName,
        creatorStatus,
        campaigns,
        notifications,
        unreadCount,
        hasSeenCelebration,
        setCreatorStatus,
        submitApplication,
        setCampaignStep,
        advanceCampaignStep,
        updateCampaignField,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        dismissCelebration,
        resetAll,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
