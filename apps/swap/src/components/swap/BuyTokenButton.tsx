import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, ButtonProps } from "components/Mui";
import { ICP, ICS } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

interface BuyTokenButtonProps {
  token: Token | Null;
  variant?: ButtonProps["variant"];
}

export function BuyTokenButton({ token, variant = "outlined" }: BuyTokenButtonProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const handleByToken = useCallback(() => {
    if (!token) return;

    const address = token.address;

    let input: string = address;
    let output: string = address;

    if (address === ICP.address) {
      input = ICS.address;
      output = ICP.address;
    } else {
      input = ICP.address;
      output = address;
    }

    history.push(`/swap?input=${input}&output=${output}&path=${window.btoa(location.pathname)}`);
  }, [history, location]);

  return (
    <Button className="secondary" variant={variant} fullWidth onClick={handleByToken} sx={{ height: "44px" }}>
      {t("common.buy.token", { symbol: token?.symbol })}
    </Button>
  );
}
