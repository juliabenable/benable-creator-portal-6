import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CampaignStep } from '@/types';
import { ALL_STEPS_ORDERED } from '@/types';

const TIMELINE_LABELS: Record<CampaignStep, string> = {
  interest_check: 'Showed interest',
  invitation: 'Accepted campaign',
  product_phase: 'Viewed product details',
  order_placed: 'Placed order',
  order_received: 'Received product',
  content_upload: 'Submitted content',
  content_review: 'Content under review',
  compliance_feedback: 'Received feedback',
  content_approved: 'Content approved & published',
  completed: 'Campaign completed',
};

interface CampaignTimelineProps {
  currentStep: CampaignStep;
  stepTimestamps?: Record<string, string>;
}

export function CampaignTimeline({ currentStep, stepTimestamps = {} }: CampaignTimelineProps) {
  const currentIdx = ALL_STEPS_ORDERED.indexOf(currentStep);

  return (
    <div className="space-y-0">
      {ALL_STEPS_ORDERED.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = step === currentStep;
        const isFuture = i > currentIdx;

        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                  isCompleted && 'bg-primary text-white',
                  isCurrent && 'bg-primary/20 border-2 border-primary',
                  isFuture && 'bg-muted'
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <div className={cn('w-2 h-2 rounded-full', isCurrent ? 'bg-primary' : 'bg-muted-foreground/30')} />
                )}
              </div>
              {i < ALL_STEPS_ORDERED.length - 1 && (
                <div className={cn('w-0.5 h-6', isCompleted ? 'bg-primary' : 'bg-muted')} />
              )}
            </div>
            <div className="pb-4 -mt-0.5">
              <p className={cn('text-sm', isFuture ? 'text-muted-foreground' : 'font-medium')}>
                {TIMELINE_LABELS[step]}
              </p>
              {isCompleted && stepTimestamps[step] && (
                <p className="text-xs text-muted-foreground">{stepTimestamps[step]}</p>
              )}
              {isCurrent && <p className="text-xs text-primary font-medium">Current step</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
