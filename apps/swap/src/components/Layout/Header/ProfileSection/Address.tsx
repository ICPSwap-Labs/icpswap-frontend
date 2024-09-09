import { useRef } from "react";
import { Box, Typography, useTheme, Theme } from "components/Mui";
import Copy, { CopyRef } from "components/Copy";
import { ReactComponent as ExternalLink } from "assets/icons/external-link.svg";
import { Connector } from "constants/wallet";
import { useConnectorType } from "store/auth/hooks";
import { mockALinkAndOpen } from "@icpswap/utils";

const ConnectorIcon: { [key: string]: string } = {
  [Connector.IC]: "/images/connect/InternetIdentity.svg",
  [Connector.ME]: "/images/connect/AstroX.svg",
  [Connector.ICPSwap]: "/images/connect/icpswap.svg",
  [Connector.INFINITY]: "/images/connect/Infinity.svg",
  [Connector.Metamask]: "/images/connect/metamask.svg",
  [Connector.NFID]: "/images/connect/NFID.svg",
  [Connector.PLUG]: "/images/connect/Plug.svg",
  [Connector.STOIC]: "/images/connect/stoic.svg",
};

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

  const connector = useConnectorType();

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
      <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px", margin: "0 0 8px 0" }}>
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

        {connector ? <img style={{ width: "20px", height: "20px" }} src={ConnectorIcon[connector]} alt="" /> : null}
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
