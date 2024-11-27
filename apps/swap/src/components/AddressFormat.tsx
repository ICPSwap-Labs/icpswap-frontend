import Copy, { CopyRef } from "components/Copy";
import { shorten } from "@icpswap/utils";
import { Typography, type TypographyProps } from "@mui/material";
import { useRef } from "react";

export interface AddressFormatProps {
  sx?: TypographyProps["sx"];
  address: string;
  length?: number;
}

export function AddressFormat({ address, sx, length = 8 }: AddressFormatProps) {
  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef.current?.copy();
    }
  };

  return (
    <>
      <Copy content={address} hide ref={copyRef}>
        {shorten(address, 8)}
      </Copy>
      <Typography
        color="text.primary"
        sx={{
          cursor: "pointer",
          ...sx,
        }}
        onClick={handleCopy}
      >
        {shorten(address, length)}
      </Typography>
    </>
  );
}
