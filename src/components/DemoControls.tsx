import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings2, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { ALL_STEPS_ORDERED, type CampaignStep, type CreatorStatus, type PostingScheduleType } from '@/types';

const STATUS_OPTIONS: { value: CreatorStatus; label: string }[] = [
  { value: 'not_applied', label: 'Not Applied' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'not_accepted', label: 'Not Accepted' },
];

const STEP_LABELS: Record<CampaignStep, string> = {
  interest_check: 'Interest Check',
  invitation: 'Campaign Invitation',
  product_phase: 'Product / Gift Card',
  order_placed: 'Order Placed',
  order_received: 'Order Received',
  content_upload: 'Upload Content',
  content_review: 'Waiting for Review',
  compliance_feedback: 'Compliance Feedback',
  content_approved: 'Approve & Publish',
  completed: 'Campaign Complete',
};

export function DemoControls() {
  const { creatorStatus, setCreatorStatus, campaigns, setCampaignStep, advanceCampaignStep, updateCampaignField, addNotification, resetAll } =
    useCreator();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg gap-1.5 bg-card"
        >
          <Settings2 className="w-4 h-4" />
          Demo
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Demo Controls</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div>
            <p className="text-sm font-medium mb-2">Creator Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={creatorStatus === opt.value ? 'default' : 'outline'}
                  onClick={() => setCreatorStatus(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">{campaign.brandName}</p>
                <Badge variant="secondary" className="text-xs">
                  {STEP_LABELS[campaign.currentStep]}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {ALL_STEPS_ORDERED.map((step) => (
                  <Button
                    key={step}
                    size="sm"
                    variant={campaign.currentStep === step ? 'default' : 'outline'}
                    className="text-xs h-7 px-2"
                    onClick={() => setCampaignStep(campaign.id, step)}
                  >
                    {STEP_LABELS[step]}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => advanceCampaignStep(campaign.id)}
                  disabled={campaign.currentStep === 'completed'}
                >
                  Advance to Next Step
                </Button>
              </div>

              {/* Product Type Toggle */}
              <div className="flex items-center gap-2 mb-2">
                <Button
                  size="sm"
                  variant={campaign.productType === 'product_choice' ? 'default' : 'outline'}
                  className="gap-1.5 text-xs h-7"
                  onClick={() => {
                    updateCampaignField(campaign.id, {
                      productType: campaign.productType === 'gift_card' ? 'product_choice' : 'gift_card',
                    });
                  }}
                >
                  {campaign.productType === 'product_choice' ? 'Product Choice' : 'Gift Card Only'}
                </Button>
              </div>

              {/* Posting Schedule Toggle */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-xs text-muted-foreground mr-1">Schedule:</span>
                {(['asap', 'specific_date', 'window'] as PostingScheduleType[]).map((sched) => (
                  <Button
                    key={sched}
                    size="sm"
                    variant={campaign.postingSchedule === sched ? 'default' : 'outline'}
                    className="text-xs h-7 px-2"
                    onClick={() => {
                      updateCampaignField(campaign.id, { postingSchedule: sched });
                    }}
                  >
                    {sched === 'asap' ? 'ASAP' : sched === 'specific_date' ? 'Specific Date' : 'Window'}
                  </Button>
                ))}
              </div>

              {/* Publish Window Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={campaign.publishWindowOpen ? 'default' : 'outline'}
                  className="gap-1.5 text-xs h-7"
                  onClick={() => {
                    updateCampaignField(campaign.id, {
                      publishWindowOpen: !campaign.publishWindowOpen,
                    });
                  }}
                >
                  {campaign.publishWindowOpen ? (
                    <ToggleRight className="w-3.5 h-3.5" />
                  ) : (
                    <ToggleLeft className="w-3.5 h-3.5" />
                  )}
                  Publish Window {campaign.publishWindowOpen ? 'Open' : 'Closed'}
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                addNotification({
                  type: 'general',
                  title: 'Test Notification',
                  message: 'This is a test notification to preview the notification center.',
                })
              }
            >
              <Bell className="w-3.5 h-3.5" />
              Add Test Notification
            </Button>
            <Button variant="destructive" size="sm" onClick={resetAll}>
              Reset Everything
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
