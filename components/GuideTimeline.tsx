// Visual timeline component for guide pages
// Shows the steps in a process with visual representation

interface TimelineStep {
  id: string;
  label: string;
  shortLabel?: string;
  duration: string;
  color: "emerald" | "amber" | "brand";
}

interface GuideTimelineProps {
  steps: TimelineStep[];
  activeStep?: string;
  compact?: boolean;
}

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  amber: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  brand: {
    bg: "bg-brand-500",
    bgLight: "bg-brand-100",
    text: "text-brand-700",
    border: "border-brand-200",
  },
};

export function GuideTimeline({ steps, activeStep, compact = false }: GuideTimelineProps) {
  return (
    <div className={`flex items-center gap-1 ${compact ? "text-xs" : "text-sm"}`}>
      {steps.map((step, index) => {
        const colors = colorClasses[step.color];
        const isActive = activeStep === step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            {/* Step block */}
            <div
              className={`
                relative flex items-center justify-center
                ${compact ? "px-2 py-1" : "px-3 py-1.5"}
                rounded
                ${isActive ? colors.bg + " text-white" : colors.bgLight + " " + colors.text}
                transition-colors
              `}
            >
              <span className={compact ? "font-medium" : "font-medium"}>
                {compact ? step.shortLabel || step.label : step.label}
              </span>
              {!compact && (
                <span className={`ml-1.5 opacity-70 ${isActive ? "text-white/80" : ""}`}>
                  {step.duration}
                </span>
              )}
            </div>
            
            {/* Connector arrow */}
            {index < steps.length - 1 && (
              <svg
                className={`w-4 h-4 mx-0.5 ${compact ? "text-gray-300" : "text-gray-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Mini version for the guides index page
export function GuideTimelineMini({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex items-center gap-0.5 mt-3">
      {steps.map((step, index) => {
        const colors = colorClasses[step.color];
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`h-1.5 rounded-full ${colors.bg}`}
              style={{ width: `${Math.max(24, step.duration.length * 3)}px` }}
              title={`${step.label}: ${step.duration}`}
            />
            {!isLast && <div className="w-1" />}
          </div>
        );
      })}
    </div>
  );
}

// Step indicator that highlights the current section in a guide
export function GuideStepIndicator({
  step,
  isActive = true,
}: {
  step: TimelineStep;
  isActive?: boolean;
}) {
  const colors = colorClasses[step.color];
  
  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4
      ${isActive ? colors.bg + " text-white" : colors.bgLight + " " + colors.text}
    `}>
      <span className="font-medium">{step.label}</span>
      <span className={isActive ? "text-white/80" : "opacity-70"}>{step.duration}</span>
    </div>
  );
}
