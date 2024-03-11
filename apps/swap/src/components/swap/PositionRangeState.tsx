import { Box, Typography, SvgIcon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyle = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "flex",
      alignItems: "center",
      height: "24px",
      padding: "0 9px",
      borderRadius: "8px",

      "& .MuiTypography-root": {
        fontSize: "12px",
        fontWeight: 500,
      },

      "&.inRange": {
        background: theme.colors.darkPrimary400,
      },

      "&.closed": {
        background: theme.colors.darkPrimary400,
      },

      "&.outOfRange": {
        background: "#FFC107",
        "& .MuiTypography-root": {
          color: theme.colors.darkLevel1,
          marginLeft: "3px",
        },
      },
    },
  };
});

function Marker(props: any) {
  return (
    <SvgIcon width="12" height="12" viewBox="0 0 12 12" {...props}>
      <path
        d="M5.5 3.5H6.5V4.5H5.5V3.5ZM5.5 5.5H6.5V8.5H5.5V5.5ZM6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10Z"
        fill={props.color ? props.color : "#111936"}
      />
    </SvgIcon>
  );
}

function Closed() {
  const classes = useStyle();

  return (
    <Box component="span" className={`${classes.wrapper} closed`}>
      <Marker fontSize="12px" color="#fff" />

      <Typography color="#ffffff" sx={{ marginLeft: "3px" }}>
        <Trans>Closed</Trans>
      </Typography>
    </Box>
  );
}

function OutOfRange() {
  const classes = useStyle();

  return (
    <Box className={`${classes.wrapper} outOfRange`}>
      <Marker fontSize="12px" />

      <Typography>
        <Trans>Out of range</Trans>
      </Typography>
    </Box>
  );
}

function InRange() {
  const classes = useStyle();

  return (
    <Box className={`${classes.wrapper} inRange`}>
      <Box
        component="span"
        sx={{ background: "#54C081", width: "8px", height: "8px", borderRadius: "50%", marginRight: "8px" }}
      />
      <Typography color="#ffffff">
        <Trans>In range</Trans>
      </Typography>
    </Box>
  );
}

export interface PositionRangeStateProps {
  outOfRange?: boolean | undefined;
  closed?: boolean | undefined;
}

export default function PositionRangeState({ outOfRange, closed }: PositionRangeStateProps) {
  return closed ? <Closed /> : outOfRange ? <OutOfRange /> : <InRange />;
}
