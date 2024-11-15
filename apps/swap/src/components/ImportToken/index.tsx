import { useState } from "react";

import { ImportTokenTip } from "./steps/Tip";
import { ConfirmImport } from "./steps/Confirm";

export interface ImportTokenProps {
  canisterId: string;
  onCancel: () => void;
  onImportSuccessfully?: () => void;
}

export function ImportToken({ canisterId, onCancel, onImportSuccessfully }: ImportTokenProps) {
  const [step, setStep] = useState(0);

  return (
    <>
      {step === 0 ? <ImportTokenTip canisterId={canisterId} onOk={() => setStep(1)} onNo={onCancel} /> : null}
      {step === 1 ? (
        <ConfirmImport
          canisterId={canisterId}
          open={step === 1}
          onClose={() => setStep(1)}
          onImportSuccessfully={onImportSuccessfully}
        />
      ) : null}
    </>
  );
}
