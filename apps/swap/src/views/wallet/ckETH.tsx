import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Wrapper, Breadcrumbs, type Tab } from "components/index";
import { useParsedQueryString, useChainKeyMinterInfo } from "@icpswap/hooks";
import { useFetchBlockNumber } from "hooks/web3/useBlockNumber";
import { ckETH_MINTER_ID } from "constants/ckETH";

import MintCkETH from "./components/ckETH/Mint";
import DissolveETH from "./components/ckETH/Dissolve";

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

export default function ckETH() {
  const history = useHistory();

  const [active, setActive] = useState("");

  const { type } = useParsedQueryString() as { type: string };

  useEffect(() => {
    if (type) setActive(type);
  }, [type]);

  const handleChange = (button: Tab) => {
    setActive(button.key);
    history.push(`/wallet/ckETH?type=${button.key}`);
  };

  useFetchBlockNumber();

  const { result: minterInfo } = useChainKeyMinterInfo(ckETH_MINTER_ID);

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink="/wallet"
        prevLabel={t`Wallet`}
        currentLabel={type === "dissolve" ? t`Dissolve ckETH` : t`Mint ckETH`}
      />

      <Box sx={{ height: "20px" }} />

      {type === "dissolve" ? (
        <DissolveETH handleChange={handleChange} buttons={Buttons} active={active} minterInfo={minterInfo} />
      ) : (
        <MintCkETH handleChange={handleChange} buttons={Buttons} active={active} minterInfo={minterInfo} />
      )}
    </Wrapper>
  );
}
