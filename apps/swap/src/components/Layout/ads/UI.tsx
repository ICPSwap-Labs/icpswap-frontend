import { Box, Typography } from "components/Mui";
import { Flex, Link } from "@icpswap/ui";
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
      sx={{
        position: "relative",
        width: "100%",
        height: "48px",
        background: "linear-gradient(90deg, rgba(71, 96, 255, 0.13) 0%, #533884 100%)",
      }}
      align="center"
      justify="center"
      gap="0 12px"
    >
      <Typography
        sx={{
          color: "#ffffff",
          cursor: "pointer",
          "@media(max-width: 640px)": { fontSize: "12px" },
        }}
      >
        {content}
      </Typography>

      {button_name ? (
        <Link link={link}>
          <Box
            sx={{
              borderRadius: "8px",
              background: "#F7B231",
              padding: "6px 12px",
            }}
          >
            <Typography color="#111936">{button_name}</Typography>
          </Box>
        </Link>
      ) : null}

      {onClose ? (
        <Box
          sx={{ cursor: "pointer", width: "18px", height: "18px", position: "absolute", right: "8px", top: "8px" }}
          onClick={onClose}
        >
          <X color="#ffffff" size={18} />
        </Box>
      ) : null}
    </Flex>
  );
}
