import { useCallback, useEffect, useMemo, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, MainCard } from "@icpswap/ui";
import { BigNumber, formatTokenAmount, isNullArgs, nonNullArgs } from "@icpswap/utils";
import { Price, tickToPrice, Token, TICK_SPACINGS, priceToClosestTick, CurrencyAmount } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { TokenImage } from "components/index";
import { PriceMutator } from "components/swap/limit-order/PriceMutator";
import { SwapInput } from "components/swap/index";
import { priceToClosestUseableTick, inputValueFormat } from "utils/swap/limit-order";
import { useTranslation } from "react-i18next";

import { LimitContext } from "./context";

export interface LimitPriceRef {
  setDefaultPrice: () => void;
  resetInverted: () => void;
}

export interface SwapLimitPriceProps {
  ui?: "pro" | "normal";
  orderPrice: string | Null;
  onInputOrderPrice: (value: string) => void;
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
  minUseableTick: number | Null;
  isInputTokenSorted: boolean | Null;
  atLimitedTick: boolean;
  available: boolean;
}

export const SwapLimitPrice = forwardRef(
  (
    {
      ui = "normal",
      inputToken,
      outputToken,
      onInputOrderPrice,
      currentPrice,
      orderPrice,
      minUseableTick,
      isInputTokenSorted,
      atLimitedTick,
      available,
    }: SwapLimitPriceProps,
    ref,
  ) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState<string | Null>(null);
    const [minPrice, setMinPrice] = useState<string | Null>(null);

    const { inverted, setInverted, selectedPool } = useContext(LimitContext);

    const minUseablePrice = useMemo(() => {
      if (nonNullArgs(inputToken) && nonNullArgs(outputToken) && nonNullArgs(minUseableTick)) {
        return tickToPrice(inputToken, outputToken, minUseableTick).toFixed(outputToken.decimals);
      }
    }, [inputToken, outputToken, minUseableTick]);

    const handleInputPrice = useCallback(
      (value: string, inverted: boolean) => {
        setInputValue(value);

        if (value === "") {
          onInputOrderPrice("");
          return;
        }

        if (new BigNumber(value).isEqualTo(0) || !value || !currentPrice) return;

        const orderPrice = inverted ? new BigNumber(1).dividedBy(value).toString() : value;

        onInputOrderPrice(orderPrice);
      },
      [currentPrice, onInputOrderPrice],
    );

    const handleInvert = useCallback(() => {
      setInverted(!inverted);

      if (nonNullArgs(inputValue) && inputValue !== "" && nonNullArgs(outputToken)) {
        handleInputPrice(new BigNumber(1).dividedBy(inputValue).toFixed(outputToken.decimals), !inverted);
      }
    }, [setInverted, outputToken, inputValue, inverted]);

    useEffect(() => {
      if (isNullArgs(orderPrice) || orderPrice === "") {
        setInputValue("");
      }
    }, [orderPrice]);

    const { inputTokenInverted, outputTokenInverted } = useMemo(() => {
      if (!inputToken || !outputToken) return {};

      return inverted
        ? {
            inputTokenInverted: outputToken,
            outputTokenInverted: inputToken,
          }
        : {
            inputTokenInverted: inputToken,
            outputTokenInverted: outputToken,
          };
    }, [inverted, inputToken, outputToken]);

    const __orderPrice = useMemo(() => {
      if (nonNullArgs(orderPrice) && nonNullArgs(inputToken) && nonNullArgs(outputToken)) {
        return new Price(
          inputToken,
          outputToken,
          formatTokenAmount(1, inputToken.decimals).toString(),
          formatTokenAmount(orderPrice, outputToken.decimals).toString(),
        );
      }
    }, [orderPrice, inputToken, outputToken]);

    const closestTick = useMemo(() => {
      if (nonNullArgs(__orderPrice)) {
        return priceToClosestTick(__orderPrice);
      }
    }, [__orderPrice]);

    const handleIncreasePrice = useCallback(() => {
      if (
        nonNullArgs(selectedPool) &&
        nonNullArgs(closestTick) &&
        nonNullArgs(inputToken) &&
        nonNullArgs(outputToken)
      ) {
        const newPriceTick =
          closestTick +
          (isInputTokenSorted
            ? inverted
              ? -TICK_SPACINGS[selectedPool.fee]
              : TICK_SPACINGS[selectedPool.fee]
            : inverted
            ? TICK_SPACINGS[selectedPool.fee]
            : -TICK_SPACINGS[selectedPool.fee]);
        const newPrice = tickToPrice(inputToken, outputToken, newPriceTick);

        handleInputPrice(
          inverted
            ? new BigNumber(1).dividedBy(newPrice.toFixed(outputToken.decimals)).toFixed(outputToken.decimals)
            : newPrice.toFixed(outputToken.decimals),
          inverted,
        );
      }
    }, [closestTick, selectedPool, inputToken, outputToken, handleInputPrice, inverted, isInputTokenSorted]);

    const handleDecreasePrice = useCallback(() => {
      if (
        nonNullArgs(closestTick) &&
        nonNullArgs(selectedPool) &&
        nonNullArgs(inputToken) &&
        nonNullArgs(outputToken)
      ) {
        const newPriceTick =
          closestTick +
          (isInputTokenSorted
            ? inverted
              ? TICK_SPACINGS[selectedPool.fee]
              : -TICK_SPACINGS[selectedPool.fee]
            : inverted
            ? -TICK_SPACINGS[selectedPool.fee]
            : +TICK_SPACINGS[selectedPool.fee]);

        const newPrice = tickToPrice(inputToken, outputToken, newPriceTick);

        handleInputPrice(
          inverted
            ? new BigNumber(1).dividedBy(newPrice.toFixed(outputToken.decimals)).toFixed(outputToken.decimals)
            : newPrice.toFixed(outputToken.decimals),
          inverted,
        );
      }
    }, [selectedPool, closestTick, inputToken, outputToken, handleInputPrice, inverted, isInputTokenSorted]);

    const handleMinMax = useCallback(() => {
      if (
        isNullArgs(selectedPool) ||
        isNullArgs(inputToken) ||
        isNullArgs(outputToken) ||
        isNullArgs(minUseableTick) ||
        isNullArgs(isInputTokenSorted) ||
        atLimitedTick === true
      )
        return;

      const minPrice = tickToPrice(inputToken, outputToken, minUseableTick);

      setMinPrice(minPrice.toFixed(outputToken.decimals));

      handleInputPrice(
        inverted
          ? new BigNumber(1).dividedBy(minPrice.toFixed(outputToken.decimals)).toString()
          : minPrice.toFixed(outputToken.decimals),
        inverted,
      );
    }, [inverted, inputToken, outputToken, selectedPool, minUseableTick, atLimitedTick]);

    const handlePriceChange = useCallback(
      (val: number) => {
        if (isNullArgs(currentPrice) || atLimitedTick === true) return;

        const invertedPrice = new BigNumber(1).dividedBy(currentPrice);
        const invertedNewPrice = inverted
          ? invertedPrice.minus(invertedPrice.multipliedBy(val)).toString()
          : new BigNumber(currentPrice).multipliedBy(val).plus(currentPrice).toString();

        handleInputPrice(invertedNewPrice, inverted);
      },
      [inverted, currentPrice, atLimitedTick],
    );

    // const handleSetDefaultPrice = useCallback(() => {
    //   if (isNullArgs(selectedPool) || isNullArgs(inputToken) || isNullArgs(outputToken) || isNullArgs(minUseableTick))
    //     return;

    //   // Force tick range exclude tick current
    //   const minPrice = tickToPrice(inputToken, outputToken, minUseableTick);

    //   handleInputPrice(minPrice.toFixed(outputToken.decimals), false);
    // }, [inputToken, outputToken, selectedPool, minUseableTick]);

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(() => {
      if (
        isNullArgs(inputToken) ||
        isNullArgs(outputToken) ||
        isNullArgs(selectedPool) ||
        isNullArgs(isInputTokenSorted)
      )
        return;

      const baseToken = inputToken;
      const quoteToken = outputToken;

      const price = new Price({
        baseAmount: CurrencyAmount.fromRawAmount(baseToken, formatTokenAmount(1, baseToken.decimals).toString()),
        quoteAmount: CurrencyAmount.fromRawAmount(
          quoteToken,
          formatTokenAmount(orderPrice, quoteToken.decimals).toString(),
        ),
      });

      const closestUseableTick = priceToClosestUseableTick(price, selectedPool, isInputTokenSorted);
      const useablePrice = tickToPrice(baseToken, quoteToken, closestUseableTick);

      handleInputPrice(
        inverted
          ? new BigNumber(1).dividedBy(useablePrice.toFixed(outputToken.decimals)).toFixed(outputToken.decimals)
          : useablePrice.toFixed(outputToken.decimals),
        inverted,
      );
    }, [orderPrice, selectedPool, inputToken, outputToken, isInputTokenSorted, inverted]);

    // Set default order price
    useEffect(() => {
      handleMinMax();
    }, [handleMinMax, inputToken, outputToken, selectedPool, minUseableTick]);

    useImperativeHandle(
      ref,
      () => ({
        setDefaultPrice: handleMinMax,
        resetInverted: () => setInverted(false),
      }),
      [handleMinMax, setInverted],
    );

    const formattedInputValue = useMemo(() => {
      return inputValueFormat(inputValue);
    }, [inputValue]);

    return (
      <MainCard
        border="level4"
        level={ui === "pro" ? 1 : 3}
        padding={ui === "pro" ? "16px" : "16px"}
        borderRadius={ui === "pro" ? "12px" : undefined}
      >
        <Box sx={{ display: "grid", gap: "16px 0", gridTemplateColumns: "1fr" }}>
          <Flex fullWidth justify="space-between">
            <Flex gap="0 4px">
              <Typography>{t("common.when")}</Typography>

              <Typography color="text.primary" component="div" sx={{ display: "flex", gap: "0 4px" }}>
                1 <TokenImage size="16px" logo={inputTokenInverted?.logo} tokenId={inputTokenInverted?.address} />{" "}
                {inputTokenInverted?.symbol} =
              </Typography>
            </Flex>

            {inputToken && outputToken ? (
              <Box
                sx={{ width: "24px", height: "24px", cursor: "pointer", transform: "rotate(90deg)" }}
                onClick={handleInvert}
              >
                <img src="/images/ck-bridge-switch.svg" style={{ width: "24px", height: "24px" }} alt="" />
              </Box>
            ) : null}
          </Flex>

          <Flex>
            <Flex sx={{ flex: 1 }} fullWidth gap="0 12px">
              <Flex vertical align="flex-start" gap="6px 0">
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderBottom: "6px solid #8492C4",
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={handleIncreasePrice}
                />

                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderTop: "6px solid #8492C4",
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={handleDecreasePrice}
                />
              </Flex>

              <SwapInput
                align="left"
                token={outputToken}
                value={formattedInputValue}
                onUserInput={(value: string) => handleInputPrice(value, inverted)}
                onBlur={handleBlur}
              />
            </Flex>

            <Flex gap="0 8px">
              <Typography sx={{ color: "text.primary", fontWeight: 500 }} component="div">
                {outputTokenInverted ? (
                  <Flex gap="0 4px">
                    <TokenImage size="16px" logo={outputTokenInverted.logo} tokenId={outputTokenInverted.address} />
                    <Typography color="text.primary">{outputTokenInverted.symbol}</Typography>
                  </Flex>
                ) : (
                  ""
                )}
              </Typography>
            </Flex>
          </Flex>

          <PriceMutator
            currentPrice={currentPrice}
            inverted={inverted}
            onMinMax={handleMinMax}
            onChange={handlePriceChange}
            inputValue={formattedInputValue}
            minUseablePrice={minUseablePrice}
            isInputTokenSorted={isInputTokenSorted}
            minPrice={minPrice}
            available={available}
          />
        </Box>
      </MainCard>
    );
  },
);
