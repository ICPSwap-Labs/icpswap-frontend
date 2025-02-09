import { useState, useCallback, useRef } from "react";
import { Typography, Box, useTheme } from "components/Mui";
import { Flex, MenuWrapper, Image, ALink } from "@icpswap/ui";
import { getTransactionExplorerLink, TransactionLink } from "@icpswap/hooks";

import { Button } from "./Button";

const TRANSACTIONS: { label: string; img: string; value: TransactionLink }[] = [
  { label: `IC Explorer`, img: "/images/explorer/ic-explorer.svg", value: "ic-explorer" },
  { label: `Internet Computer Dashboard`, img: "/images/explorer/ii.svg", value: "dashboard" },
  { label: `NFTGeek`, img: "/images/explorer/NFTGeek.svg", value: "NFTGeek" },
  { label: `IC.House`, img: "/images/explorer/ic-house.svg", value: "ic-house" },
];

export interface TransactionButtonProps {
  principal: string | undefined;
  tokenId: string;
  snsRootId?: string;
  isBridgeToken?: boolean;
}

export function TransactionButton({ tokenId, principal, snsRootId, isBridgeToken }: TransactionButtonProps) {
  const theme = useTheme();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleMouseLeave = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return principal ? (
    <Box ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Button label="Transactions" />

      <MenuWrapper
        open={open}
        onClickAway={() => setOpen(false)}
        anchor={ref?.current}
        placement="top-start"
        border="none"
        padding="0px"
      >
        <Box sx={{ padding: "0 12px", background: theme.palette.background.level1, borderRadius: "12px" }}>
          {TRANSACTIONS.map((transaction) => (
            <ALink
              key={transaction.label}
              link={getTransactionExplorerLink({
                principal,
                tokenId,
                type: transaction.value,
                isBridgeToken,
                snsRootId,
              })}
              text={false}
            >
              <Flex
                gap="0 8px"
                sx={{
                  height: "44px",
                  cursor: "pointer",
                }}
              >
                <Image src={transaction.img} sx={{ width: "20px", height: "20px" }} />
                <Typography color="text.primary" fontSize="12px">
                  {transaction.label}
                </Typography>
              </Flex>
            </ALink>
          ))}
        </Box>
      </MenuWrapper>
    </Box>
  ) : null;
}
