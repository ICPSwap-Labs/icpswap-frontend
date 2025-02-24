import { Box, Typography, makeStyles, Theme } from "components/Mui";
import { getStateColor, PositionState } from "utils/swap/index";
import { PositionRangeDot } from "components/liquidity/index";
import { useTranslation } from "react-i18next";

interface UseStyleProps {
  width?: string;
}

const useStyle = ({ width }: UseStyleProps) => {
  return makeStyles((theme: Theme) => {
    return {
      wrapper: {
        width: width ?? "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "24px",
        padding: "0 9px",
        borderRadius: "8px",
        gap: "0 6px",
        "& .MuiTypography-root": {
          fontSize: "12px",
          fontWeight: 500,
        },
        "&.inRange": {
          background: theme.colors.darkLevel3,
        },
        "&.closed": {
          background: theme.colors.darkLevel3,
        },
        "&.outOfRange": {
          background: getStateColor(PositionState.OutOfRange),
          "& .MuiTypography-root": {
            color: theme.palette.text.primary,
          },
        },
      },
    };
  });
};

interface ClosedProps {
  width?: string;
}

function Closed({ width }: ClosedProps) {
  const { t } = useTranslation();
  const classes = useStyle({ width })();

  return (
    <Box component="span" className={`${classes.wrapper} closed`}>
      <PositionRangeDot state={PositionState.CLOSED} />

      <Typography color="#ffffff" sx={{ marginLeft: "3px" }}>
        {t("common.closed")}
      </Typography>
    </Box>
  );
}

interface OutOfRangeProps {
  width?: string;
}

function OutOfRange({ width }: OutOfRangeProps) {
  const { t } = useTranslation();
  const classes = useStyle({ width })();

  return (
    <Box className={`${classes.wrapper} outOfRange`}>
      <PositionRangeDot background="#ffffff" state={PositionState.OutOfRange} />

      <Typography>{t("common.out.range")}</Typography>
    </Box>
  );
}

interface InRangeProps {
  width?: string;
}

function InRange({ width }: InRangeProps) {
  const { t } = useTranslation();
  const classes = useStyle({ width })();

  return (
    <Box className={`${classes.wrapper} inRange`}>
      <PositionRangeDot state={PositionState.InRange} />

      <Typography color="#ffffff">{t("common.in.range")}</Typography>
    </Box>
  );
}

export interface PositionRangeStateProps {
  width?: string;
  state: PositionState | undefined;
}

export function PositionRangeState({ state, width }: PositionRangeStateProps) {
  return state === PositionState.CLOSED ? (
    <Closed width={width} />
  ) : state === PositionState.OutOfRange ? (
    <OutOfRange width={width} />
  ) : (
    <InRange width={width} />
  );
}
