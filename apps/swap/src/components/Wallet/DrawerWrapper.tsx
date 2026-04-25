import { Flex } from "@icpswap/ui";
import { Box, type BoxProps, Typography } from "components/Mui";
import { useWalletStore, type WalletManagerPage } from "components/Wallet/store";
import { WALLET_DRAWER_WIDTH } from "constants/wallet";
import { type ReactNode, useCallback } from "react";

interface DrawerWrapperProps {
  padding?: string;
  title?: string;
  children: ReactNode;
  noHeader?: boolean;
  showRightIcon?: boolean;
  onPrev?: () => void;
  onRightIconClick?: () => void;
  rightIcon?: ReactNode;
  footer?: ReactNode;
  prevPage?: WalletManagerPage;
  wrapperSX?: BoxProps["sx"];
}

export function DrawerWrapper({
  padding,
  noHeader = false,
  title,
  showRightIcon,
  children,
  onPrev,
  onRightIconClick,
  rightIcon,
  footer,
  prevPage,
  wrapperSX,
}: DrawerWrapperProps) {
  const { setPages } = useWalletStore();

  const handlePrev = useCallback(() => {
    if (prevPage) {
      setPages(prevPage);
      return;
    }

    if (onPrev) onPrev();
  }, [prevPage, setPages, onPrev]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: `${WALLET_DRAWER_WIDTH}px`,
        padding: padding ?? "12px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
        ...wrapperSX,
      }}
    >
      {noHeader === false ? (
        <Flex sx={{ height: "36px" }} justify="space-between">
          <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handlePrev}>
            <img src="/images/wallet/arrow.svg" alt="" />
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              color: "text.primary",
              flex: 1,
              textAlign: "center",
              maxWidth: "219px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{ width: "24px", height: "24px", cursor: "pointer" }}
            onClick={onRightIconClick}
            style={{ visibility: showRightIcon ? "visible" : "hidden" }}
          >
            {rightIcon ?? <img src="/images/wallet/close.svg" alt="" />}
          </Box>
        </Flex>
      ) : null}

      <Box sx={{ flex: 1 }}>{children}</Box>

      {footer}
    </Box>
  );
}
