import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Wrapper, Breadcrumbs, type Tab } from "components/index";
import { useParsedQueryString } from "@icpswap/hooks";
import { useBtcCurrentBlock } from "hooks/ck-bridge/index";
import MintBTC from "./components/ckBTC/Mint";
import DissolveBTC from "./components/ckBTC/Dissolve";

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

export default function ckBTC() {
  const history = useHistory();

  const [active, setActive] = useState("");

  const { type } = useParsedQueryString() as { type: string };

  useEffect(() => {
    if (type) setActive(type);
  }, [type]);

  const handleChange = (button: Tab) => {
    setActive(button.key);
    history.push(`/wallet/ckBTC?type=${button.key}`);
  };

  const block = useBtcCurrentBlock();

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink="/wallet"
        prevLabel={t`Wallet`}
        currentLabel={type === "dissolve" ? t`Dissolve ckBTC` : t`Mint ckBTC`}
      />

      <Box sx={{ height: "20px" }} />

      {type === "dissolve" ? (
        <DissolveBTC handleChange={handleChange} buttons={Buttons} active={active} />
      ) : (
        <MintBTC handleChange={handleChange} buttons={Buttons} active={active} block={block} />
      )}
    </Wrapper>
  );
}
