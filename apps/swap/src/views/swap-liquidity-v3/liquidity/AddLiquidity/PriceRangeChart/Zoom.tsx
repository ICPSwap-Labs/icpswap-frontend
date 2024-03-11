import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components/macro";
import { select, zoom, zoomIdentity, ZoomTransform, ScaleLinear, ZoomBehavior } from "d3";
import { Grid, Box, Chip } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { Replay as ReplayIcon } from "@mui/icons-material";
import ZoomInIcon from "assets/images/swap/zoomIn";
import ZoomOutIcon from "assets/images/swap/zoomOut";
import { isDarkTheme } from "utils";
import { ZoomLevels } from "./types";
import { Theme } from "@mui/material/styles";

export const ZoomOverlay = styled.rect`
  fill: transparent;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const useStyle = makeStyles((theme: Theme) => {
  return {
    chartIcon: {
      width: "28px",
      height: "28px",
      backgroundColor: theme.palette.background.level3,
      borderRadius: "50%",
      cursor: "pointer",
      marginRight: "12px",
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
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
}

export default function Zoom({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  zoomLevels,
}: {
  svg: SVGElement | null;
  xScale: ScaleLinear<number, number>;
  setZoom: (transform: ZoomTransform) => void;
  width: number;
  height: number;
  resetBrush: () => void;
  showResetButton: boolean;
  zoomLevels: ZoomLevels;
}) {
  const classes = useStyle();
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>();
  const theme = useTheme() as Theme;

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

  return (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
      }}
    >
      <Grid container>
        <Grid item xs mr="5px">
          <Chip
            className={classes.chartIcon}
            icon={<ReplayIcon />}
            onClick={() => {
              resetBrush();
              zoomReset();
            }}
          />
        </Grid>
        <Grid item xs mr="5px">
          <Chip
            className={classes.chartIcon}
            icon={<ZoomInIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
            onClick={zoomIn}
          />
        </Grid>
        <Grid item xs>
          <Chip
            className={classes.chartIcon}
            icon={<ZoomOutIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
            onClick={zoomOut}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
