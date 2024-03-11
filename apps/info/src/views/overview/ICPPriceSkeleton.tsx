import { Card, CardContent, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Skeleton from "@mui/material/Skeleton";

const useStyles = makeStyles({
  cardAction: {
    padding: "10px",
    display: "flex",
    paddingTop: 0,
    justifyContent: "center",
  },
});

const PopularCard = () => {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs zeroMinWidth>
                <Skeleton height={20} />
              </Grid>
              <Grid item>
                <Skeleton height={20} width={20} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Skeleton height={150} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Skeleton height={20} />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                      <Grid item xs zeroMinWidth>
                        <Skeleton height={20} />
                      </Grid>
                      <Grid item>
                        <Skeleton height={16} width={16} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={20} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Skeleton height={20} />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                      <Grid item xs zeroMinWidth>
                        <Skeleton height={20} />
                      </Grid>
                      <Grid item>
                        <Skeleton height={16} width={16} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={20} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Skeleton height={20} />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                      <Grid item xs zeroMinWidth>
                        <Skeleton height={20} />
                      </Grid>
                      <Grid item>
                        <Skeleton height={16} width={16} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={20} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Skeleton height={20} />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                      <Grid item xs zeroMinWidth>
                        <Skeleton height={20} />
                      </Grid>
                      <Grid item>
                        <Skeleton height={16} width={16} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={20} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Skeleton height={20} />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                      <Grid item xs zeroMinWidth>
                        <Skeleton height={20} />
                      </Grid>
                      <Grid item>
                        <Skeleton height={16} width={16} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Skeleton height={20} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent className={classes.cardAction}>
        <Skeleton height={25} width={75} />
      </CardContent>
    </Card>
  );
};

export default PopularCard;
