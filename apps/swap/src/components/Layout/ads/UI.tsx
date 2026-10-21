import { Flex, Link } from "@icpswap/ui";
import { Box, Typography } from "components/Mui";
import { X } from "react-feather";

export interface AdsUIProps {
  onClose?: () => void;
  content: string;
  link?: string | undefined;
  button_name: string | undefined;
}

export function AdsUI({ content, link, button_name, onClose }: AdsUIProps) {
  return (
    <Flex
      className="border-b border-primary/15"
      sx={{
        position: "relative",
        width: "100%",
        height: "48px",
        padding: "0 36px",
        background:
          "linear-gradient(100deg, color-mix(in oklab, var(--color-secondary) 16%, var(--color-base-100)), color-mix(in oklab, var(--color-primary) 20%, var(--color-base-100)))",
      }}
      align="center"
      justify="center"
      gap="0 12px"
    >
      <Typography
        sx={{
          color: "var(--color-base-content)",
          cursor: "pointer",
          fontSize: "12px",
          lineHeight: 1.4,
          "@media(max-width: 640px)": { fontSize: "12px" },
        }}
      >
        {content}
      </Typography>

      {button_name ? (
        <Link link={link}>
          <Box
            className="btn btn-primary btn-xs"
            sx={{
              borderRadius: "6px",
              padding: "5px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <Typography sx={{ color: "var(--color-primary-content)", fontSize: "11px", fontWeight: 600 }}>
              {button_name}
            </Typography>
          </Box>
        </Link>
      ) : null}

      {onClose ? (
        <Box
          sx={{ cursor: "pointer", width: "18px", height: "18px", position: "absolute", right: "8px", top: "8px" }}
          onClick={onClose}
        >
          <X color="var(--color-base-content)" size={18} />
        </Box>
      ) : null}
    </Flex>
  );
}
