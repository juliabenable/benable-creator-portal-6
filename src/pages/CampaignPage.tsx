import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { StepIndicator } from '@/components/StepIndicator';
import { useCreator } from '@/context/CreatorContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Package,
  Upload,
  ExternalLink,
  Send,
  PartyPopper,
  Clock,
  FileText,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  XCircle,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Rocket,
  Image,
  Home,
  Edit3,
  Check,
  Gift,
  CheckCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Campaign, ContentLinkEntry } from '@/types';
import { StickyCTA } from '@/components/StickyCTA';

/* ─── Content Link Preview ─── */
function ContentLinkPreview({ platform, url }: { platform: string; url: string }) {
  if (!url) return null;

  const isTikTok = platform.toLowerCase().includes('tiktok');
  const bgColor = isTikTok ? 'bg-black' : 'bg-gradient-to-br from-purple-600 to-pink-500';
  const label = isTikTok ? 'TT' : 'IG';

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center shrink-0`}>
        <span className="text-white text-xs font-bold">{label}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{platform}</p>
        <p className="text-sm truncate">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
    </div>
  );
}

/* ─── Uploaded Asset Preview ─── */
function UploadedAssetPreview({ platform, fileName, caption }: { platform: string; fileName: string; caption?: string }) {
  const isVideo = fileName.match(/\.(mp4|mov|webm|avi)$/i);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          isVideo ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-sky-400 to-blue-500'
        }`}>
          {isVideo ? (
            <FileText className="w-5 h-5 text-white" />
          ) : (
            <Image className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{isVideo ? 'Video' : 'Image'} · {platform}</p>
          <p className="text-sm truncate font-medium">{fileName}</p>
        </div>
        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
      </div>
      {caption && (
        <div className="px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Caption</p>
          <p className="text-xs leading-relaxed">{caption}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Help/Contact Footer ─── */
function HelpFooter() {
  return (
    <div className="text-center text-[13px] text-muted-foreground/80 py-5 mt-1">
      Questions? Email <a href="mailto:collabs@benable.com" className="text-muted-foreground hover:text-foreground transition-colors">collabs@benable.com</a>
    </div>
  );
}

/* ─── Platform options for content ─── */
const CONTENT_PLATFORMS = [
  { value: 'TikTok', label: 'TikTok' },
  { value: 'IG Post', label: 'IG Post' },
  { value: 'IG Reel', label: 'IG Reel' },
  { value: 'IG Story', label: 'IG Story' },
];

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns } = useCreator();

  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  if (campaign.declined) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">You've declined this campaign opportunity.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-5 pb-36">
      {/* Step Indicator — only for non-interest_check steps */}
      {campaign.currentStep !== 'interest_check' && (
        <Card className="py-4">
          <CardContent>
            <StepIndicator currentStep={campaign.currentStep} />
          </CardContent>
        </Card>
      )}

      {/* Dynamic Step Content */}
      <div
        key={campaign.currentStep}
        className="animate-fade-in-up"
      >
        <StepContent campaign={campaign} />
      </div>

      <HelpFooter />
    </div>
  );
}

function StepContent({ campaign }: { campaign: Campaign }) {
  switch (campaign.currentStep) {
    case 'interest_check':
      return <InterestCheckStep campaign={campaign} />;
    case 'invitation':
      return <InvitationStep campaign={campaign} />;
    case 'product_phase':
      return <ProductPhaseStep campaign={campaign} />;
    case 'order_placed':
      return <OrderPlacedStep campaign={campaign} />;
    case 'order_received':
      return <OrderReceivedStep campaign={campaign} />;
    case 'content_upload':
      return <ContentUploadStep campaign={campaign} />;
    case 'content_review':
      return <ContentReviewStep campaign={campaign} />;
    case 'compliance_feedback':
      return <ComplianceFeedbackStep campaign={campaign} />;
    case 'content_approved':
      return <ContentApprovedStep campaign={campaign} />;
    case 'completed':
      return <CompletedStep campaign={campaign} />;
  }
}

type StepProps = { campaign: Campaign };

/* ─── Brand Logo for 28 Litsea ─── */
function BrandLogo28Litsea({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#2a2a3d] flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="text-center leading-none">
        <span className="block text-white/90 text-[8px] font-light italic tracking-[0.15em]" style={{ fontFamily: 'Georgia, serif' }}>28</span>
        <span className="block text-white/90 text-[7px] font-light tracking-[0.2em] uppercase mt-[1px]" style={{ fontFamily: 'Georgia, serif' }}>LITSEA</span>
      </div>
    </div>
  );
}

/* ─── Green filled check icon ─── */
function GreenCheck() {
  return (
    <div className="w-[18px] h-[18px] rounded-full bg-green-500 flex items-center justify-center shrink-0">
      <Check className="w-3 h-3 text-white" strokeWidth={3} />
    </div>
  );
}

/* ─── Step: Interest Check (Campaign Brief — matching Figma) ─── */
function InterestCheckStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showCommitDialog, setShowCommitDialog] = useState(false);

  const deliverables = campaign.contentDeliverables || campaign.requirements;
  const instructions = campaign.otherInstructions || [];
  const firstProduct = campaign.productOptions?.[0];

  return (
    <div className="space-y-5">
      {/* Campaign Header Card — gradient with brand logo */}
      <div
        className="rounded-[12px] border border-[#e8daec] overflow-hidden relative"
        style={{
          background: 'linear-gradient(81.26deg, rgba(204,161,247,0.12) 7%, rgba(215,164,222,0.12) 48%, rgba(234,169,178,0.12) 95%), linear-gradient(90deg, white 0%, white 100%)',
        }}
      >
        {/* Decorative blurred blobs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#eaa9b2] rounded-full blur-[54px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[rgba(122,92,250,0.5)] rounded-full blur-[54px] opacity-60 pointer-events-none" />
        <div className="relative px-5 py-5">
          <div className="flex items-center gap-3.5">
            <BrandLogo28Litsea size={40} />
            <div>
              <h2 className="font-semibold text-[16px] text-[#222] leading-snug">{campaign.title}</h2>
              <p className="font-medium text-[14px] text-[#7a5cfa] mt-0.5">by {campaign.brandName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* About the Brand — standalone section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#717171]" />
          <h3 className="font-semibold text-[16px] text-[#222]">About the Brand</h3>
        </div>
        <p className="text-[14px] text-[#3f3f46] leading-[20px]">
          {campaign.brandAbout || 'Clean, plant-based skincare rooted in nature. Crafted with sustainably sourced botanicals for radiant, healthy skin.'}
        </p>
      </div>

      <div className="border-t border-gray-200" />

      {/* Goal — light card */}
      <div className="bg-[#faf8ff] border-[0.5px] border-[#d6cfea] rounded-[16px] px-4 pt-4 pb-6 space-y-2.5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#717171]" />
          <h3 className="font-semibold text-[16px] text-[#222]">Goal</h3>
        </div>
        <p className="text-[16px] text-[#1c1c1c] leading-[22.75px]">
          {campaign.description}
        </p>
      </div>

      <div className="border-t border-gray-200" />

      {/* Compensation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#717171]" />
          <h3 className="font-semibold text-[16px] text-[#222]">Compensation</h3>
        </div>

        <span className="inline-block bg-[#faf8ff] border border-[#7a5cfa] rounded-full px-2.5 py-1 text-[14px] text-[#7a5cfa] font-medium">
          {campaign.compensationType}
        </span>

        <div className="bg-[#f9fafa] border-[0.5px] border-[#ddd] rounded-[16px] p-3 space-y-3">
          <p className="text-[14px] text-[#3f3f46]">
            Choose 1 product from the selection below. This is the product you'll feature in your content.
          </p>

          {/* Product tile */}
          {firstProduct && (
            <div className="flex items-center gap-3.5 bg-white rounded-xl p-3 shadow-sm">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden border border-[#E8E8E8]">
                {firstProduct.imageUrl ? (
                  <img src={firstProduct.imageUrl} alt={firstProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-8 rounded bg-gray-200/80 relative">
                      <div className="absolute inset-x-1 top-1 h-3 rounded-sm bg-white/60" />
                      <div className="absolute bottom-0 inset-x-0 h-2 bg-gray-300/50 rounded-b" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#1A1A1A]">{firstProduct.name}</p>
                <p className="text-xs text-[#717171] mt-0.5">
                  {firstProduct.size}{firstProduct.stock ? ` · ${firstProduct.stock} in stock` : ''}
                </p>
              </div>
              {firstProduct.price && (
                <p className="text-[15px] font-semibold shrink-0 text-[#1A1A1A]">
                  ${firstProduct.price.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Content Deliverable */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#717171]" />
          <h3 className="font-semibold text-[16px] text-[#222]">Content Deliverable</h3>
        </div>
        <ul className="space-y-2.5">
          {deliverables.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#3f3f46]">
              <span className="mt-[2px]"><GreenCheck /></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200" />

      {/* Other Instructions */}
      {instructions.length > 0 && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#717171]" />
              <h3 className="font-semibold text-[16px] text-[#222]">Other Instructions</h3>
            </div>
            <ul className="space-y-2.5">
              {instructions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#3f3f46]">
                  <span className="mt-[2px]"><GreenCheck /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200" />
        </>
      )}

      {/* Terms & Commitments */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#717171]" />
          <h3 className="font-semibold text-[16px] text-[#222]">Terms & Commitments</h3>
        </div>
        <p className="text-[14px] text-[#3f3f46] leading-[20px]">
          {campaign.termsText || 'You agree to deliver the content described above. All content must be submitted for review before publishing. You agree to keep the product and campaign details confidential until publication. UGC rights granted for 90 days across brand channels.'}
        </p>
      </div>

      {/* Accept / Decline Actions — Sticky CTA */}
      {!showDecline ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E8E8] px-4 py-4 pb-6">
          <div className="max-w-lg mx-auto space-y-2">
            <button
              className="w-full h-[48px] rounded-[12px] bg-[#7a5cfa] text-white text-[16px] font-medium hover:bg-[#6B4FE0] transition-colors active:scale-[0.98]"
              onClick={() => setShowCommitDialog(true)}
            >
              Accept & Commit
            </button>
            <button
              className="w-full py-2 text-[14px] text-[#717171] font-medium hover:text-[#1A1A1A] transition-colors"
              onClick={() => setShowDecline(true)}
            >
              Not This Time
            </button>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">No problem! Help us understand why</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Please let us know why this campaign isn't a fit. This helps us send you better
              matches in the future.
            </p>
            <Textarea
              placeholder="e.g. Not available during this timeframe, doesn't align with my content, already have a competing partnership..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDecline(false)}
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!declineReason.trim()}
                onClick={() => {
                  updateCampaignField(campaign.id, {
                    declined: true,
                    declineReason: declineReason,
                  });
                  toast('Campaign declined. We\'ll find you a better match!');
                }}
              >
                Decline Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commitment confirmation dialog */}
      <AlertDialog open={showCommitDialog} onOpenChange={setShowCommitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Commitment</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  By accepting, you commit to delivering content as described in the brief by{' '}
                  <strong className="text-foreground">{campaign.contentDueDate}</strong>
                  {campaign.postingSchedule === 'asap'
                    ? ' and publishing as soon as your content is approved'
                    : campaign.postingSchedule === 'specific_date'
                      ? <> and publishing on <strong className="text-foreground">{campaign.postingDate || campaign.publishWindowStart}</strong></>
                      : <> and publishing between{' '}<strong className="text-foreground">{campaign.publishWindowStart}</strong> and{' '}<strong className="text-foreground">{campaign.publishWindowEnd}</strong></>
                  }.
                </p>
                <p className="font-medium text-foreground">This is a binding agreement with {campaign.brandName}.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <Button
              onClick={() => {
                setShowCommitDialog(false);
                window.scrollTo(0, 0);
                setCampaignStep(campaign.id, 'product_phase');
                toast.success('Campaign accepted! Check your product details.');
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              I Commit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── InvitationStep ─── */
function InvitationStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  setCampaignStep(campaign.id, 'product_phase');
  return null;
}

/* ─── Step: Product Phase ─── */
function ProductPhaseStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(campaign.selectedProduct || '');
  const [productPage, setProductPage] = useState(0);

  const hasProductChoice = campaign.productType === 'product_choice' && campaign.productOptions && campaign.productOptions.length > 1;
  const productChosen = hasProductChoice ? !!selectedProductId : true;

  const PRODUCTS_PER_PAGE = 4;
  const allProducts = campaign.productOptions || [];
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProducts.slice(productPage * PRODUCTS_PER_PAGE, (productPage + 1) * PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-4">
      {hasProductChoice && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Choose Your Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground -mt-1">
              {campaign.brandName} is offering you a choice. Select the one you'd like to feature.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {paginatedProducts.map((option) => {
                const isSelected = selectedProductId === option.id;
                const productUrl = `https://${campaign.brandName.toLowerCase().replace(/\s+/g, '')}.com`;
                return (
                  <div key={option.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductId(option.id);
                        updateCampaignField(campaign.id, { selectedProduct: option.id });
                        toast.success(`Selected: ${option.name}`);
                      }}
                      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
                        isSelected
                          ? 'border-primary ring-1 ring-primary/20'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                        {option.imageUrl ? (
                          <img src={option.imageUrl} alt={option.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-muted-foreground/40" />
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-primary' : ''}`}>
                          {option.name}
                        </p>
                        {option.description && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{option.description}</p>
                        )}
                        {option.size && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">{option.size}</p>
                        )}
                      </div>
                    </button>
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-xs text-primary font-medium mt-1.5 py-1.5 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on website
                    </a>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage === 0}
                  onClick={() => setProductPage((p) => p - 1)}
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Prev
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {productPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage >= totalPages - 1}
                  onClick={() => setProductPage((p) => p + 1)}
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}

            {selectedProductId && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">
                  Product selected: {campaign.productOptions!.find((o) => o.id === selectedProductId)?.name}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      <Card className={!productChosen ? 'opacity-50 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!editingAddress ? (
            <>
              <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium">123 Main St</p>
                <p className="text-muted-foreground">New York, NY 10001</p>
                <p className="text-muted-foreground">United States</p>
              </div>
              {!addressConfirmed ? (
                <div className="space-y-2">
                  <Button
                    className="w-full h-11 text-base font-semibold"
                    onClick={() => {
                      setAddressConfirmed(true);
                      toast.success('Address confirmed!');
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirm Address
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => setEditingAddress(true)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Need to update your address?
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Address confirmed</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground text-xs h-auto py-1 px-2"
                    onClick={() => {
                      setAddressConfirmed(false);
                      setEditingAddress(true);
                    }}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Street Address</Label>
                <Input placeholder="123 Main St" defaultValue="123 Main St" className="h-9" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">City</Label>
                  <Input placeholder="City" defaultValue="New York" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">State</Label>
                  <Input placeholder="State" defaultValue="NY" className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">ZIP</Label>
                  <Input placeholder="ZIP" defaultValue="10001" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Input placeholder="Country" defaultValue="United States" className="h-9" />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setEditingAddress(false);
                  setAddressConfirmed(true);
                  toast.success('Address updated and confirmed!');
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Save & Confirm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          disabled={!productChosen}
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'order_placed');
            toast.success('Order marked as placed!');
          }}
        >
          <Package className="w-5 h-5 mr-2" />
          I've Placed My Order
        </Button>
      </StickyCTA>

      <UpcomingSteps
        steps={[
          'Once your product arrives, confirm receipt',
          'Create your content per the brief',
          'Submit content for review before publishing',
        ]}
      />
    </div>
  );
}

/* ─── Step: Order Placed ─── */
function OrderPlacedStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-6 text-center space-y-2">
          <div className="relative mx-auto w-12 h-12 mb-1">
            <Package className="w-12 h-12 text-primary mx-auto animate-bounce" style={{ animationDuration: '2s' }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full" />
          </div>
          <p className="font-semibold text-lg">Product is on its way</p>
          <p className="text-sm text-muted-foreground">
            Your order has been placed. Please let us know as soon as you receive it.
          </p>
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'order_received');
            toast.success('Product received! Time to create your content.');
          }}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          I've Received My Product
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Step: Order Received ─── */
function OrderReceivedStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  setCampaignStep(campaign.id, 'content_upload');
  return null;
}

/* ─── Collapsible Campaign Brief ─── */
function CampaignBriefCollapsible({ campaign }: StepProps) {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <Collapsible open={briefOpen} onOpenChange={setBriefOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Campaign Brief
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                briefOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator />
            <div className="max-h-[300px] overflow-y-auto space-y-3 pt-3 pr-1">
              <p className="text-sm text-muted-foreground">{campaign.description}</p>
              <ul className="space-y-1.5">
                {campaign.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {campaign.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                Content due: <strong>{campaign.contentDueDate}</strong>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                Posting schedule:{' '}
                <strong>
                  {campaign.postingSchedule === 'asap'
                    ? 'Post ASAP after approval'
                    : campaign.postingSchedule === 'specific_date'
                      ? `Post on ${campaign.postingDate || campaign.publishWindowStart}`
                      : `${campaign.publishWindowStart} — ${campaign.publishWindowEnd}`}
                </strong>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

/* ─── Step: Content Upload ─── */
function ContentUploadStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [entries, setEntries] = useState<(ContentLinkEntry & { uploading?: boolean; isFixed?: boolean })[]>(
    campaign.requiredPlatforms.map((p, i) => ({
      id: `entry-${i}`,
      platform: p,
      type: 'upload' as const,
      url: '',
      fileName: '',
      caption: '',
      isFixed: true,
    }))
  );

  function addEntry() {
    setEntries((prev) => [
      ...prev,
      { id: `entry-${Date.now()}`, platform: 'TikTok', type: 'upload' as const, url: '', fileName: '', caption: '', isFixed: false },
    ]);
  }

  function updateEntry(id: string, field: string, value: string | boolean) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function simulateUpload(id: string, file: File) {
    updateEntry(id, 'uploading', true);
    setTimeout(() => {
      setEntries((prev) => prev.map((e) =>
        e.id === id
          ? { ...e, fileName: file.name, url: URL.createObjectURL(file), uploading: false }
          : e
      ));
    }, 1200);
  }

  function handleSubmit() {
    updateCampaignField(campaign.id, { contentSubmissions: entries.filter((e) => e.fileName || e.caption?.trim()) });
    window.scrollTo(0, 0);
    setCampaignStep(campaign.id, 'content_review');
    toast.success('Content submitted for review!');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
        <Upload className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          Submit your content for review by <strong>{campaign.contentDueDate}</strong>. Do not publish — content must be approved first.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Campaign Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
          <ul className="space-y-1.5">
            {campaign.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {campaign.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            Content due: <strong>{campaign.contentDueDate}</strong>
          </div>
        </CardContent>
      </Card>

      <div className="px-1">
        <h3 className="text-base font-semibold">Submit Your Content</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your image or video and add your caption for each deliverable.
        </p>
      </div>

      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="py-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {entry.isFixed ? (
                  <span className="text-sm font-semibold">{entry.platform}</span>
                ) : (
                  <Select value={entry.platform} onValueChange={(v) => updateEntry(entry.id, 'platform', v)}>
                    <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {entry.uploading ? (
              <div className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-primary font-medium">Uploading...</span>
              </div>
            ) : entry.fileName ? (
              <div className="space-y-1.5">
                <UploadedAssetPreview platform={entry.platform} fileName={entry.fileName} />
                <button
                  onClick={() => {
                    updateEntry(entry.id, 'fileName', '');
                    updateEntry(entry.id, 'url', '');
                  }}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Replace file
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-lg px-4 py-5 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRefs.current[entry.id]?.click()}
              >
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-sm font-medium">Upload image or video</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG, MP4, MOV — max 100MB</p>
                <input
                  ref={(el) => { fileInputRefs.current[entry.id] = el; }}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) simulateUpload(entry.id, file);
                  }}
                />
              </div>
            )}

            {(() => {
              const captionReqs = campaign.requirements
                .filter((req) => req.toLowerCase().includes('caption') || req.toLowerCase().includes('mention') || req.toLowerCase().includes('hashtag') || req.toLowerCase().includes('include'));
              const hasReqs = captionReqs.length > 0 || campaign.hashtags.length > 0;
              if (!hasReqs) return null;
              return (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Requirements for this post
                  </p>
                  <div className="space-y-1.5">
                    {captionReqs.map((req, ri) => (
                      <div key={ri} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground">{req}</p>
                      </div>
                    ))}
                    {campaign.hashtags.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground">
                          Include hashtags: <span className="text-primary">{campaign.hashtags.join(' ')}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Caption</Label>
              <Textarea
                placeholder="Write your caption here... Include hashtags and @mentions"
                value={entry.caption || ''}
                onChange={(e) => updateEntry(entry.id, 'caption', e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addEntry}
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add Another Deliverable
      </Button>

      <StickyCTA>
        <Button className="w-full h-12 text-base font-semibold" onClick={handleSubmit}>
          <Send className="w-5 h-5 mr-2" />
          Submit for Review
        </Button>
      </StickyCTA>

      <UpcomingSteps
        steps={[
          "We'll review your content (1-3 business days)",
          "Once approved, you'll get your publish window",
          'Post and confirm to complete the campaign',
        ]}
      />
    </div>
  );
}

/* ─── Step: Waiting for Review ─── */
function ContentReviewStep({ campaign }: StepProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-6 text-center">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <p className="font-semibold text-lg">Waiting for Review</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Your content has been submitted and is being reviewed. This usually takes 1-3 business days.
          </p>
          <div className="flex items-center gap-2 justify-center mt-4 px-4 py-2.5 bg-red-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs text-red-800 font-medium">
              Do not publish your content yet — wait for approval.
            </p>
          </div>
        </CardContent>
      </Card>

      {campaign.contentSubmissions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submitted Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaign.contentSubmissions.map((sub, i) => (
              sub.fileName
                ? <UploadedAssetPreview key={i} platform={sub.platform} fileName={sub.fileName} caption={sub.caption} />
                : <ContentLinkPreview key={i} platform={sub.platform} url={sub.url} />
            ))}
          </CardContent>
        </Card>
      )}

      <CampaignBriefCollapsible campaign={campaign} />
    </div>
  );
}

/* ─── Step: Compliance Feedback ─── */
function ComplianceFeedbackStep({ campaign }: StepProps) {
  const { setCampaignStep } = useCreator();
  const checklist = campaign.complianceChecklist || [];

  const deliverables = [
    {
      platform: 'TikTok',
      items: checklist.filter((c) => ['Product Visibility', 'Video Length', 'Content Quality'].includes(c.category)),
    },
    {
      platform: 'IG Reel',
      items: checklist.filter((c) => ['Hashtags', 'Lighting', 'Brand Mention'].includes(c.category)),
    },
  ];

  return (
    <div className="space-y-4">
      {campaign.complianceNotes && (
        <Card>
          <CardContent className="py-4 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white">JM</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Joanna Martinez</p>
                <p className="text-[10px] text-muted-foreground">Content Specialist</p>
              </div>
            </div>
            <div className="ml-10 relative">
              <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-primary/10 border-b-[6px] border-b-transparent" />
              <div className="bg-primary/5 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm leading-relaxed">"{campaign.complianceNotes}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {deliverables.map((del) => {
        const needsWork = del.items.some((item) => item.status !== 'approved');
        return (
          <Collapsible key={del.platform} defaultOpen={needsWork}>
            <Card className={needsWork ? '' : 'border-success/20'}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-xl">
                  <span className="flex items-center gap-2">
                    {needsWork ? (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                    {del.platform}
                    {needsWork && (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Needs Changes</Badge>
                    )}
                    {!needsWork && (
                      <Badge className="bg-success/10 text-success text-[10px] border-0">Approved</Badge>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 pt-0">
                  {del.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        item.status === 'approved' ? 'bg-success/5' : 'bg-amber-50'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.status === 'approved' ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : item.status === 'missing' ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.category}</p>
                          {item.status !== 'approved' && (
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${
                                item.status === 'missing' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                            </Badge>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            window.scrollTo(0, 0);
            setCampaignStep(campaign.id, 'content_approved');
            toast.success('Moving to publish!');
          }}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Post as Approved
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Step: Content Approved + Publish ─── */
function ContentApprovedStep({ campaign }: StepProps) {
  const { setCampaignStep, updateCampaignField } = useCreator();
  const [links, setLinks] = useState<ContentLinkEntry[]>(
    campaign.requiredPlatforms.map((p, i) => ({
      id: `pub-${i}`,
      platform: p,
      type: 'link' as const,
      url: '',
    }))
  );
  const [showMissingLinksPrompt, setShowMissingLinksPrompt] = useState(false);

  const isPreWindow = false;
  const requiredLinks = links.filter((l) => !l.id.startsWith('pub-extra-'));
  const allRequiredFilled = requiredLinks.every((l) => l.url.trim() !== '');
  const filledCount = links.filter((l) => l.url.trim() !== '').length;

  function updateLink(id: string, field: keyof ContentLinkEntry, value: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function addLink() {
    setLinks((prev) => [
      ...prev,
      { id: `pub-extra-${Date.now()}`, platform: '', type: 'link' as const, url: '' },
    ]);
  }

  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function handlePublishClick() {
    if (!allRequiredFilled) {
      setShowMissingLinksPrompt(true);
      return;
    }
    updateCampaignField(campaign.id, { publishedLinks: links.filter((l) => l.url) });
    window.scrollTo(0, 0);
    setCampaignStep(campaign.id, 'completed');
    toast.success('Campaign completed! Thank you!');
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2.5 animate-in fade-in-0 slide-in-from-top-2 duration-500">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">Content Approved</h3>
        </div>
        <CardContent className="py-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="w-5 h-5 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <div>
              <h4 className="font-semibold text-base">Time to post!</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your content has been approved by {campaign.brandName}. Post it now and paste your live links below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isPreWindow && (
        <>
          <div className="px-1">
            <h3 className="text-base font-semibold">Your Live Links</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the public link for each piece of published content. All links are required.
            </p>
          </div>

          {links.map((link) => {
            const isExtra = link.id.startsWith('pub-extra-');
            return (
              <Card key={link.id}>
                <CardContent className="py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {isExtra ? (
                      <Select value={link.platform} onValueChange={(v) => updateLink(link.id, 'platform', v)}>
                        <SelectTrigger className="h-7 w-36 text-xs"><SelectValue placeholder="Platform" /></SelectTrigger>
                        <SelectContent>
                          {CONTENT_PLATFORMS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm font-medium">{link.platform}</span>
                    )}
                    {link.url.trim() ? (
                      <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 border-0 ml-auto">✓ Submitted</Badge>
                    ) : isExtra ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto text-muted-foreground">Optional</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto text-muted-foreground">Required</Badge>
                    )}
                    {isExtra && (
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder={`Paste your live ${link.platform || 'content'} link...`}
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="h-9"
                  />
                  {link.url && (
                    <ContentLinkPreview platform={link.platform || 'Other'} url={link.url} />
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addLink}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Another Link
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${(filledCount / links.length) * 100}%` }}
              />
            </div>
            <span>{filledCount}/{links.length} links submitted</span>
          </div>
        </>
      )}

      {!isPreWindow && (
        <StickyCTA>
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handlePublishClick}
          >
            <Rocket className="w-5 h-5 mr-2" />
            I've Published My Content
          </Button>
        </StickyCTA>
      )}

      <AlertDialog open={showMissingLinksPrompt} onOpenChange={setShowMissingLinksPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Missing Live Links</AlertDialogTitle>
            <AlertDialogDescription>
              You still need to add {requiredLinks.filter((l) => !l.url.trim()).length} required live link{requiredLinks.filter((l) => !l.url.trim()).length > 1 ? 's' : ''} before
              completing the campaign. Please paste the public URL for each piece of published content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back & Add Links</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Step: Completed ─── */
function CompletedStep({ campaign: _campaign }: StepProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardContent className="py-8 text-center space-y-4">
          <div className="relative mx-auto w-14 h-14">
            <PartyPopper className="w-14 h-14 text-primary mx-auto animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          </div>
          <div>
            <h3 className="font-bold text-xl">Congrats, you did it!</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              It's been so cool working with you. Keep creating great content and stay tuned for future campaigns!
            </p>
          </div>
          <div className="flex items-center gap-3 justify-center pt-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">JM</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Joanna Martinez</p>
              <p className="text-[11px] text-muted-foreground">Content Specialist</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <StickyCTA>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => navigate('/')}
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </StickyCTA>
    </div>
  );
}

/* ─── Shared: Upcoming Steps ─── */
function UpcomingSteps({ steps }: { steps: string[] }) {
  return (
    <Card className="bg-muted/50 border-dashed">
      <CardContent className="py-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Coming Up Next
        </p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
