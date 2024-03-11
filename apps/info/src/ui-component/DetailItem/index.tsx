import { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Copy } from "ui-component/index";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    itemTitle: {
      height: "60px",
      paddingLeft: "40px",
      background: theme.palette.background.level2,
      "@media(max-width: 640px)": {
        paddingLeft: "10px",
      },
    },
    itemContent: {
      height: "60px",
      width: "100%",
    },
  };
});

export interface DetailsItemProps {
  title: ReactNode;
  value: ReactNode;
  CustomChild?: ReactNode;
  isAddress?: boolean;
  border?: { [key: string]: any };
}

export default function DetailItem({ title, value, CustomChild, isAddress, border }: DetailsItemProps) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={4}>
        <Grid container alignItems="center" className={classes.itemTitle} style={border}>
          <Typography
            component="span"
            sx={{
              fontSize: "16px",
              "@media(max-width: 640px)": {
                fontSize: "14px",
              },
            }}
          >
            {title}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={8} className={classes.itemContent}>
        <Grid
          container
          alignItems="center"
          sx={{
            paddingLeft: "46px",
            height: "100%",
            "@media(max-width: 640px)": {
              paddingLeft: "20px",
            },
          }}
        >
          {CustomChild ? (
            CustomChild
          ) : (
            <Grid item>
              {isAddress ? (
                // @ts-ignore
                <Copy content={value}>
                  <Typography fontWeight="500" fontSize="16px">
                    {value}
                  </Typography>
                </Copy>
              ) : (
                <Typography color="text.primary" fontSize="16px">
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
