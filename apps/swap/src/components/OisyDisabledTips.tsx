import { TextButton } from "components/index";
import { Typography } from "components/Mui";

export type OisyDisabledPage = "ck-bridge" | "farm" | "stake";

export interface OisyDisabledTipsProps {
  page: OisyDisabledPage;
}

export function OisyDisabledTips({ page }: OisyDisabledTipsProps) {
  return (
    <Typography component="span">
      {page === "ck-bridge" ? (
        <>
          The Oisy wallet requires the targeted canister to support ICRC21 for proper interaction. Until the ck-Bridge
          canisters implements ICRC21, please use Internet Identity (II) or another ICP wallet. Or try the chain-fusion
          option on the <TextButton link="https://oisy.com">Oisy wallet page</TextButton>.
        </>
      ) : page === "farm" || page === "stake" ? (
        <>
          The Oisy wallet needs the targeted canister to support ICRC21. We'll add ICRC21 implementation for all Farm
          and Staking Pools in the next update. Until then, use Internet Identity (II) or another ICP wallet.
        </>
      ) : null}
    </Typography>
  );
}
