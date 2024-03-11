import Button, { ButtonConnectorProps } from "components/authentication/ButtonConnector";
import { Override } from "@icpswap/types";
import { t } from "@lingui/macro";

export interface AddLiquidityButtonProps {
  error: string | undefined | null;
}

export default function AddLiquidityButton(props: Override<ButtonConnectorProps, AddLiquidityButtonProps>) {
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
      {error ?? t`Confirm`}
    </Button>
  );
}
