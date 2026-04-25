import { Grid, Typography } from "components/Mui";
import type React from "react";
import { useCallback } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";

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
