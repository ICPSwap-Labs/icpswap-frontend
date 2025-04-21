import { StepDetails } from "components/Steps/Details";
import { useOpenedSteps, useStepDetails } from "store/steps/hooks";
import { SwapStepDetails } from "components/Steps/SwapDetails";

function StepItem({ step }: { step: string }) {
  const { activeStep, errorStep, content, onClose, title, description, type } = useStepDetails(step);

  return type === "swap" ? (
    <SwapStepDetails
      title={title}
      open
      activeStep={activeStep}
      errorStep={errorStep}
      content={content}
      onClose={onClose}
      description={description}
    />
  ) : (
    <StepDetails
      title={title}
      open
      activeStep={activeStep}
      errorStep={errorStep}
      content={content}
      onClose={onClose}
      description={description}
    />
  );
}

export default function GlobalSteps() {
  const openedSteps = useOpenedSteps();

  return (
    <>
      {openedSteps.map((step) => (
        <StepItem key={step} step={step} />
      ))}
    </>
  );
}
