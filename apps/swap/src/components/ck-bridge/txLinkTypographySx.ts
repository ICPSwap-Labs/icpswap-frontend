import { TypographyProps } from "components/Mui";

/** Shared typography styles for long tx/address links in ck-bridge transaction cards. */
export const txLinkTypographySx = {
  maxWidth: "380px",
  wordBreak: "break-all",
  whiteSpace: "break-spaces",
  textAlign: "right",
  lineHeight: "16px",
  "@media(max-width:640px)": { width: "220px" },
} satisfies TypographyProps["sx"];
