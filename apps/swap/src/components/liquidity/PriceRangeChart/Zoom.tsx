import { useEffect, useMemo, useRef, forwardRef } from "react";
import { select, zoom, zoomIdentity, ZoomTransform, ScaleLinear, ZoomBehavior } from "d3";
import { Box, Chip, makeStyles, useTheme, Theme } from "components/Mui";
import { Replay as ReplayIcon } from "@mui/icons-material";
import ZoomInIcon from "assets/images/swap/zoomIn";
import ZoomOutIcon from "assets/images/swap/zoomOut";
import { isDarkTheme } from "utils";
import { Flex } from "@icpswap/ui";

import { ZoomLevels } from "./types";

interface ZoomOverlayProps {
  width: string | number;
  height: string | number;
}

export const ZoomOverlay = forwardRef(({ width, height }: ZoomOverlayProps, ref) => {
  return (
    <Box
      ref={ref}
      component="rect"
      sx={{
        width,
        height,
        fill: "transparent",
        cursor: "grab",
        "&:active ": {
          cursor: "grabbing",
        },
      }}
    />
  );
});

const useStyle = makeStyles((theme: Theme) => {
  return {
    chartIcon: {
      width: "28px",
      height: "28px",
      backgroundColor: theme.palette.background.level3,
      borderRadius: "50%",
      cursor: "pointer",
      "&:last-child": {
        marginRight: 0,
      },
      "& .MuiSvgIcon-root": {
        fontSize: "1.2rem",
        marginRight: "0",
        marginLeft: "0",
        color: isDarkTheme(theme) ? "inherit" : theme.colors.darkLevel2,
      },
      "& .MuiChip-label": {
        display: "none",
      },
    },
  };
});

export interface ZoomProps {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush?: () => void;
  zoomLevels: ZoomLevels;
  noIcons?: boolean;
}

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  zoomLevels,
  noIcons = false,
}: ZoomProps) {
  const classes = useStyle();
  const theme = useTheme();

  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(zoomBehavior.current.transform, zoomIdentity.translate(0, 0).scale(1))
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg],
  );

  useEffect(() => {
    if (!svg) return;

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", ({ transform }) => setZoom(transform));

    select(svg as Element).call(zoomBehavior.current);
  }, [height, width, setZoom, svg, xScale, zoomBehavior, zoomLevels, zoomLevels.max, zoomLevels.min]);

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial();
  }, [zoomInitial, zoomLevels]);

  return noIcons ? null : (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
      }}
    >
      <Flex gap="0 8px">
        <Chip
          className={classes.chartIcon}
          icon={<ReplayIcon />}
          onClick={() => {
            if (resetBrush) resetBrush();
            zoomReset();
          }}
        />
        <Chip
          className={classes.chartIcon}
          icon={<ZoomInIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
          onClick={zoomIn}
        />
        <Chip
          className={classes.chartIcon}
          icon={<ZoomOutIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
          onClick={zoomOut}
        />
      </Flex>
    </Box>
  );
}
