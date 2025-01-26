import { useRef } from "react";
import { Box, Typography } from "components/Mui";
import Copy, { CopyRef } from "components/Copy";
import { Image } from "components/index";
import { mockALinkAndOpen, shorten } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";

export interface AddressSectionProps {
  label: string;
  link: string | undefined;
  address: string | undefined;
}

export function AddressSection({ label, link, address }: AddressSectionProps) {
  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  const handleToExplorer = () => {
    if (!link) return;
    mockALinkAndOpen(link, "explorers_address");
  };

  return (
    <Flex gap="0 6px">
      <Box
        sx={{
          padding: "3px 6px",
          background: "#3B425B",
          borderRadius: "30px",
          color: "#fffff",
          fontSize: "10px",
        }}
        component="span"
      >
        {label}
      </Box>

      <Typography
        component="span"
        sx={{
          whiteSpace: "break-spaces",
          cursor: "pointer",
          color: "text.primary",
          fontSize: "12px",
        }}
        onClick={handleCopy}
      >
        {address ? shorten(address) : "--"}
      </Typography>

      <Copy content={address ?? ""} hide ref={copyRef} />

      <Image
        src="/images/external-link.svg"
        sx={{ width: "18px", height: "18px", cursor: "pointer" }}
        onClick={handleToExplorer}
      />
    </Flex>
  );
}
