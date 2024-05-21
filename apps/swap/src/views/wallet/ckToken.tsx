import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Wrapper, Breadcrumbs, type Tab } from "components/index";
import { useParsedQueryString, useChainKeyMinterInfo } from "@icpswap/hooks";
import { useFetchBlockNumber } from "hooks/web3/useBlockNumber";
import { useERC20TokenByChainKeyId } from "hooks/token/index";
import { useToken } from "hooks/useCurrency";
import { MINTER_CANISTER_ID } from "constants/ckERC20";

import MintCkERC20 from "./components/ckERC20/Mint";
import DissolveCkERC20 from "./components/ckERC20/Dissolve";

export const Buttons = [
  {
    key: "mint",
    value: t`Mint`,
  },
  {
    key: "dissolve",
    value: t`Dissolve`,
  },
];

export default function ckToken() {
  const history = useHistory();

  const [active, setActive] = useState("");

  const { type, tokenId } = useParsedQueryString() as { type: string; tokenId: string };

  const [, token] = useToken(tokenId);
  const erc20Token = useERC20TokenByChainKeyId(tokenId);

  useEffect(() => {
    if (type) setActive(type);
  }, [type]);

  const handleChange = (button: Tab) => {
    setActive(button.key);
    history.push(`/wallet/ckToken?type=${button.key}&tokenId=${tokenId}`);
  };

  useFetchBlockNumber();
  const { result: chainKeyMinterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink="/wallet"
        prevLabel={t`Wallet`}
        currentLabel={type === "dissolve" ? t`Dissolve ck${erc20Token?.symbol}` : t`Mint ck${erc20Token?.symbol}`}
      />

      <Box sx={{ height: "20px" }} />

      {type === "dissolve" ? (
        <DissolveCkERC20
          handleChange={handleChange}
          buttons={Buttons}
          active={active}
          token={token}
          erc20Token={erc20Token}
          minterInfo={chainKeyMinterInfo}
          minterAddress={MINTER_CANISTER_ID}
        />
      ) : (
        <MintCkERC20
          handleChange={handleChange}
          buttons={Buttons}
          active={active}
          token={token}
          erc20Token={erc20Token}
          minterInfo={chainKeyMinterInfo}
        />
      )}
    </Wrapper>
  );
}
