import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { CAMPAIGN_STEPS, getStepIndex, type CampaignStep } from '@/types';

interface StepIndicatorProps {
  currentStep: CampaignStep;
}

// Sub-step progress within each major step (0-1 range)
function getSubStepProgress(step: CampaignStep): number {
  switch (step) {
    case 'order_placed':
      return 0.33;
    case 'order_received':
      return 0.66;
    case 'content_review':
      return 0.33;
    case 'compliance_feedback':
      return 0.66;
    case 'content_approved':
      return 0.8; // Show ~80% progress at this stage
    default:
      return 0;
  }
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const activeIndex = getStepIndex(currentStep);
  const subProgress = getSubStepProgress(currentStep);
  const totalSteps = CAMPAIGN_STEPS.length;
  // Overall progress: completed steps + current step partial progress
  // When completed (last step), show 100%
  const isCompleted = currentStep === 'completed';
  const overallProgress = isCompleted ? 100 : ((activeIndex + subProgress) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      {/* Overall progress bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(overallProgress, 3)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">
            Step {isCompleted ? totalSteps : activeIndex + 1} of {totalSteps}
          </span>
          <span className="text-[10px] font-medium text-primary">
            {Math.round(overallProgress)}%
          </span>
        </div>
      </div>

      {/* Step circles */}
      <div className="flex items-center justify-between w-full overflow-hidden">
        {CAMPAIGN_STEPS.map((step, i) => {
          const allDone = currentStep === 'completed';
          const isCompleted = allDone || i < activeIndex;
          const isActive = !allDone && i === activeIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 shrink-0',
                      isCompleted && 'bg-primary text-primary-foreground',
                      isActive && 'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                      !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {/* Pulse ring for active step */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[9px] font-medium text-center leading-tight whitespace-nowrap',
                    isActive ? 'text-primary font-semibold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {i < CAMPAIGN_STEPS.length - 1 && (
                <div className="flex-1 mx-1 mt-[-14px]">
                  <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        i < activeIndex ? 'bg-primary w-full' :
                        i === activeIndex && subProgress > 0 ? 'bg-primary/60' : 'w-0'
                      )}
                      style={i === activeIndex && subProgress > 0 ? { width: `${subProgress * 100}%` } : undefined}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
