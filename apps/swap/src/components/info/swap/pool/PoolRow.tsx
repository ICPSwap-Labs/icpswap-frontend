import { Box } from "components/Mui";
import { TokenImage } from "components/index";
import { useToken } from "hooks/index";
import { BodyCell, TableRow, FeeTierPercentLabel, APRPanel, Flex, Link } from "@icpswap/ui";
import { formatDollarAmount, nonUndefinedOrNull } from "@icpswap/utils";
import { PoolInfoWithApr } from "types/info";

interface PoolRowProps {
  poolInfo: PoolInfoWithApr;
  index: number;
  align?: "right" | "left";
  wrapperClass?: string;
}

export function PoolRow({ poolInfo, index, wrapperClass, align = "left" }: PoolRowProps) {
  const [, token0] = useToken(poolInfo.token0LedgerId);
  const [, token1] = useToken(poolInfo.token1LedgerId);

  return (
    <Link to={`/info-swap/pool/details/${poolInfo.poolId}`}>
      <TableRow className={wrapperClass}>
        <BodyCell>{index}</BodyCell>
        <BodyCell>
          <Flex fullWidth gap="0 8px">
            <Box sx={{ display: "flex" }}>
              <TokenImage logo={token0?.logo} tokenId={token0?.address} />
              <TokenImage logo={token1?.logo} tokenId={token1?.address} />
            </Box>

            <BodyCell>
              <BodyCell overflow="ellipsis" width="90px" title={poolInfo.token0Symbol}>
                {poolInfo.token0Symbol}
              </BodyCell>{" "}
              /{" "}
              <BodyCell overflow="ellipsis" width="90px" title={poolInfo.token1Symbol}>
                {poolInfo.token1Symbol}
              </BodyCell>
            </BodyCell>

            <FeeTierPercentLabel feeTier={poolInfo.poolFee} />
          </Flex>
        </BodyCell>
        <BodyCell align={align}>
          {nonUndefinedOrNull(poolInfo.tvlUSD) ? formatDollarAmount(poolInfo.tvlUSD) : "--"}
        </BodyCell>
        <BodyCell align={align}>
          {nonUndefinedOrNull(poolInfo.apr24h) ? <APRPanel value={poolInfo.apr24h} /> : "--"}
        </BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.volumeUSD24H)}</BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.volumeUSD7D)}</BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.totalVolumeUSD)}</BodyCell>
      </TableRow>
    </Link>
  );
}
