import type { Override } from "@icpswap/types";
import Button, { type ButtonConnectorProps } from "components/authentication/ButtonConnector";
import { useTranslation } from "react-i18next";

export interface AddLiquidityButtonProps {
  error: string | undefined | null;
}

export function AddLiquidityButton(props: Override<ButtonConnectorProps, AddLiquidityButtonProps>) {
  const { t } = useTranslation();

  const { error } = props;

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        borderRadius: "8px",
      }}
      {...props}
    >
      {error ?? t("common.confirm")}
    </Button>
  );
}
