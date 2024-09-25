import { explorerLink } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { useAccountPrincipalString } from "store/auth/hooks";
import { AddressSection } from "./Address";

export default function ProfileSection() {
  const principal = useAccountPrincipalString();

  return (
    <AddressSection
      address={principal}
      label={t`Principal ID`}
      link={principal ? explorerLink(principal) : undefined}
    />
  );
}
