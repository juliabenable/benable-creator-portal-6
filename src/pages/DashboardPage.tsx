import { useNavigate, Navigate } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Gift,
  Upload,
  PartyPopper,
  Handshake,
  FileText,
  Package,
  Camera,
  Bell,
  TrendingUp,
  ThumbsUp,
  HelpCircle,
  CheckCircle2,
  Megaphone,
  Hourglass,
} from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { useDesignMode } from '@/context/DesignModeContext';
import { getStepIndex, type CampaignStep } from '@/types';
import type { Campaign } from '@/types';

const STEP_ACTION_MAP: Record<CampaignStep, { label: string; color: string; icon: React.ElementType }> = {
  interest_check: { label: 'New opportunity', color: 'bg-[#7A5CFA]', icon: ThumbsUp },
  invitation: { label: 'Action needed', color: 'bg-amber-500', icon: AlertCircle },
  product_phase: { label: 'Action needed', color: 'bg-amber-500', icon: Gift },
  order_placed: { label: 'Waiting for delivery', color: 'bg-blue-500', icon: Clock },
  order_received: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  content_upload: { label: 'Action needed', color: 'bg-amber-500', icon: Upload },
  content_review: { label: 'Under review', color: 'bg-blue-500', icon: Clock },
  compliance_feedback: { label: 'Action needed', color: 'bg-red-500', icon: AlertCircle },
  content_approved: { label: 'Ready to publish', color: 'bg-emerald-500', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-emerald-500', icon: PartyPopper },
};

const WHAT_TO_EXPECT = [
  { icon: Handshake, title: 'Brand Match', description: 'Get matched with brands that align with your content style.' },
  { icon: FileText, title: 'Campaign Brief', description: 'Receive detailed briefs with requirements and deadlines.' },
  { icon: Package, title: 'Free Products or Gift Cards', description: 'Get products shipped to you or gift cards for each campaign.' },
  { icon: Camera, title: 'Create & Submit', description: 'Create authentic content and submit for brand review.' },
  { icon: Gift, title: 'Get Compensated', description: 'Earn gift cards, products, and more for your work.' },
];

/* ─── Brand Logo for 28 Litsea ─── */
function BrandLogo28Litsea({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#2a2a3d] flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="text-center leading-none">
        <span className="block text-white/90 text-[6px] font-light italic tracking-[0.15em]" style={{ fontFamily: 'Georgia, serif' }}>28</span>
        <span className="block text-white/90 text-[5.5px] font-light tracking-[0.2em] uppercase mt-[1px]" style={{ fontFamily: 'Georgia, serif' }}>LITSEA</span>
      </div>
    </div>
  );
}

/* ─── Campaign Card on Dashboard ─── */
function DashboardCampaignCard({ campaign, isNew }: { campaign: Campaign; isNew?: boolean }) {
  const navigate = useNavigate();
  const { isRefined } = useDesignMode();
  const stepInfo = STEP_ACTION_MAP[campaign.currentStep];
  const StepIcon = stepInfo.icon;
  const progress = ((getStepIndex(campaign.currentStep) + 1) / 5) * 100;

  if (isNew) {
    return (
      <div
        className={`rounded-2xl overflow-hidden border border-[#E0D4F5] bg-[#FAF8FF] cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] ${isRefined ? 'shadow-md' : 'shadow-sm'}`}
        onClick={() => navigate(`/campaign/${campaign.id}`)}
      >
        <div className={`${isRefined ? 'campaign-card-header-refined' : 'campaign-card-header'} px-4 py-3`}>
          <div className="flex items-center gap-3">
            <BrandLogo28Litsea size={36} />
            <span className="font-semibold text-[14px] text-[#1A1A1A]">{campaign.brandName}</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <h4 className="font-bold text-[14px] text-[#1A1A1A]">{campaign.title}</h4>
          <p className="text-[12px] text-[#717171] mt-1 line-clamp-2 leading-relaxed">{campaign.description}</p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-[#7A5CFA] px-2 py-0.5 rounded-full">
              <ThumbsUp className="w-3 h-3" />
              Are you interested?
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-[#E8E8E8] bg-white cursor-pointer hover:shadow-md transition-all active:scale-[0.99] ${isRefined ? 'shadow-md' : 'shadow-sm'}`}
      onClick={() => navigate(`/campaign/${campaign.id}`)}
    >
      <div className="h-1 bg-[#F0F0F0]">
        <div className="h-full bg-[#7A5CFA] rounded-r-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <BrandLogo28Litsea size={36} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] text-[#717171] font-medium">{campaign.brandName}</p>
              <span className={`inline-flex items-center gap-1 ${stepInfo.color} text-white text-[10px] px-2 py-0.5 rounded-full shrink-0`}>
                <StepIcon className="w-3 h-3" />
                {stepInfo.label}
              </span>
            </div>
            <h4 className="font-semibold text-[14px] mt-0.5 truncate text-[#1A1A1A]">{campaign.title}</h4>
            <p className="text-[12px] text-[#717171] mt-1">{campaign.compensationType} · Due {campaign.contentDueDate}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#ABABAB] shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* ─── Pending State ─── */
function PendingState() {
  const { isRefined } = useDesignMode();

  const STEPS_FIGMA = [
    { num: '1', text: 'We review your application and social media presence', color: 'bg-[#7A5CFA]' },
    { num: '2', text: "We'll reach out when a campaign matches your profile. Creators are hand-picked for each one.", color: 'bg-[#B8A832]' },
    { num: '3', text: "You'll receive products, create content, and get compensated for campaigns you participate in", color: 'bg-[#2BAF87]' },
  ];

  const STEPS_REFINED = [
    { num: '1', text: 'We review your application and social media presence', color: 'bg-[#7A5CFA]' },
    { num: '2', text: "We'll reach out when a campaign matches your profile. Creators are hand-picked for each one.", color: 'bg-[#C4CC32]' },
    { num: '3', text: "You'll receive products, create content, and get compensated for campaigns you participate in", color: 'bg-[#2BAF87]' },
  ];

  const steps = isRefined ? STEPS_REFINED : STEPS_FIGMA;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in-up">
      <div className={`flex flex-col items-center ${isRefined ? 'pt-12 pb-10' : 'pt-10 pb-8'}`}>
        <div className="w-16 h-16 rounded-full bg-[#F0ECFE] flex items-center justify-center mb-5">
          <Hourglass className="w-7 h-7 text-[#7A5CFA]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] text-center">Application Under Review</h2>
        <p className={`text-[14px] text-[#717171] mt-2 text-center max-w-[280px] ${isRefined ? 'leading-relaxed' : ''}`}>
          We're reviewing your application. You'll be notified once you're accepted.
        </p>
      </div>

      <div className="bg-[#F7F7F8] rounded-2xl px-5 py-5 mb-6">
        <h4 className="font-bold text-[15px] text-[#1A1A1A] mb-4">What Happens Next</h4>
        <div className={isRefined ? 'space-y-5' : 'space-y-4'}>
          {steps.map((item) => (
            <div key={item.num} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shrink-0 text-xs font-bold text-white`}>
                {item.num}
              </div>
              <p className={`text-[13px] text-[#717171] pt-1 ${isRefined ? 'leading-[1.6]' : 'leading-relaxed'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-[12px] text-[#717171] py-2">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Questions? Email <a href="mailto:collabs@benable.com" className="text-[#7A5CFA] underline hover:text-[#6B4DE6]">collabs@benable.com</a></span>
      </div>
    </div>
  );
}

/* ─── Not Accepted State ─── */
function NotAcceptedState() {
  const { isRefined } = useDesignMode();

  const TIPS = [
    { icon: TrendingUp, title: 'Grow your audience', text: 'Keep posting and engaging! brands look for active, growing audiences.' },
    { icon: Camera, title: 'Level up your content', text: 'Quality visuals and niche-relevant content make your profile stand out.' },
    { icon: Sparkles, title: 'Stay on our radar', text: "No need to re-apply. we'll reach out when a spot opens up." },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in-up">
      <div className={`flex flex-col items-center ${isRefined ? 'pt-12 pb-10' : 'pt-10 pb-8'}`}>
        <div className="w-16 h-16 rounded-full bg-[#F0ECFE] flex items-center justify-center mb-5">
          <ThumbsUp className="w-7 h-7 text-[#7A5CFA]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] text-center">Thanks for Applying!</h2>
        <p className={`text-[14px] text-[#717171] mt-2 text-center max-w-[280px] ${isRefined ? 'leading-relaxed' : ''}`}>
          Spots are limited and we're unable to offer one right now but we'll revisit as the program grows.
        </p>
      </div>

      <div className="bg-[#F7F7F8] rounded-2xl px-5 py-5 mb-6">
        <h4 className="font-bold text-[15px] text-[#1A1A1A] mb-4">Tips to Strengthen Your Profile</h4>
        <div className={isRefined ? 'space-y-5' : 'space-y-4'}>
          {TIPS.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {isRefined ? (
                /* Refined: no circle background, just the icon directly */
                <item.icon className="w-5 h-5 text-[#7A5CFA] shrink-0 mt-0.5" />
              ) : (
                /* Figma: icon inside circle */
                <div className="w-8 h-8 rounded-full bg-[#F0ECFE] flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-[#7A5CFA]" />
                </div>
              )}
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A1A]">{item.title}</p>
                <p className={`text-[12px] text-[#717171] mt-0.5 ${isRefined ? 'leading-[1.6]' : 'leading-relaxed'}`}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-[12px] text-[#717171] py-2">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Questions? Email <a href="mailto:collabs@benable.com" className="text-[#7A5CFA] underline hover:text-[#6B4DE6]">collabs@benable.com</a></span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { creatorName, creatorStatus, campaigns } = useCreator();
  const navigate = useNavigate();

  if (creatorStatus === 'not_applied') return <Navigate to="/apply" replace />;
  if (creatorStatus === 'pending') return <PendingState />;
  if (creatorStatus === 'not_accepted') return <NotAcceptedState />;

  const interestCampaigns = campaigns.filter((c) => c.currentStep === 'interest_check' && !c.declined);
  const activeCampaigns = campaigns.filter((c) => c.currentStep !== 'interest_check' && !c.declined);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in-up">
      {/* Accepted Welcome Banner */}
      <div className="rounded-2xl border border-[#E0D4F5] bg-[#FAF8FF] px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F0ECFE] flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-[#7A5CFA] animate-pulse" style={{ animationDuration: '2.5s' }} />
        </div>
        <div>
          <h2 className="font-semibold text-[#1A1A1A] text-[15px]">Welcome{creatorName ? `, ${creatorName}` : ''}!</h2>
          <p className="text-[13px] text-[#717171] mt-0.5">You're part of the Benable Creator Program.</p>
        </div>
      </div>

      {/* New Opportunities */}
      {interestCampaigns.length > 0 && (
        <div>
          <h3 className="font-bold text-[16px] text-[#1A1A1A] mb-3">New Opportunities</h3>
          <div className="space-y-3">
            {interestCampaigns.map((campaign) => (
              <DashboardCampaignCard key={campaign.id} campaign={campaign} isNew />
            ))}
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[16px] text-[#1A1A1A]">Your Campaigns</h3>
          {(activeCampaigns.length > 0 || interestCampaigns.length > 0) && (
            <button onClick={() => navigate('/campaigns')} className="text-[13px] text-[#7A5CFA] font-medium hover:underline">
              View All
            </button>
          )}
        </div>

        {activeCampaigns.length === 0 && interestCampaigns.length === 0 ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#E0D4F5] bg-white px-5 py-8 text-center">
              <Megaphone className="w-14 h-14 text-[#7A5CFA] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1A1A1A]">Stay tuned!</h3>
              <p className="text-[13px] text-[#717171] mt-1 max-w-[260px] mx-auto">
                Your profile is being matched with brands. You'll receive your first campaign invitation soon.
              </p>
            </div>
            <div className="bg-[#F7F7F8] rounded-2xl px-5 py-5">
              <h4 className="font-bold text-[15px] text-[#1A1A1A] mb-4">What to Expect</h4>
              <div className="space-y-4">
                {WHAT_TO_EXPECT.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0ECFE] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-[#7A5CFA]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1A1A1A]">{item.title}</p>
                      <p className="text-[12px] text-[#717171] mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center text-[13px] text-[#717171] py-2">
              <Bell className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
              <p>We'll notify you when a campaign is ready</p>
            </div>
          </div>
        ) : activeCampaigns.length === 0 ? (
          <p className="text-[13px] text-[#717171]">No active campaigns yet. Check the opportunities above!</p>
        ) : (
          <div className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <DashboardCampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 justify-center text-[12px] text-[#717171] py-2">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Questions? Email <a href="mailto:collabs@benable.com" className="underline hover:text-[#1A1A1A]">collabs@benable.com</a></span>
      </div>
    </div>
  );
}
