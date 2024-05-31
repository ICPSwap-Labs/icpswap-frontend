import { Typography, TextField } from "components/Mui";
import { useMemo, useState } from "react";
import { isValidPrincipal } from "@icpswap/utils";
import { t } from "@lingui/macro";

export interface MakeProposalInputProps {
  type?: "text" | "number" | "principal";
  onChange?: (value: string) => void;
}

export function MakeProposalInput({ type, onChange }: MakeProposalInputProps) {
  const [value, setValue] = useState<undefined | string>(undefined);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setValue(event.target.value);
    if (onChange) {
      onChange(value);
    }
  };

  const error = useMemo(() => {
    if (type === "principal" && value && !isValidPrincipal(value)) {
      return t`Input Error: invalid principal`;
    }
  }, [value]);

  return (
    <>
      <TextField sx={{ margin: "5px 0 0 0" }} size="small" fullWidth placeholder={type} onChange={handleInputChange} />
      {error ? <Typography sx={{ fontSize: "12px", color: "text.warning" }}>{error}</Typography> : null}
    </>
  );
}
