import { Chip, Box, ButtonBase, makeStyles, Theme } from "components/Mui";

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    marginLeft: "16px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "8px",
    },
  },
  profileChip: {
    background: theme.palette.mode === "dark" ? theme.colors.darkLevel4 : theme.colors.lightLevel2,
    borderRadius: "12px",
    color: theme.palette.mode === "dark" ? theme.colors.darkTextSecondary : theme.colors.lightPrimaryMain,
    border: "none",
  },
}));

export default function ProfileSection({ value, label }: { label: string; value: string | number }) {
  const classes = useStyles();

  return (
    <>
      <Box component="span" className={classes.box}>
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Chip className={classes.profileChip} label={`${label}: ${value}`} variant="outlined" color="primary" />
        </ButtonBase>
      </Box>
    </>
  );
}
