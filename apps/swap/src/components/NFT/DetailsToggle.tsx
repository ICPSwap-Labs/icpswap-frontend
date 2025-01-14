import React, { useState } from "react";
import { Typography, Grid, Box, useTheme } from "components/Mui";
import { MainCard } from "components/index";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function DetailsToggle({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const [detailsShow, setDetailsShow] = useState(true);

  const theme = useTheme();

  const handleToggleDetailsShow = () => {
    setDetailsShow(!detailsShow);
  };

  return (
    <MainCard padding="0px" level={4}>
      <Grid
        container
        alignItems="center"
        sx={{ cursor: "pointer", padding: "18px 24px", [theme.breakpoints.down("md")]: { padding: "9px 12px" } }}
        onClick={handleToggleDetailsShow}
      >
        <Typography color="text.primary" fontWeight="500" fontSize="16px">
          {title}
        </Typography>
        <Grid item xs>
          <Grid container justifyContent="flex-end" alignItems="center">
            <ArrowForwardIosIcon
              sx={{
                fontSize: "16px",
                transform: detailsShow ? "rotate(-90deg)" : "rotate(90deg)",
                transition: "all 300ms",
                fontWeight: "500",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      {detailsShow ? (
        <Box
          sx={{
            overflow: "hidden",
            padding: "18px 24px",
            borderTop: "2px solid rgba(255, 255, 255, 0.04)",
            [theme.breakpoints.down("md")]: { padding: "9px 12px" },
          }}
        >
          {children}
        </Box>
      ) : null}
    </MainCard>
  );
}
