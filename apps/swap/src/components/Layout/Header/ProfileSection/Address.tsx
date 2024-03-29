import { useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";
import Copy, { CopyRef } from "components/Copy";
import { mockALinkAndOpen } from "utils/index";
import { ReactComponent as ExternalLink } from "assets/icons/external-link.svg";

export interface AddressSectionProps {
  label: string;
  link: string | undefined;
  address: string | undefined;
  labelColor: "#E3F2FD" | "#EFEFFF";
}

export function AddressSection({ label, link, address, labelColor }: AddressSectionProps) {
  const theme = useTheme() as Theme;

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
    <Box
      sx={{
        wordBreak: "break-all",
        padding: "12px",
        textAlign: "left",
        border: "1px solid #EFEFFF",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ marginBottom: "8px" }}>
        <Box
          sx={{
            padding: "3px 6px ",
            background: labelColor,
            borderRadius: "30px",
            color: "#111936",
            fontSize: "10px",
          }}
          component="span"
        >
          {label}
        </Box>
      </Box>

      <Typography
        component="span"
        sx={{
          whiteSpace: "break-spaces",
          cursor: "pointer",
          color: "#111936",
        }}
        onClick={handleCopy}
      >
        {address}
      </Typography>

      <Copy content={address ?? ""} hide ref={copyRef} />

      <Box
        component="span"
        ml="5px"
        sx={{
          cursor: "pointer",
          position: "relative",
          top: "1px",
          overflow: "hidden",
          fontSize: "18px",
          color: theme.colors.secondaryMain,
        }}
      >
        <ExternalLink width="14px" height="14px" onClick={handleToExplorer} />
      </Box>
    </Box>
  );
}
