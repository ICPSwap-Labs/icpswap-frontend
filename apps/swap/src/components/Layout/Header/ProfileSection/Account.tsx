import { explorerLink, principalToAccount } from "@icpswap/utils";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";

import { AddressSection } from "./Address";

export function AccountSection() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();

  return (
    <AddressSection
      address={principal ? principalToAccount(principal) : ""}
      label={t`Account ID`}
      link={principal ? explorerLink(principal) : ""}
    />
  );
}
