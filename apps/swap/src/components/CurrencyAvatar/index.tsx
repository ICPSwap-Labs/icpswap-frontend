import { Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Currency } from "@icpswap/swap-sdk";

const useStyles = ({ borderColor, size }: { borderColor: string; size?: string | undefined }) =>
  makeStyles(() => {
    return {
      avatar: {
        width: size ? size : "24px",
        height: size ? size : "24px",
        border: `1px solid ${borderColor}`,
      },
    };
  });

export interface CurrencyAvatarProps {
  currency: Currency | undefined | null;
  borderColor?: string;
  bgColor?: string;
  className?: string;
  size?: string;
}

export default function CurrencyAvatar({
  currency,
  borderColor = "#ffffff",
  bgColor = "#97a4ef",
  className,
  size,
}: CurrencyAvatarProps) {
  const classes = useStyles({ borderColor, size })();

  return (
    <Avatar
      className={`${classes.avatar} ${className ? className : ""}`}
      sx={{ bgcolor: bgColor }}
      src={currency?.logo}
    >
      &nbsp;
    </Avatar>
  );
}
