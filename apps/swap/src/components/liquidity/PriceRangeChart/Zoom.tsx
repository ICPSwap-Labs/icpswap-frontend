import { Flex } from "@icpswap/ui";
import ZoomInIcon from "assets/images/swap/zoomIn";
import ZoomOutIcon from "assets/images/swap/zoomOut";
import { Box, Chip, styled, type Theme, useTheme } from "components/Mui";
import { ReplayIcon } from "components/MuiIcon";
import { type ScaleLinear, select, type ZoomBehavior, type ZoomTransform, zoom, zoomIdentity } from "d3";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { isDarkTheme } from "utils";

import type { ZoomLevels } from "./types";

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

const StyledChip = styled(Chip)(({ theme }: { theme: Theme }) => ({
  width: "28px",
  height: "28px",
  backgroundColor: theme.palette.background.level3,
  borderRadius: "50%",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
    marginRight: "0",
    marginLeft: "0",
    color: isDarkTheme(theme) ? "inherit" : theme.colors.darkLevel2,
  },
  "& .MuiChip-label": {
    display: "none",
  },
}));

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

export default function Zoom({ svg, setZoom, width, height, resetBrush, zoomLevels, noIcons = false }: ZoomProps) {
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
  }, [height, width, setZoom, svg, zoomLevels, zoomLevels.max, zoomLevels.min]);

  // biome-ignore lint: reset zoom to initial on zoomLevel change
  useEffect(() => {
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
        <StyledChip
          icon={<ReplayIcon />}
          onClick={() => {
            if (resetBrush) resetBrush();
            zoomReset();
          }}
        />
        <StyledChip
          icon={<ZoomInIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
          onClick={zoomIn}
        />
        <StyledChip
          icon={<ZoomOutIcon fillColor={isDarkTheme(theme) ? undefined : theme.colors.darkLevel2} />}
          onClick={zoomOut}
        />
      </Flex>
    </Box>
  );
}
