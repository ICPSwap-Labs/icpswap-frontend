import { Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";

import { Dolphin, Fish, Whale } from "./icons";

const WhaleValue = 50000;
const DolphinValue = 10000;
const FishValue = 2000;

export enum TransactionValueLabel {
  whale = "whale",
  dolphin = "dolphin",
  fish = "fish",
}

export function getValueLabel(value: string | number | Null) {
  if (isUndefinedOrNull(value)) return undefined;

  return new BigNumber(value).isGreaterThan(WhaleValue)
    ? TransactionValueLabel.whale
    : new BigNumber(value).isGreaterThan(DolphinValue)
    ? TransactionValueLabel.dolphin
    : new BigNumber(value).isGreaterThan(FishValue)
    ? TransactionValueLabel.fish
    : undefined;
}

export interface ValueLabelProps {
  value: string | number | Null;
}

export function ValueLabel({ value }: ValueLabelProps) {
  const valueLabel = getValueLabel(value);

  return valueLabel === TransactionValueLabel.dolphin ? (
    <Dolphin />
  ) : valueLabel === TransactionValueLabel.fish ? (
    <Fish />
  ) : valueLabel === TransactionValueLabel.whale ? (
    <Whale />
  ) : null;
}
