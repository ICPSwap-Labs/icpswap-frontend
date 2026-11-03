import { IdentityKitAuthType, NFIDW } from "@nfid/identitykit";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DisableIframe } from "components/DisableIframe";
import { GlobalContextProvider } from "components/Global";
import { StyledEngineProvider, ThemeProvider } from "components/Mui";
import { SnackbarProvider } from "components/notistack";
import { wagmiConfig } from "constants/wagmi";
import i18n from "i18n/index";
import { DesignVersionProvider, useDesignVersion } from "hooks/useDesignVersion";
import { useLayoutEffect, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { useAppSelector } from "store/hooks";
import TransactionsUpdater from "store/transactions/updater";
import { WagmiProvider } from "wagmi";
import { App } from "./App";
import { MAX_IDENTITY_KIT_TIME_LIVE } from "./constants";
import { theme } from "./theme";

import "@nfid/identitykit/react/styles.css";

export function AppWithProvider() {
  return (
    <DesignVersionProvider>
      <ThemedAppWithProvider />
    </DesignVersionProvider>
  );
}

function ThemedAppWithProvider() {
  const customization = useAppSelector((state) => state.customization);
  const { designVersion, isClassicDesign } = useDesignVersion();
  const [queryClient] = useState(() => new QueryClient());
  const designCustomization = useMemo(() => ({ ...customization, designVersion }), [customization, designVersion]);
  const appTheme = useMemo(() => theme(designCustomization), [designCustomization]);

  // Put the theme on html so portaled wallets, dialogs, and menus inherit it too.
  useLayoutEffect(() => {
    const modeSuffix = customization.mode === "dark" ? "" : "-light";
    document.documentElement.dataset.theme = `${isClassicDesign ? "icswap-classic" : "icswap"}${modeSuffix}`;
    document.documentElement.dataset.design = designVersion;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", appTheme.palette.background.default);
    document
      .querySelector('link[rel="icon"]')
      ?.setAttribute("href", isClassicDesign ? "/favicon.png" : "/images/design-modern/favicon-copper.svg");
    document
      .querySelector('link[rel="apple-touch-icon"]')
      ?.setAttribute("href", isClassicDesign ? "/favicon.png" : "/images/design-modern/favicon.png");
  }, [customization.mode, designVersion, isClassicDesign, appTheme]);

  return (
    <I18nextProvider i18n={i18n}>
      <IdentityKitProvider
        authType={IdentityKitAuthType.DELEGATION}
        signers={[NFIDW]}
        signerClientOptions={{
          maxTimeToLive: MAX_IDENTITY_KIT_TIME_LIVE,
          // SwapFactory
          targets: ["4mmnk-kiaaa-aaaag-qbllq-cai"],
        }}
      >
        <DisableIframe>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <StyledEngineProvider injectFirst>
                <TransactionsUpdater />
                <ThemeProvider theme={appTheme}>
                  <SnackbarProvider maxSnack={100}>
                    <GlobalContextProvider>
                      <App />
                    </GlobalContextProvider>
                  </SnackbarProvider>
                </ThemeProvider>
              </StyledEngineProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </DisableIframe>
      </IdentityKitProvider>
    </I18nextProvider>
  );
}
