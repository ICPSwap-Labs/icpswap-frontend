import Button, { ButtonConnectorProps } from "components/authentication/ButtonConnector";
import { Override } from "@icpswap/types";
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
