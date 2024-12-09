import { makeStyles } from "components/Mui";
import { Null } from "@icpswap/types";
import { PositionTable } from "components/liquidity/index";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      padding: "16px",
      alignItems: "center",
      gridTemplateColumns: "200px 120px 120px repeat(3, 1fr)",
    },
  };
});

export interface PositionsProps {
  poolId: string | Null;
}

export function Positions({ poolId }: PositionsProps) {
  const classes = useStyles();

  return <PositionTable poolId={poolId} wrapperClassName={classes.wrapper} />;
}
