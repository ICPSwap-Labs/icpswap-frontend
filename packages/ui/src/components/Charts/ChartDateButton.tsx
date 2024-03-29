import { useState, ReactNode, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { VolumeWindow } from "@icpswap/constants";

export function SmallOptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode | ReactNode[];
  onClick: () => void;
}) {
  const theme = useTheme() as Theme;

  return (
    <Typography
      onClick={onClick}
      color="text.primary"
      component="div"
      sx={{
        padding: "4px",
        minWidth: "36px",
        fontSize: "12px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        background: active ? theme.colors.darkSecondaryDark : theme.palette.background.level3,
        cursor: "pointer",
      }}
    >
      {children}
    </Typography>
  );
}

export interface ChartDateButtonsProps {
  volume: VolumeWindow;
  onChange: (volume: VolumeWindow) => void;
}

export function ChartDateButtons({ volume, onChange }: ChartDateButtonsProps) {
  const [volumeWindow, setVolumeWindow] = useState<VolumeWindow>(VolumeWindow.daily);

  useEffect(() => {
    setVolumeWindow(volume);
  }, [volume]);

  const handleVolumeClick = (volumeWindow: VolumeWindow) => {
    onChange(volumeWindow);
  };

  return (
    <Box
      sx={{
        display: "grid",
        columnGap: "8px",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      <SmallOptionButton
        active={volumeWindow === VolumeWindow.daily}
        onClick={() => handleVolumeClick(VolumeWindow.daily)}
      >
        D
      </SmallOptionButton>
      <SmallOptionButton
        active={volumeWindow === VolumeWindow.weekly}
        onClick={() => handleVolumeClick(VolumeWindow.weekly)}
      >
        W
      </SmallOptionButton>
      <SmallOptionButton
        active={volumeWindow === VolumeWindow.monthly}
        onClick={() => handleVolumeClick(VolumeWindow.monthly)}
      >
        M
      </SmallOptionButton>
    </Box>
  );
}
