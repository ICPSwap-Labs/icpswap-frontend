import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "components/Mui";
import { ArrowLeft } from "react-feather";

export interface HeaderTabProps {
  showArrow?: boolean;
  showUserSetting?: boolean;
  title: React.ReactChild;
  slippageType?: string;
  onBack?: () => void;
}

export default function SwapHeader({ showArrow = false, title, onBack }: HeaderTabProps) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }, [navigate, onBack]);

  return (
    <Grid container>
      <Grid item xs={2} container justifyContent="flex-start">
        {showArrow && <ArrowLeft style={{ cursor: "pointer" }} onClick={handleBack} />}
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
