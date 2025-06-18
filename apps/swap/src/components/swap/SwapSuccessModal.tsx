import { useMemo } from "react";
import { Box, Button, Typography } from "components/Mui";
import { TokenImage } from "components/index";
import { Flex, Link, Modal } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "react-feather";
import { useSwapFinalMetadataManager } from "store/hooks";
import { formatAmount, isUndefinedOrNull, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { APP_URL } from "constants/index";

export interface SwapSuccessModalProps {
  open: boolean;
  onClose?: () => void;
}

export function SwapSuccessModal({ onClose, open }: SwapSuccessModalProps) {
  const { t } = useTranslation();
  const { swapFinalMetadata } = useSwapFinalMetadataManager();

  const { inputToken, outputToken, inputAmount, outputAmount } = useMemo(() => {
    if (!swapFinalMetadata) return {};

    const { inputToken, inputAmount, outputAmount, outputToken } = swapFinalMetadata;

    return {
      inputToken,
      outputToken,
      inputAmount,
      outputAmount,
    };
  }, [swapFinalMetadata]);

  const xShareUrl = useMemo(() => {
    if (
      isUndefinedOrNull(inputToken) ||
      isUndefinedOrNull(outputToken) ||
      isUndefinedOrNull(inputAmount) ||
      isUndefinedOrNull(outputAmount)
    )
      return undefined;

    return `https://x.com/intent/tweet?url=${APP_URL}/swap&text=Just swapped ${formatAmount(
      parseTokenAmount(inputAmount.toString(), inputToken.decimals).toString(),
    )} $${inputToken.symbol} for ${formatAmount(
      parseTokenAmount(outputAmount.toString(), outputToken.decimals).toString(),
    )} $${outputToken.symbol} on @ICPSwap — smooth as ever, and zero gas! ⚡️🚀 Swap yours now 👉`;
  }, [inputToken, outputToken, inputAmount, outputAmount]);

  return (
    <Modal open={open} title={t("swap.details")} onClose={onClose} dialogWidth="450px">
      <Typography fontSize="20px" fontWeight={500} color="text.primary" textAlign="center">
        {t("swap.successful")}
      </Typography>

      <Flex sx={{ margin: "24px 0 0 0" }} justify="center" gap="0 4px">
        <Flex gap="0 4px">
          <TokenImage size="20px" tokenId={inputToken?.address} logo={inputToken?.logo} />
          <Typography fontSize="16px" color="text.primary">
            {nonUndefinedOrNull(inputAmount) && nonUndefinedOrNull(inputToken)
              ? formatAmount(parseTokenAmount(inputAmount.toString(), inputToken.decimals).toString())
              : "--"}{" "}
            {inputToken?.symbol}
          </Typography>
        </Flex>

        <ArrowRight color="#ffffff" size={16} />

        <Flex gap="0 4px">
          <TokenImage size="20px" tokenId={outputToken?.address} logo={outputToken?.logo} />
          <Typography fontSize="16px" color="text.primary">
            {nonUndefinedOrNull(outputAmount) && nonUndefinedOrNull(outputToken)
              ? formatAmount(parseTokenAmount(outputAmount.toString(), outputToken.decimals).toString())
              : "--"}{" "}
            {outputToken?.symbol}
          </Typography>
        </Flex>
      </Flex>

      <Flex justify="center" sx={{ margin: "30px 0 0 0" }}>
        <img src="/images/swap/swap-successful.svg" alt="" />
      </Flex>

      <Box sx={{ margin: "32px 0 0 0" }}>
        <Link link={xShareUrl}>
          <Button fullWidth size="large" variant="outlined" className="secondary">
            <Flex gap="0 4px">
              {t("common.share.on")}
              <img src="/images/x.svg" alt="" />
            </Flex>
          </Button>
        </Link>
      </Box>
    </Modal>
  );
}
