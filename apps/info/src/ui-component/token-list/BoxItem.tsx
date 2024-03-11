import { ReactNode } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Copy from "ui-component/copy/copy";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    itemTitle: {
      minHeight: "60px",
      height: "100%",
      background: theme.palette.background.level2,
    },
    itemContent: {
      minHeight: "60px",
      width: "100%",
    },
  };
});

export interface BoxItemProps {
  title: ReactNode;
  isAddress?: boolean;
  CustomChild?: ReactNode;
  value?: string | undefined;
  border?: { [key: string]: any };
}

export function BoxItem({ title, value, CustomChild, isAddress, border }: BoxItemProps) {
  const classes = useStyles();

  return (
    <Grid container>
      <Box sx={{ width: "156px", minHeight: "60px", "@media screen and (max-width: 640px)": { width: "90px" } }}>
        <Grid container alignItems="center" justifyContent="center" className={classes.itemTitle} style={border}>
          <Typography component="span" sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}>
            {title}
          </Typography>
        </Grid>
      </Box>

      <Grid item xs className={classes.itemContent}>
        <Grid
          container
          alignItems="center"
          sx={{
            paddingLeft: "40px",
            height: "100%",
            "@media screen and (max-width: 640px)": { paddingLeft: "10px" },
          }}
        >
          {CustomChild ? (
            CustomChild
          ) : (
            <Grid item>
              {isAddress && !!value ? (
                <Copy content={value}>
                  <Typography
                    fontWeight="500"
                    sx={{
                      "@media screen and (max-width: 640px)": { fontSize: "12px" },
                    }}
                  >
                    {value}
                  </Typography>
                </Copy>
              ) : (
                <Typography
                  color="text.primary"
                  sx={{
                    "@media screen and (max-width: 640px)": { fontSize: "12px" },
                  }}
                >
                  {value}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
