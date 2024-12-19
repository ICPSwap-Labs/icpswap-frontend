import { useCallback } from "react";
import { useTheme, Typography } from "components/Mui";
import { Flex, Image, Link } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";

export type LinkButtonProps = { k: string; l?: string; v: string; i: string };

export interface LinkButtonItemProps {
  linkButton: LinkButtonProps;
  onClick?: (linkButton: LinkButtonProps) => void;
  size?: string;
}

export function LinkButton({ size = "18px", linkButton, onClick }: LinkButtonItemProps) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (onClick) onClick(linkButton);
  }, [onClick, linkButton]);

  return (
    <Link link={linkButton.v}>
      <Flex
        gap="0 4px"
        sx={{
          padding: "4px 8px",
          borderRadius: "8px",
          background: theme.palette.background.level4,
        }}
        onClick={handleClick}
      >
        <Image sx={{ width: size, height: size }} src={linkButton.i} />
        <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{linkButton.l ?? linkButton.k}</Typography>
      </Flex>
    </Link>
  );
}

export interface LinkButtonsProps {
  linkButtons: LinkButtonProps[] | Null;
}

export function LinkButtons({ linkButtons }: LinkButtonsProps) {
  return (
    <>
      {nonNullArgs(linkButtons) && linkButtons.length > 0
        ? linkButtons.map((linkButton) => <LinkButton key={linkButton.k} linkButton={linkButton} />)
        : null}
    </>
  );
}
