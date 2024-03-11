import { TextButton } from "components/index";
import { useStepManager } from "store/steps/hooks";

export default function StepViewButton({ step }: { step: string | undefined | number }) {
  const { open } = useStepManager();

  return <TextButton onClick={() => open(step?.toString())}>View Details</TextButton>;
}
