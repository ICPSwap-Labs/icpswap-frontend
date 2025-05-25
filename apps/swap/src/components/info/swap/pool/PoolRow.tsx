import { Box } from "components/Mui";
import { Null, PublicPoolOverView } from "@icpswap/types";
import { TokenImage } from "components/index";
import { useToken } from "hooks/index";
import { BodyCell, TableRow, FeeTierPercentLabel, APRPanel, Flex, Link } from "@icpswap/ui";
import { usePoolAPR } from "@icpswap/hooks";
import { formatDollarAmount } from "@icpswap/utils";

interface PoolRowProps {
  poolInfo: PublicPoolOverView;
  tvlUSD: string | number | Null;
  index: number;
  align?: "right" | "left";
  wrapperClass?: string;
}

export function PoolRow({ poolInfo, tvlUSD, index, wrapperClass, align = "left" }: PoolRowProps) {
  const [, token0] = useToken(poolInfo.token0Id);
  const [, token1] = useToken(poolInfo.token1Id);

  const apr24h = usePoolAPR({ volumeUSD: poolInfo.volumeUSD, tvlUSD });

  return (
    <Link to={`/info-swap/pool/details/${poolInfo.pool}`}>
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

            <FeeTierPercentLabel feeTier={poolInfo.feeTier} />
          </Flex>
        </BodyCell>
        <BodyCell align={align}>{tvlUSD ? formatDollarAmount(tvlUSD) : "--"}</BodyCell>
        <BodyCell align={align}>{apr24h ? <APRPanel value={apr24h} /> : "--"}</BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.volumeUSD)}</BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.volumeUSD7d)}</BodyCell>
        <BodyCell align={align}>{formatDollarAmount(poolInfo.totalVolumeUSD)}</BodyCell>
      </TableRow>
    </Link>
  );
}
