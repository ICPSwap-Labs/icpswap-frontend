import { explorerLink } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { useAccount } from "store/global/hooks";
import { AddressSection } from "./Address";

export function AccountSection() {
  const account = useAccount();

  return <AddressSection address={account} label={t`Account ID`} labelColor="#E3F2FD" link={explorerLink(account)} />;
}
