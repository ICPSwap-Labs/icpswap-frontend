import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useState, useMemo, useCallback } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import QRCode from "components/qrcode";
import { useAccount, useAccountPrincipalString } from "store/auth/hooks";
import Copy from "components/Copy/index";
import { ICP } from "@icpswap/tokens";
import { useWalletTokenContext } from "components/Wallet/token/context";

enum TAB {
  Principal = "Principal",
  Account = "Account",
}

const Tabs = [
  { label: "Principal ID", value: TAB.Principal },
  { label: "Account ID", value: TAB.Account },
];

export function TokenReceive() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TAB>(TAB.Principal);
  const { setPages } = useWalletContext();
  const { tokenReceiveId } = useWalletTokenContext();
  const principal = useAccountPrincipalString();
  const account = useAccount();

  const address = useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(account)) return undefined;

    if (nonUndefinedOrNull(tokenReceiveId)) {
      return tokenReceiveId === ICP.address ? account : principal;
    }

    return activeTab === TAB.Principal ? principal : account;
  }, [principal, account, activeTab, tokenReceiveId]);

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  return (
    <DrawerWrapper padding="12px" title="Receive" onPrev={handlePrev} showRightIcon onRightIconClick={handlePrev}>
      <Box
        sx={{
          margin: "40px 0 0 0",
          visibility: tokenReceiveId ? "hidden" : "visible",
        }}
      >
        <Flex gap="0 24px" justify="center">
          <Box
            sx={{
              display: "flex",
              width: "334px",
              padding: "4px",
              borderRadius: "16px",
              background: theme.palette.background.level1,
            }}
          >
            {Tabs.map((tab) => {
              return (
                <Box
                  key={tab.value}
                  sx={{
                    width: "50%",
                    height: "36px",
                    borderRadius: "12px",
                    background:
                      activeTab === tab.value ? theme.palette.background.level4 : theme.palette.background.level1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <Typography color={activeTab === tab.value ? "text.primary" : "text.secondary"}>
                    {tab.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Flex>
      </Box>

      <Flex fullWidth justify="center" sx={{ margin: "40px 0 0 0" }}>
        <Box sx={{ padding: "16px", background: "#ffffff", borderRadius: "16px" }}>
          {address ? <QRCode value={address} size={200} /> : null}
        </Box>
      </Flex>

      <Box sx={{ margin: "32px 0 0 0", border: "1px solid #29314F", borderRadius: "12px", padding: "16px 12px" }}>
        <Flex fullWidth justify="center" gap="0 20px">
          <Typography color="text.primary" sx={{ lineHeight: "20px", wordBreak: "break-all" }}>
            {address}
          </Typography>
          <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }}>
            {address ? (
              <Copy content={address}>
                <img src="/images/wallet/copy.svg" alt="" />
              </Copy>
            ) : null}
          </Box>
        </Flex>
      </Box>
    </DrawerWrapper>
  );
}
