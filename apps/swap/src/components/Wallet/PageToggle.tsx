import { useMemo, useContext } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { t } from "@lingui/macro";
import walletContext from "./context";

type Item = {
  name: string;
  pageName: "token" | "nft";
};

const DISPLAY_ITEMS: Item[] = [
  {
    name: t`Token`,
    pageName: "token",
  },
  {
    name: t`NFT`,
    pageName: "nft",
  },
];

export default function WalletPageToggle() {
  const { page, setPage } = useContext(walletContext);

  const currentDisplay = useMemo(() => {
    return DISPLAY_ITEMS.filter((item) => item.pageName === page)[0].pageName;
  }, [page]);

  const handleToggle = (item: Item) => {
    setPage(item.pageName);
  };

  return (
    <Box sx={{ display: "flex", gap: "0 24px", alignItems: "center" }}>
      {DISPLAY_ITEMS.map((item) => (
        <Typography
          key={item.pageName}
          variant="h3"
          color={currentDisplay === item.pageName ? "textPrimary" : ""}
          onClick={() => handleToggle(item)}
          sx={{ cursor: "pointer" }}
        >
          {item.name}
        </Typography>
      ))}
    </Box>
  );
}
