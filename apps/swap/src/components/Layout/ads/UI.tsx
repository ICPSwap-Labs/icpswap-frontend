import { Flex, Link } from "@icpswap/ui";
import { Box, Typography } from "components/Mui";
import { X } from "react-feather";
import { useDesignVersion } from "hooks/useDesignVersion";

export interface AdsUIProps {
  onClose?: () => void;
  content: string;
  link?: string | undefined;
  button_name: string | undefined;
}

export function AdsUI({ content, link, button_name, onClose }: AdsUIProps) {
  const { isClassicDesign } = useDesignVersion();
  return (
    <Flex
      className={isClassicDesign ? undefined : "border-b border-primary/15"}
      sx={{
        position: "relative",
        width: "100%",
        height: "48px",
        padding: "0 36px",
        background: isClassicDesign
          ? "linear-gradient(90deg, rgba(71, 96, 255, 0.13) 0%, #533884 100%)"
          : "color-mix(in oklab, var(--color-primary) 10%, var(--color-base-100))",
      }}
      align="center"
      justify="center"
      gap="0 12px"
    >
      <Typography
        sx={{
          color: isClassicDesign ? "#ffffff" : "var(--color-base-content)",
          cursor: "pointer",
          fontSize: isClassicDesign ? "14px" : "12px",
          lineHeight: 1.4,
          "@media(max-width: 640px)": { fontSize: "12px" },
        }}
      >
        {content}
      </Typography>

      {button_name ? (
        <Link link={link}>
          <Box
            className={isClassicDesign ? undefined : "btn btn-primary btn-xs"}
            sx={{
              borderRadius: isClassicDesign ? "8px" : "6px",
              padding: isClassicDesign ? "6px 12px" : "5px 10px",
              ...(isClassicDesign ? { background: "#F7B231" } : {}),
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              sx={{
                color: isClassicDesign ? "#111936" : "var(--color-primary-content)",
                fontSize: isClassicDesign ? "14px" : "11px",
                fontWeight: isClassicDesign ? 400 : 600,
              }}
            >
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
          <X color={isClassicDesign ? "#ffffff" : "var(--color-base-content)"} size={18} />
        </Box>
      ) : null}
    </Flex>
  );
}
