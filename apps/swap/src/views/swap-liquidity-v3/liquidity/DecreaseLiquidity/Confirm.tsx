import { Box, Typography, Button } from "components/Mui";
import { BURN_FIELD } from "constants/swap";
import { Token } from "@icpswap/swap-sdk";
import { toFormat } from "utils/index";
import { Flex, TokenImage, Modal } from "components/index";
import { useTranslation } from "react-i18next";

interface DecreaseLiquidityConfirmProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  formattedAmounts: { [key in BURN_FIELD]?: string };
}

export function DecreaseLiquidityConfirm({
  open,
  onCancel,
  onConfirm,
  formattedAmounts,
  currencyA,
  currencyB,
}: DecreaseLiquidityConfirmProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onCancel} title={t("swap.remove.liquidity")}>
      <Box>
        <Flex fullWidth justify="space-between">
          <Flex gap="0 8px">
            <TokenImage tokenId={currencyA?.address} logo={currencyA?.logo} size="24px" />
            <Typography>{currencyA?.symbol}</Typography>
          </Flex>
          <Typography align="right">{toFormat(formattedAmounts[BURN_FIELD.CURRENCY_A] ?? 0)}</Typography>
        </Flex>

        <Flex fullWidth sx={{ margin: "16px 0 0 0" }} justify="space-between">
          <Flex gap="0 8px">
            <TokenImage tokenId={currencyB?.address} logo={currencyB?.logo} size="24px" />
            <Typography>{currencyB?.symbol}</Typography>
          </Flex>
          <Typography align="right">{toFormat(formattedAmounts[BURN_FIELD.CURRENCY_B] ?? 0)}</Typography>
        </Flex>
      </Box>

      <Button variant="contained" size="large" fullWidth sx={{ marginTop: "40px" }} onClick={onConfirm}>
        {t("common.remove")}
      </Button>
    </Modal>
  );
}
