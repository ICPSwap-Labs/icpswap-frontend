import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, ButtonProps, Typography } from "components/Mui";
import { ICP, ICS } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { Link } from "@icpswap/ui";
import { urlStringFormat } from "@icpswap/utils";

interface BuyTokenButtonProps {
  token: Token | Null;
  variant?: ButtonProps["variant"];
}

export function BuyTokenButton({ token, variant = "outlined" }: BuyTokenButtonProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const link = useMemo(() => {
    if (!token) return undefined;

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

    return `/swap?input=${input}&output=${output}&path=${urlStringFormat(location.pathname)}`;
  }, [token, location]);

  return (
    <Link to={link}>
      <Button className="secondary" variant={variant} fullWidth sx={{ height: "44px" }}>
        <Typography color="text.primary" className="text-overflow-ellipsis" sx={{ maxWidth: "132px" }}>
          {t("common.buy.token", { symbol: token?.symbol })}
        </Typography>
      </Button>
    </Link>
  );
}
