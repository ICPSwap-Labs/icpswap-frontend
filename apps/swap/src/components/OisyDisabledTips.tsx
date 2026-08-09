import { TextButton } from "components/index";
import { Typography } from "components/Mui";

export type OisyDisabledPage = "ck-bridge" | "nns" | "farm" | "stake";

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
          The Oisy wallet requires the target canister to support ICRC21 in order to interact properly. Please use
          Internet Identity (II) or another ICP wallet.
        </>
      ) : page === "nns" ? (
        <>
          The Oisy wallet requires the target canister to support ICRC21 in order to interact properly. Please use
          Internet Identity (II) or another ICP wallet. Alternatively, you can access it through the NNS frontend:
          <TextButton link="https://oisy.com">https://nns.ic0.app</TextButton>.
        </>
      ) : null}
    </Typography>
  );
}
