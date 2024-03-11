import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { ToggleButton } from "components/SwitchToggle";
import { Wrapper } from "components/index";
import useParsedQueryString from "hooks/useParsedQueryString";
import { Breadcrumbs } from "components/index";
import MintBTC from "./components/ckBTC/Mint";
import DissolveBTC from "./components/ckBTC/Dissolve";
import { useBTCCurrentBlock } from "hooks/ck-btc/useBTCCalls";

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

  const handleChange = (button: ToggleButton) => {
    setActive(button.key);
    history.push(`/wallet/ckBTC?type=${button.key}`);
  };

  const block = useBTCCurrentBlock();

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
