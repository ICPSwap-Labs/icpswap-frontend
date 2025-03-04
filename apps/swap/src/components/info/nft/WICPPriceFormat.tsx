import { Grid, Typography } from "components/Mui";
import { WRAPPED_ICP_TOKEN_INFO } from "@icpswap/tokens";
import WICPCurrencyImage from "assets/images/wicp_currency.svg";
import { parseTokenAmount } from "@icpswap/utils";

export default function WICPPriceFormat({
  price,
  color,
  fontSize,
  imgSize = "16px",
  fontWeight = 500,
  align = "center",
}: {
  color?: string;
  fontSize?: string;
  price: bigint | number | undefined | null | string;
  imgSize?: string;
  fontWeight?: number;
  align?: string;
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
        >
          {parseTokenAmount(price, WRAPPED_ICP_TOKEN_INFO.decimals).toFormat()}
        </Typography>
      </Grid>
    </Grid>
  );
}
