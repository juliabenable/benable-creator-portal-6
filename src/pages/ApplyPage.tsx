import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Info, Image, X, Plus, Check } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { useDesignMode } from '@/context/DesignModeContext';
import { toast } from 'sonner';
import { useViewport } from './Layout';

const TOTAL_STEPS = 4;
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Brazil', 'Mexico', 'India', 'Japan'];

const CONTENT_NICHES = ['Beauty', 'Fashion', 'Lifestyle', 'Fitness', 'Food', 'Travel', 'Parenting', 'DIY / Crafts', 'Wellness', 'Home Decor'];
const PRODUCT_CATEGORIES = ['Skincare', 'Haircare', 'Clothing', 'Home', 'Makeup', 'Supplements', 'Accessories', 'Food & Drink'];

const BRAND_LOGOS: { name: string; img?: string }[] = [
  { name: 'Supergoop', img: 'supergoop.png' },
  { name: 'Etsy', img: 'etsy.svg' },
  { name: 'Nike', img: 'nike.svg' },
  { name: 'REVOLVE', img: 'revolve.png' },
  { name: 'Coach', img: 'coach.png' },
  { name: 'Sephora', img: 'sephora.png' },
  { name: 'Target', img: 'target.svg' },
  { name: 'SKIMS', img: 'skims.svg' },
  { name: 'Lululemon', img: 'lululemon.svg' },
  { name: 'ASOS', img: 'asos.png' },
  { name: 'The Ordinary', img: 'the-ordinary.png' },
  { name: 'Free People', img: 'free-people.svg' },
];

