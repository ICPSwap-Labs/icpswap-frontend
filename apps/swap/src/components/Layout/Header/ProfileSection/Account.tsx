import { explorerLink, principalToAccount } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { useAccountPrincipalString } from "store/auth/hooks";
import { AddressSection } from "./Address";

export function AccountSection() {
  const principal = useAccountPrincipalString();

  return (
    <AddressSection
      address={principal ? principalToAccount(principal) : ""}
      label={t`Account ID`}
      link={principal ? explorerLink(principal) : ""}
    />
  );
}
