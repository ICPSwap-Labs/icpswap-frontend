import { Box, useTheme, Typography } from "components/Mui";
import { useState, useCallback, useRef } from "react";
import { Flex, MenuWrapper, Image, ALink, MenuItem } from "@icpswap/ui";
import { getTransactionExplorerLink, TransactionLink } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { useTranslation } from "react-i18next";

const TRANSACTIONS: { label: string; img: string; value: TransactionLink }[] = [
  { label: `IC Explorer`, img: "/images/explorer/ic-explorer.svg", value: "ic-explorer" },
  { label: `Internet Computer Dashboard`, img: "/images/explorer/ii.svg", value: "dashboard" },
  { label: `NFTGeek`, img: "/images/explorer/NFTGeek.svg", value: "NFTGeek" },
  { label: `IC.House`, img: "/images/explorer/ic-house.svg", value: "ic-house" },
];

interface TransactionItemProps {
  tokenId: string;
  isBridgeToken?: boolean;
}

export function TransactionItem({ tokenId, isBridgeToken }: TransactionItemProps) {
  const theme = useTheme();
  const ref = useRef(null);
  const principal = useAccountPrincipalString();
  const root_canister_id = useSNSTokenRootId(tokenId);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleMouseLeave = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Box ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MenuItem
        value="Transactions"
        label={t("common.transactions")}
        background={theme.palette.background.level3}
        activeBackground={theme.palette.background.level1}
        height="36px"
        padding="0 16px"
        rightIcon={<img width="20px" height="20px" src="/images/wallet/transactions.svg" alt="" />}
      />

      <Box ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <MenuWrapper
          open={open}
          onClickAway={() => setOpen(false)}
          anchor={ref?.current}
          placement="right-start"
          border="none"
          padding="0px"
        >
          <Box sx={{ padding: "0 12px", background: theme.palette.background.level1, borderRadius: "12px" }}>
            {TRANSACTIONS.map((transaction) => (
              <ALink
                key={transaction.label}
                link={
                  principal
                    ? getTransactionExplorerLink({
                        principal,
                        tokenId,
                        type: transaction.value,
                        isBridgeToken,
                        snsRootId: root_canister_id,
                      })
                    : undefined
                }
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
    </Box>
  );
}
