import { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, ChevronLeft, Compass, Sparkles, Palette, Figma } from 'lucide-react';
import { DemoControls } from '@/components/DemoControls';
import { ViewportToggle } from '@/components/ViewportToggle';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreator } from '@/context/CreatorContext';
import { useDesignMode } from '@/context/DesignModeContext';

type ViewportMode = 'mobile' | 'desktop';
const ViewportContext = createContext<ViewportMode>('mobile');
export function useViewport() { return useContext(ViewportContext); }

function DesktopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useCreator();
  const isDiscover = location.pathname === '/' || location.pathname === '';
  const isInvites = location.pathname.includes('/apply');

  return (
    <header className="hidden lg:flex items-center justify-between px-10 h-[72px] bg-white border-b border-[#E3E3E3] sticky top-0 z-40">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-10">
        <button onClick={() => navigate('/')} className="flex items-center">
          <span className="brand-name text-xl font-bold tracking-tight text-[#1C1C1C]">Benable</span>
        </button>
        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDiscover ? 'text-[#7A5CFA]' : 'text-[#717171] hover:text-[#1C1C1C]'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover
          </button>
          <button
            onClick={() => navigate('/apply')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isInvites ? 'text-[#7A5CFA]' : 'text-[#717171] hover:text-[#1C1C1C]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Invites
          </button>
        </nav>
      </div>

      {/* Center: Search */}
      <div className="flex items-center gap-3 px-4 py-2.5 border border-[#E3E3E3] rounded-full min-w-[280px] bg-white hover:border-[#C6C6C6] transition-colors">
        <Search className="w-4 h-4 text-[#717171]" />
        <span className="text-sm text-[#717171]">Search</span>
        <span className="ml-auto text-[10px] font-bold text-[#7A5CFA] bg-[#F5F3FC] px-2 py-0.5 rounded-full">BETA</span>
      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate('/campaigns')}
          className="relative p-2 rounded-full hover:bg-[#F5F3FC] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#717171]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#FF5567] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF] flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
        >
          <span className="text-white text-sm font-semibold">K</span>
        </button>
      </div>
    </header>
  );
}

function MobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useCreator();

  const isHome = location.pathname === '/' || location.pathname === '';
  const isApply = location.pathname.includes('/apply');
  const isCampaignList = location.pathname === '/campaigns';
  const isCampaignDetail = location.pathname.startsWith('/campaign/');
  const isCampaign = isCampaignList || isCampaignDetail;
  const isProfile = location.pathname === '/profile';
  const showBack = isApply || isCampaign || isProfile;

  // Determine center title
  const getCenterContent = () => {
    if (isCampaign) {
      return <span className="text-base font-semibold text-[#1C1C1C]">Campaigns</span>;
    }
    if (isProfile) {
      return <span className="text-base font-semibold text-[#1C1C1C]">Profile</span>;
    }
    // Home and Apply pages show Benable logo
    return (
      <button onClick={() => navigate('/')}>
        <span className="brand-name text-base font-bold tracking-tight text-[#1C1C1C]">Benable</span>
      </button>
    );
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E3E3E3]">
      <div className="flex items-center justify-between px-4 h-[60px]">
        {/* Left */}
        {showBack ? (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-medium text-[#1C1C1C]">
            <ChevronLeft className="w-5 h-5" />
            {isApply && <span>Back</span>}
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Center */}
        {getCenterContent()}

        {/* Right */}
        {isApply ? (
          <button onClick={() => navigate('/')} className="text-sm font-medium text-[#717171]">
            Skip
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {isHome && (
              <button className="p-2 rounded-lg hover:bg-[#F5F3FC] transition-colors">
                <Search className="w-5 h-5 text-[#717171]" />
              </button>
            )}
            {isProfile ? (
              <div className="w-10" />
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-[#F5F3FC] transition-colors">
                    <Menu className="w-5 h-5 text-[#1C1C1C]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5567] rounded-full" />
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-1 py-3">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[#F5F3FC] transition-colors text-left" onClick={() => navigate('/campaigns')}>
                      <Compass className="w-4 h-4" /> Campaigns
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[#F5F3FC] transition-colors text-left" onClick={() => navigate('/profile')}>
                      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF]" /> Profile
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function DesignModeToggle() {
  const { mode, setMode } = useDesignMode();
  return (
    <div className="fixed bottom-24 right-6 z-[100] flex gap-1 p-1 bg-white rounded-xl shadow-lg border border-[#E3E3E3]">
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
          mode === 'figma' ? 'bg-[#1A1A1A] text-white' : 'text-[#717171] hover:text-[#1A1A1A]'
        }`}
        onClick={() => setMode('figma')}
      >
        <Figma className="w-3.5 h-3.5" />
        Figma
      </button>
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
          mode === 'refined' ? 'bg-[#7A5CFA] text-white' : 'text-[#717171] hover:text-[#1A1A1A]'
        }`}
        onClick={() => setMode('refined')}
      >
        <Palette className="w-3.5 h-3.5" />
        Refined
      </button>
    </div>
  );
}

export default function Layout() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile');

  const content = (
    <ViewportContext.Provider value={viewportMode}>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <DesktopHeader />
        <MobileHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ViewportContext.Provider>
  );

  return (
    <>
      {viewportMode === 'desktop' ? (
        content
      ) : (
        <div className="min-h-screen bg-[#F0EFF5] flex flex-col items-center">
          <div className="mobile-frame my-0 lg:my-6 lg:rounded-[40px] w-full lg:w-[375px] lg:max-h-[812px] overflow-auto lg:border lg:border-[#D1D1D6]">
            {content}
          </div>
        </div>
      )}
      <ViewportToggle mode={viewportMode} onModeChange={setViewportMode} />
      <DesignModeToggle />
      <DemoControls />
      <Toaster position="top-center" />
    </>
  );
}