export default function ApplyPage() {
  const { creatorStatus, submitApplication } = useCreator();
  const navigate = useNavigate();
  const viewport = useViewport();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('Heather Lacefield');
  const [email, setEmail] = useState('Matias.Silva@email.com');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  if (creatorStatus !== 'not_applied') {
    return <Navigate to="/" replace />;
  }

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function handleNext() {
    if (step === 1 && (!name.trim() || !email.trim())) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleSubmit() {
    submitApplication(name);
    toast.success('Application submitted!');
    navigate('/');
  }

  const progressWidth = step === 0 ? 0 : (step / (TOTAL_STEPS - 1)) * 100;
  const isDesktop = viewport === 'desktop';

  return (
    <div className={`min-h-screen bg-white ${isDesktop ? '' : ''}`}>
      {/* Progress bar header — shown on steps 1-3 */}
      {step > 0 && (
        <div className="sticky top-[60px] lg:top-[72px] z-30 bg-white">
          <div className="h-1 bg-[#ECECEC] rounded-full">
            <div
              className="h-full bg-[#7A5CFA] rounded-r-lg transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div key={step} className="animate-fade-in-up" style={{ animationDuration: '400ms' }}>
        {step === 0 && <WelcomeStep onGetStarted={handleNext} isDesktop={isDesktop} />}
        {step === 1 && (
          <PersonalInfoStep
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            selectedNiches={selectedNiches}
            toggleNiche={(n) => toggleItem(selectedNiches, n, setSelectedNiches)}
            selectedCategories={selectedCategories}
            toggleCategory={(c) => toggleItem(selectedCategories, c, setSelectedCategories)}
            isDesktop={isDesktop}
          />
        )}
        {step === 2 && <ShippingStep isDesktop={isDesktop} />}
        {step === 3 && <SocialStatsStep isDesktop={isDesktop} />}
      </div>

      {/* Bottom CTA — steps 1-3 */}
      {step > 0 && (
        <>
          <div className="h-24" />
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-6 px-4">
            <div className={`mx-auto ${isDesktop ? 'max-w-[343px]' : 'max-w-[343px]'}`}>
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  className="w-full h-[41px] rounded-[12px] text-[15px] font-semibold bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="w-full h-[41px] rounded-[12px] text-[15px] font-semibold bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white"
                  onClick={handleSubmit}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Step 0: Welcome with brand logos background ─── */
function WelcomeStep({ onGetStarted, isDesktop }: { onGetStarted: () => void; isDesktop: boolean }) {
  const { isRefined } = useDesignMode();

  return (
    <div className="relative min-h-[calc(100vh-60px)] overflow-hidden">
      {/* Progress bar — figma mode only */}
      {!isRefined && (
        <div className="sticky top-[60px] lg:top-[72px] z-30">
          <div className="h-1 bg-[#ececec]">
            <div className="h-full bg-[#7a5cfa] rounded-r-lg" style={{ width: '9%' }} />
          </div>
        </div>
      )}

      {/* Rainbow gradient background with brand logos */}
      <div className={isRefined ? 'gradient-rainbow-refined absolute inset-0' : 'gradient-rainbow absolute inset-0'} />

      {/* Floating brand logo grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap gap-3 p-4 opacity-90" style={{ transform: 'rotate(-5deg) scale(1.3)', transformOrigin: 'center' }}>
          {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="brand-logo-card flex-shrink-0 animate-fade-in-up"
              style={{
                width: `${60 + Math.random() * 25}px`,
                height: `${55 + Math.random() * 35}px`,
                animationDelay: `${i * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {brand.img ? (
                <img src={`${import.meta.env.BASE_URL}brands/${brand.img}`} alt={brand.name} className="max-w-[75%] max-h-[65%] object-contain" />
              ) : (
                <span className="text-[9px] font-bold text-[#545454] text-center leading-tight px-1">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphism invitation card */}
      <div className={`relative z-10 flex flex-col items-center justify-end min-h-[calc(100vh-60px)] pb-6 px-6 ${isDesktop ? 'pt-20' : 'pt-40'}`}>
        <div className={`p-6 w-full max-w-[327px] text-center ${isRefined ? 'rounded-3xl glass-card-refined' : 'rounded-[24px] glass-card'}`} style={{ animationDelay: '300ms' }}>
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-16 mb-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF] flex items-center justify-center shadow-lg ring-4 ring-white">
              <span className="text-white text-2xl font-bold">K</span>
            </div>
            <div className="mt-1 px-3 py-1 bg-white border border-[#4DAFFF] rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="text-sm font-medium text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>Kenzie Foster</span>
              <div className="w-4 h-4 rounded-full bg-[#4DAFFF] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mt-4 mb-4">
            <h2 className="text-[28px] font-extrabold tracking-[-0.5px] text-[#1C1C1C] leading-tight" style={{ fontFamily: isRefined ? "'Helvetica Neue', sans-serif" : "'Barlow Condensed', sans-serif" }}>
              YOU'VE BEEN INVITED
            </h2>
            <p className={`mt-2 leading-normal ${isRefined ? 'text-[15px] text-[#4A4A4A]' : 'text-[16px] text-[#1c1c1c]'}`}>
              Join a select group of creators with priority access to brand campaigns as part of Benable's first program
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-left mb-6">
            {[
              { emoji: '💎', text: 'Priority access to paid brand campaigns.' },
              { emoji: '💜', text: 'Work with top beauty, lifestyle & wellness brands.' },
              { emoji: '🎁', text: 'Free products or gift cards + compensation for every campaign.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start ${isRefined ? 'gap-2.5' : 'gap-2'}`}>
                <span className={`shrink-0 mt-0.5 ${isRefined ? 'text-lg' : 'text-[20px] leading-[20px]'}`}>{item.emoji}</span>
                <p className={`text-[14px] font-medium leading-snug ${isRefined ? 'text-[#333]' : 'text-[#545454]'}`}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            className={`w-full font-medium bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white mb-4 transition-transform active:scale-[0.98] ${isRefined ? 'h-12 rounded-[12px] text-[16px]' : 'h-[48px] rounded-[12px] text-[18px]'}`}
            onClick={onGetStarted}
          >
            Get Started!
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── MUI-style floating label input ─── */
function FloatingInput({ label, value, onChange, type = 'text', icon, className = '' }: {
  label: string; value?: string; onChange?: (v: string) => void;
  type?: string; icon?: React.ReactNode; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;
  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className={`w-full px-4 pt-[22px] pb-[8px] border rounded-[12px] text-[16px] outline-none transition-all duration-200 ${
          focused ? 'border-[#7A5CFA] border-2 bg-white' : 'border-[#C6C6C6] bg-white'
        }`}
        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFloating
            ? 'top-[8px] text-[12px] text-[#717171]'
            : 'top-1/2 -translate-y-1/2 text-[16px] text-[#717171]'
        }`}
        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      >
        {label}
      </label>
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
    </div>
  );
}

/* ─── Step 1: Personal Info + Niches + Product Categories ─── */
function PersonalInfoStep({ name, setName, email, setEmail, selectedNiches, toggleNiche, selectedCategories, toggleCategory, isDesktop }: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  selectedNiches: string[]; toggleNiche: (n: string) => void;
  selectedCategories: string[]; toggleCategory: (c: string) => void;
  isDesktop: boolean;
}) {
  return (
    <div className={`mx-auto px-4 py-6 space-y-6 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      {/* Personal details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Personal details
          </h3>
          <button className="text-[14px] font-medium text-[#7A5CFA]">Edit</button>
        </div>
        <div className="space-y-3">
          <div>
            <FloatingInput
              label="Profile Name"
              value={name}
              onChange={setName}
              icon={name ? <Check className="w-5 h-5 text-[#2BAF87]" /> : undefined}
            />
            <p className="text-[12px] text-[#717171] mt-1 ml-1">Full legal name</p>
          </div>
          <FloatingInput
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            icon={email ? <Check className="w-5 h-5 text-[#2BAF87]" /> : undefined}
          />
        </div>
      </div>

      {/* Content niches */}
      <div className="space-y-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Your content niches
          </h3>
          <p className="text-[14px] text-[#717171] mt-1">Select all that apply</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTENT_NICHES.map((niche) => (
            <button
              key={niche}
              className={`tag-chip ${selectedNiches.includes(niche) ? 'selected' : ''}`}
              onClick={() => toggleNiche(niche)}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred product categories */}
      <div className="space-y-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Preferred product categories
          </h3>
          <p className="text-[14px] text-[#717171] mt-1">What products do you love working with?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag-chip ${selectedCategories.includes(cat) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Shipping Address ─── */
function ShippingStep({ isDesktop }: { isDesktop: boolean }) {
  return (
    <div className={`mx-auto px-4 py-6 space-y-5 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
        Shipping Address
      </h3>

      <div className="space-y-4">
        <FloatingInput label="Street Address" />
        <FloatingInput label="State / Province" />
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput label="Town/City" />
          <FloatingInput label="Postal Code" />
        </div>
        <div className="relative">
          <Select>
            <SelectTrigger className="w-full h-[56px] rounded-[12px] border-[#C6C6C6] px-4 text-[16px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info alert */}
      <div className="alert-info-card mt-8">
        <div className="w-5 h-5 rounded-full bg-[#47B3FF] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3 h-3 text-white" />
        </div>
        <p className="text-[13px] text-[#545454] leading-snug">
          Used so brands can ship you products for campaigns. Only shared with brands you've accepted.
        </p>
      </div>
    </div>
  );
}

/* ─── Screenshot upload section ─── */
function ScreenshotUploadArea({ screenshots, onAdd, onRemove }: {
  screenshots: string[]; onAdd: () => void; onRemove: (i: number) => void;
}) {
  if (screenshots.length > 0) {
    return (
      <div className="space-y-3">
        {screenshots.map((fileName, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F3FC] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF] flex items-center justify-center shrink-0">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-[11px] text-[#717171]">Screenshot {i + 1}</p>
            </div>
            <button onClick={() => onRemove(i)} className="p-1 text-[#717171] hover:text-[#FF5567] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#7A5CFA]/30 rounded-xl text-sm font-medium text-[#7A5CFA] hover:bg-[#F5F3FC] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add another screenshot
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="screenshot-upload-box" onClick={onAdd}>
          <Image className="w-6 h-6 text-[#C6C6C6] mb-2" />
          <p className="text-[12px] text-[#717171]">Upload screenshot</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Help dialogs ─── */
function HelpDialog({ platform }: { platform: 'tiktok' | 'instagram' }) {
  const steps = platform === 'tiktok'
    ? [
        'Open TikTok \u2192 tap the \u2630 menu \u2192 TikTok Studio \u2192 Analytics',
        'Set date range to "Last 28 days"',
        'Screenshot overview showing Followers and Average Views',
        'Screenshot audience demographics (countries, gender, ages)',
      ]
    : [
        'Open Instagram \u2192 Profile \u2192 Professional dashboard',
        'Set date range to "Last 30 days"',
        'Screenshot overview showing Accounts Reached, Engaged, and Followers',
        'Screenshot audience demographics',
      ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[#7A5CFA]">
          <Info className="w-3 h-3" /> What to include
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">How to screenshot your {platform === 'tiktok' ? 'TikTok' : 'Instagram'} stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {steps.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F5F3FC] flex items-center justify-center shrink-0 text-xs font-bold text-[#7A5CFA]">{i + 1}</div>
              <p className="text-sm text-[#717171] pt-0.5">{text}</p>
            </div>
          ))}
        </div>
        <DialogClose asChild>
          <Button className="w-full mt-1">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Step 3: Social Stats ─── */
function SocialStatsStep({ isDesktop }: { isDesktop: boolean }) {
  const [tiktokScreenshots, setTiktokScreenshots] = useState<string[]>([]);
  const [igScreenshots, setIgScreenshots] = useState<string[]>([]);

  function simulateAdd(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    const fakeNames = ['analytics_overview.png', 'stats_page.png', 'followers_detail.png', 'engagement.png'];
    setter((prev) => [...prev, fakeNames[prev.length % fakeNames.length]]);
  }

  return (
    <div className={`mx-auto px-4 py-6 space-y-8 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      {/* Instagram Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>Instagram</h3>

        {/* Handle input with Instagram icon */}
        <div className="flex items-center gap-3 px-4 py-3 border border-[#C6C6C6] rounded-[12px]">
          <div className="w-8 h-8 rounded-lg instagram-gradient flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">IG</span>
          </div>
          <input
            placeholder="@username"
            className="flex-1 border-none outline-none text-[16px] bg-transparent"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          />
        </div>

        {/* Stats Screenshots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#1C1C1C]">Stats Screenshots</p>
            <HelpDialog platform="instagram" />
          </div>
          <p className="text-[13px] text-[#717171] leading-snug">
            Upload screenshots of your Instagram insights showing your <strong>followers</strong>, <strong>views</strong> over 30 days, and <strong>reach</strong> over 30 days.
          </p>
          <ScreenshotUploadArea
            screenshots={igScreenshots}
            onAdd={() => simulateAdd(setIgScreenshots)}
            onRemove={(i) => setIgScreenshots((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>

      {/* TikTok Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>Tiktok</h3>

        {/* Handle input with TikTok icon */}
        <div className="flex items-center gap-3 px-4 py-3 border border-[#C6C6C6] rounded-[12px]">
          <div className="w-8 h-8 rounded-lg tiktok-bg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">TK</span>
          </div>
          <input
            placeholder="@username"
            className="flex-1 border-none outline-none text-[16px] bg-transparent"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          />
        </div>

        {/* Stats Screenshots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#1C1C1C]">Stats Screenshots</p>
            <HelpDialog platform="tiktok" />
          </div>
          <p className="text-[13px] text-[#717171] leading-snug">
            Upload screenshots of your TikTok analytics showing your <strong>followers</strong> and <strong>average views</strong>.
          </p>
          <ScreenshotUploadArea
            screenshots={tiktokScreenshots}
            onAdd={() => simulateAdd(setTiktokScreenshots)}
            onRemove={(i) => setTiktokScreenshots((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>
    </div>
  );
}
