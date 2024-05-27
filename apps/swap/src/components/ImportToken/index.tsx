import { useState } from "react";

import { ImportTokenTip } from "./steps/Tip";
import { ChooseStandardAndVerify } from "./steps/ChooseStandard";
import { ConfirmImport } from "./steps/Confirm";
import { Verification } from "./types";

export interface ImportTokenProps {
  canisterId: string;
  onCancel: () => void;
  onImportSuccessfully?: () => void;
}

export function ImportToken({ canisterId, onCancel, onImportSuccessfully }: ImportTokenProps) {
  const [step, setStep] = useState(0);

  const [verification, setVerification] = useState({} as Verification);

  const handleNext = (verification: Verification) => {
    setVerification(verification);
    setStep(2);
  };

  return (
    <>
      {step === 0 ? <ImportTokenTip onOk={() => setStep(1)} onNo={onCancel} /> : null}
      {step === 1 ? <ChooseStandardAndVerify canisterId={canisterId} onNext={handleNext} /> : null}
      {step === 2 ? (
        <ConfirmImport
          canisterId={canisterId}
          open={step === 2}
          onClose={() => setStep(1)}
          onImportSuccessfully={onImportSuccessfully}
          verification={verification}
        />
      ) : null}
    </>
  );
}
