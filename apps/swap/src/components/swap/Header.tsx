import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
// import SwapSettingIcon from "components/swap/SettingIcon";

export interface HeaderTabProps {
  showArrow?: boolean;
  showUserSetting?: boolean;
  title: React.ReactChild;
  slippageType?: string;
  onBack?: () => void;
}

export default function SwapHeader({
  showArrow = false,
  showUserSetting,
  title,
  slippageType,
  onBack,
}: HeaderTabProps) {
  const history = useHistory();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      history.goBack();
    }
  }, [history, onBack]);

  return (
    <Grid container>
      <Grid item xs={2} container justifyContent="flex-start">
        {showArrow && <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={handleBack} />}
      </Grid>
      <Grid item xs container justifyContent="center">
        <Typography color="textPrimary" variant="h3">
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        xs={2}
        container
        justifyContent="flex-start"
        sx={{
          position: "relative",
        }}
      >
        {/* {showUserSetting && <SwapSettingIcon type={slippageType} />} */}
      </Grid>
    </Grid>
  );
}
