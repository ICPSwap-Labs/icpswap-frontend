import { Box, Typography, SvgIcon, makeStyles, Theme } from "components/Mui";
import { AlertCircle } from "react-feather";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

const useStyle = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "flex",
      alignItems: "center",
      height: "24px",

      "& .MuiTypography-root": {
        fontSize: "12px",
        fontWeight: 500,
      },

      "&.closed": {
        background: theme.colors.dark400,
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
  const { t } = useTranslation();
  const classes = useStyle();

  return (
    <Box component="span" className={`${classes.wrapper} closed`}>
      <Marker fontSize="12px" color="#fff" />

      <Typography color="#ffffff" sx={{ marginLeft: "3px" }}>
        {t("common.closed")}
      </Typography>
    </Box>
  );
}

function OutOfRange() {
  const { t } = useTranslation();

  return (
    <Flex gap="0 4px">
      <AlertCircle size="12px" color="#FFC107" />
      <Typography sx={{ color: "#FFC107", fontSize: "12px" }}>{t("common.out.range")}</Typography>
    </Flex>
  );
}

function InRange() {
  const { t } = useTranslation();
  const classes = useStyle();

  return (
    <Box className={`${classes.wrapper} inRange`}>
      <Box
        component="span"
        sx={{ background: "#54C081", width: "8px", height: "8px", borderRadius: "50%", marginRight: "8px" }}
      />
      <Typography sx={{ fontSize: "12px", color: "#54C081" }}>{t("common.in.range")}</Typography>
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
