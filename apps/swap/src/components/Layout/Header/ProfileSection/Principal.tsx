import { explorerLink } from "@icpswap/utils";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useTranslation } from "react-i18next";

import { AddressSection } from "./Address";

export default function ProfileSection() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();

  return (
    <AddressSection
      address={principal}
      label={t("common.principal.id")}
      link={principal ? explorerLink(principal) : undefined}
    />
  );
}
