import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Wrapper, Breadcrumbs, type Tab } from "components/index";
import { useParsedQueryString } from "@icpswap/hooks";
import { useFetchBlockNumber } from "hooks/web3/useBlockNumber";
import MintETH from "./components/ckETH/Mint";
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

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink="/wallet"
        prevLabel={t`Wallet`}
        currentLabel={type === "dissolve" ? t`Dissolve ckETH` : t`Mint ckETH`}
      />

      <Box sx={{ height: "20px" }} />

      {type === "dissolve" ? (
        <DissolveETH handleChange={handleChange} buttons={Buttons} active={active} />
      ) : (
        <MintETH handleChange={handleChange} buttons={Buttons} active={active} />
      )}
    </Wrapper>
  );
}
