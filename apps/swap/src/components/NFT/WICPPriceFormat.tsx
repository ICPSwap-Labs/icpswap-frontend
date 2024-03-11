import { Grid, Typography } from "@mui/material";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import WICPCurrencyImage from "assets/images/wicp_currency.svg";
import { parseTokenAmount } from "@icpswap/utils";
import { formatAmount } from "@icpswap/utils";

export default function WICPPriceFormat({
  price,
  color,
  fontSize,
  imgSize = "16px",
  fontWeight = 500,
  align = "center",
  digits = 2,
  typographyProps,
}: {
  color?: string;
  fontSize?: string;
  price: bigint | number | undefined | null | string;
  imgSize?: string;
  fontWeight?: number;
  align?: string;
  digits?: number;
  typographyProps?: any;
}) {
  return (
    <Grid container alignItems={align}>
      <img width={imgSize} height={imgSize} src={WICPCurrencyImage} alt="" />
      <Grid item ml="6px">
        <Typography
          color={color ? (color === "default" ? "" : color) : "text.primary"}
          fontSize={fontSize ?? "24px"}
          component="span"
          sx={{
            fontWeight,
            lineHeight: fontSize ?? "24px",
          }}
          {...(typographyProps ?? {})}
        >
          {formatAmount(parseTokenAmount(price, WRAPPED_ICP_TOKEN_INFO.decimals).toNumber(), digits)}
        </Typography>
      </Grid>
    </Grid>
  );
}
