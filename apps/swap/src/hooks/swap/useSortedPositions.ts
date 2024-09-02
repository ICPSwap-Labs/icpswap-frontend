import { useMemo } from "react";
import { BigNumber } from "@icpswap/utils";
import { PositionSort, UserPosition, UserPositionForFarm } from "types/swap";
import { encodePositionKeyByPool } from "utils/swap/index";

export interface UseSortedPositionsProps {
  sort: PositionSort;
  positions: (UserPosition | UserPositionForFarm)[] | undefined;
  feesValue: { [id: string]: BigNumber | undefined } | undefined;
  positionValue: { [id: string]: BigNumber | undefined } | undefined;
}

export function useSortedPositions<T>({ positions, sort, feesValue, positionValue }: UseSortedPositionsProps): T[] {
  return useMemo(() => {
    if (!positions) return [];
    if (sort === PositionSort.Default) return positions;

    if (sort === PositionSort.FeesValue) {
      if (!feesValue) return positions;
      if (Object.keys(feesValue).length < positions.length) return positions;

      return positions.sort((a, b) => {
        const keyA = encodePositionKeyByPool(a.id, a.index);
        const keyB = encodePositionKeyByPool(b.id, b.index);

        if (keyA && keyB) {
          const valueA = feesValue[keyA];
          const valueB = feesValue[keyB];

          if (valueA && valueB) {
            return valueA.isGreaterThan(valueB) ? -1 : 1;
          }
        }

        return 0;
      });
    }

    if (sort === PositionSort.PositionValue) {
      if (!positionValue) return positions;
      if (Object.keys(positionValue).length < positions.length) return positions;

      return positions.sort((a, b) => {
        const keyA = encodePositionKeyByPool(a.id, a.index);
        const keyB = encodePositionKeyByPool(b.id, b.index);

        if (keyA && keyB) {
          const valueA = positionValue[keyA];
          const valueB = positionValue[keyB];

          if (valueA && valueB) {
            return valueA.isGreaterThan(valueB) ? -1 : 1;
          }
        }

        return 0;
      });
    }

    return [];
  }, [feesValue, positionValue, sort, positions]) as T[];
}
