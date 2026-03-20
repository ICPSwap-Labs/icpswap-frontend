import type { Null } from "@icpswap/types";
import { Flex, Image, Link } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Typography, useTheme } from "components/Mui";
import { useCallback } from "react";

export type MediaProps = { k: string; v: string };

export interface MediaItemProps {
  media: MediaProps;
  onClick?: (media: MediaProps) => void;
  size?: string;
}

export function Media({ size = "18px", media, onClick }: MediaItemProps) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (onClick) onClick(media);
  }, [onClick, media]);

  return (
    <Link link={media.v}>
      <Flex
        gap="0 4px"
        sx={{
          padding: "4px 8px",
          borderRadius: "8px",
          background: theme.palette.background.level4,
        }}
        onClick={handleClick}
      >
        <Image sx={{ width: size, height: size }} src={`/images/info/tokens/medias/${media.k}.svg`} />
        <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{media.k}</Typography>
      </Flex>
    </Link>
  );
}

export interface MediasProps {
  medias: MediaProps[] | Null;
}

export function Medias({ medias }: MediasProps) {
  return (
    <>
      {nonUndefinedOrNull(medias) && medias.length > 0
        ? medias.map((media) => <Media key={media.k} media={media} />)
        : null}
    </>
  );
}
