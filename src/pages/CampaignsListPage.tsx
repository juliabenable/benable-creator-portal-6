import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Handshake, FileText, Package, Camera, Gift, CheckCircle2 } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { useDesignMode } from '@/context/DesignModeContext';
import type { Campaign } from '@/types';

const TABS = ['New', 'Active', 'Finished'] as const;
type Tab = (typeof TABS)[number];

function getTabCampaigns(campaigns: Campaign[], tab: Tab): Campaign[] {
  switch (tab) {
    case 'New':
      return campaigns.filter(
        (c) => c.currentStep === 'interest_check' && !c.declined
      );
    case 'Active':
      return campaigns.filter(
        (c) =>
          c.currentStep !== 'interest_check' &&
          c.currentStep !== 'completed' &&
          !c.declined
      );
    case 'Finished':
      return campaigns.filter(
        (c) => c.currentStep === 'completed' || c.declined
      );
  }
}

const WHAT_TO_EXPECT = [
  { icon: Handshake, title: 'Brand Match', description: 'Get matched with brands that align with your content style.' },
  { icon: FileText, title: 'Campaign Brief', description: 'Receive detailed briefs with requirements and deadlines.' },
  { icon: Package, title: 'Free Products or Gift Cards', description: 'Get products shipped to you or gift cards for each campaign' },
  { icon: Camera, title: 'Create & Submit', description: 'Create authentic content and submit for brand review' },
  { icon: Gift, title: 'Get Compensated', description: 'Earn gift cards, products, and more for your work' },
];

/* ─── Brand Logo for 28 Litsea ─── */
function BrandLogo28Litsea({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]"
      style={{ width: size, height: size }}
    >
      <img src={`${import.meta.env.BASE_URL}brands/28-litsea.png`} alt="28 Litsea" className="w-[90%] h-[47%] object-contain" />
    </div>
  );
}

/* ─── Brand logos for celebration grid ─── */
const BRAND_LOGOS = [
  { name: 'Free People', img: 'free-people.svg' },
  { name: 'Nike', img: 'nike.svg' },
  { name: 'REVOLVE', img: 'revolve.png' },
  { name: 'Supergoop', img: 'supergoop.png' },
  { name: 'Sephora', img: 'sephora.png' },
  { name: 'Target', img: 'target.svg' },
  { name: 'SKIMS', img: 'skims.svg' },
  { name: 'ASOS', img: 'asos.png' },
];

/* ─── Confetti pieces ─── */
function ConfettiBackground({ refined }: { refined?: boolean }) {
  const pieces = useMemo(() => {
    const colors = ['#7A5CFA', '#AE94F9', '#E0D4F5', '#FF85A2', '#FFB347', '#47B3FF', '#2BAF87', '#C8B6F0'];
    const count = refined ? 80 : 50;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      size: refined ? (8 + Math.random() * 12) : (6 + Math.random() * 8),
      delay: `${Math.random() * 3}s`,
      duration: `${2.5 + Math.random() * 3}s`,
      shape: i % 3,
    }));
  }, [refined]);

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.shape === 2 ? p.size * 0.5 : p.size,
            height: p.shape === 2 ? p.size * 1.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? '50%' : '2px',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Celebration Screen (YOU'RE IN!) ─── */
function CelebrationScreen({ onDismiss }: { onDismiss: () => void }) {
  const { creatorName } = useCreator();
  const { isRefined } = useDesignMode();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isRefined) {
    return (
      <div className="relative min-h-[75vh] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(200,182,240,0.3) 0%, rgba(245,243,252,0.6) 50%, #fff 100%)' }}>
        <ConfettiBackground refined />

        <div className="relative z-10 flex flex-col items-center pt-6 pb-8 px-4">
          {/* Card container wrapping logos + avatar + text */}
          <div
            className={`w-full max-w-[320px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 px-5 pt-5 pb-8 flex flex-col items-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            {/* Brand Logo Grid */}
            <div className="grid grid-cols-4 gap-2.5 mb-5 w-full">
              {BRAND_LOGOS.map((brand) => (
                <div
                  key={brand.name}
                  className="aspect-square bg-white rounded-2xl shadow-sm border border-[#F0F0F0] flex items-center justify-center p-2"
                >
                  <img src={`${import.meta.env.BASE_URL}brands/${brand.img}`} alt={brand.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>

            {/* Avatar */}
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#C8B6F0] to-[#E0D4F5] flex items-center justify-center mb-2 shadow-lg ring-4 ring-white">
              <span className="text-[24px] font-bold text-[#7A5CFA]">
                {creatorName ? creatorName.charAt(0).toUpperCase() : 'K'}
              </span>
            </div>

            {/* Name + Verified */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="text-[15px] font-semibold text-[#1A1A1A]">
                {creatorName || 'Kenzie Foster'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#7A5CFA] fill-[#7A5CFA] stroke-white" />
            </div>

            {/* YOU'RE IN! */}
            <h2 className="animate-youre-in text-[36px] font-extrabold text-[#7A5CFA] tracking-tight leading-none mb-3">
              YOU'RE IN!
            </h2>

            {/* Subtitle */}
            <p className="text-[14px] text-[#555] text-center max-w-[250px] mb-6 leading-relaxed">
              You're part of the Benable Creator Program. You'll receive your first campaign invitation soon.
            </p>

            {/* Let's go! CTA */}
            <button
              onClick={onDismiss}
              className="w-full max-w-[260px] py-3.5 rounded-full bg-[#7A5CFA] text-white font-semibold text-[15px] hover:bg-[#6B4DE6] active:scale-[0.98] transition-all shadow-lg shadow-[#7A5CFA]/25"
            >
              Let's go!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Figma version (original) ───
  return (
    <div className="relative min-h-[70vh] celebration-bg overflow-hidden">
      <ConfettiBackground />
      <div className="relative z-10 flex flex-col items-center pt-6 pb-8 px-4">
        <div className={`grid grid-cols-4 gap-2 mb-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {BRAND_LOGOS.map((brand, i) => (
            <div key={brand.name} className="brand-logo-grid-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <img src={`${import.meta.env.BASE_URL}brands/${brand.img}`} alt={brand.name} className="max-w-[70%] max-h-[60%] object-contain" />
            </div>
          ))}
        </div>
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#C8B6F0] to-[#E0D4F5] flex items-center justify-center mb-2 shadow-lg transition-all duration-700 delay-200 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <span className="text-2xl font-bold text-[#7A5CFA]">
            {creatorName ? creatorName.charAt(0).toUpperCase() : 'K'}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 mb-4 transition-all duration-500 delay-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[15px] font-semibold text-[#1A1A1A]">{creatorName || 'Kenzie Foster'}</span>
          <CheckCircle2 className="w-4 h-4 text-[#7A5CFA] fill-[#7A5CFA] stroke-white" />
        </div>
        <h2 className="animate-youre-in text-[32px] font-extrabold text-[#7A5CFA] tracking-tight leading-none mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>YOU'RE IN!</h2>
        <p className={`text-[14px] text-[#717171] text-center max-w-[260px] mb-8 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          You're part of the Benable Creator Program. You'll receive your first campaign invitation soon.
        </p>
        <button
          onClick={onDismiss}
          className={`w-full max-w-[300px] py-3.5 rounded-full bg-[#7A5CFA] text-white font-semibold text-[15px] hover:bg-[#6B4DE6] active:scale-[0.98] transition-all duration-700 delay-600 shadow-lg shadow-[#7A5CFA]/25 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Let's go!
        </button>
      </div>
    </div>
  );
}

/* ─── Campaign Card ─── */
function CampaignCard({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate();
  const { isRefined } = useDesignMode();

  if (isRefined) {
    return (
      <div
        className="rounded-2xl overflow-hidden border border-[#E8E8E8] bg-white cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] shadow-md"
        onClick={() => navigate(`/campaign/${campaign.id}`)}
      >
        <div className="campaign-card-header-refined px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo28Litsea size={40} />
            <span className="font-semibold text-[15px] text-[#1A1A1A]">{campaign.brandName}</span>
          </div>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <h4 className="font-bold text-[15px] text-[#1A1A1A]">{campaign.title}</h4>
            <p className="text-[13px] text-[#717171] mt-1 line-clamp-3 leading-relaxed">{campaign.description}</p>
          </div>
          <button
            className="w-full py-2.5 rounded-full border border-[#7A5CFA] text-[#7A5CFA] text-sm font-semibold hover:bg-[#F5F3FC] transition-colors"
            onClick={(e) => { e.stopPropagation(); navigate(`/campaign/${campaign.id}`); }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  }

  // ─── Figma version ───
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#E8E8E8] cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] shadow-sm"
      style={{ background: 'linear-gradient(135deg, rgba(200,182,240,0.5) 0%, rgba(216,200,246,0.45) 30%, rgba(232,220,250,0.4) 60%, rgba(245,210,220,0.35) 100%)' }}
      onClick={() => navigate(`/campaign/${campaign.id}`)}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <BrandLogo28Litsea size={48} />
          <span className="font-semibold text-[15px] text-[#1A1A1A]">{campaign.brandName}</span>
        </div>
      </div>
      <div className="p-[8px]">
        <div className="rounded-[12px] shadow-[0px_16px_40px_0px_rgba(0,0,0,0.08)] p-[12px] bg-white space-y-3">
          <div>
            <h4 className="font-medium text-[14px] text-[#222]">{campaign.title}</h4>
            <p className="text-[13px] text-[#717171] mt-1 line-clamp-3 leading-relaxed">{campaign.description}</p>
          </div>
          <button
            className="w-full py-2.5 rounded-full border border-[#7A5CFA] text-[#7A5CFA] text-sm font-semibold hover:bg-[#F5F3FC] transition-colors"
            onClick={(e) => { e.stopPropagation(); navigate(`/campaign/${campaign.id}`); }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center pt-12 pb-6 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-[#F0ECFE] flex items-center justify-center mb-5">
        <Megaphone className="w-7 h-7 text-[#7A5CFA]" />
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A]">Stay tuned!</h3>
      <p className="text-[13px] text-[#717171] mt-1 text-center max-w-[240px]">
        We'll notify you when a campaign is ready
      </p>
      <div className="w-full mt-8 bg-[#F7F7F8] rounded-2xl px-5 py-5">
        <h4 className="font-bold text-[14px] text-[#525252] tracking-[-0.18px] mb-4">What to Expect</h4>
        <div className="space-y-4">
          {WHAT_TO_EXPECT.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <item.icon className="w-4 h-4 text-[#7A5CFA] shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-[#1c1c1c]">{item.title}</p>
                <p className="text-[12px] text-[#696969] mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CampaignsListPage() {
  const { campaigns, hasSeenCelebration, dismissCelebration, creatorStatus } = useCreator();
  const [activeTab, setActiveTab] = useState<Tab>('New');
  const filtered = getTabCampaigns(campaigns, activeTab);
  const showCelebration = creatorStatus === 'accepted' && !hasSeenCelebration;

  return (
    <div className="max-w-lg mx-auto px-4 py-2">
      <div className="tab-nav">
        {TABS.map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      {showCelebration ? (
        <CelebrationScreen onDismiss={dismissCelebration} />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4 pt-4 animate-fade-in-up">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
