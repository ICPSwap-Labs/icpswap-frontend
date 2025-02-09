import { useMemo, useContext } from "react";
import { Typography, Box } from "components/Mui";
import i18n from "i18n/index";

import walletContext from "./context";

type Item = {
  name: string;
  pageName: "token" | "nft";
};

const DISPLAY_ITEMS: Item[] = [
  {
    name: i18n.t("common.token"),
    pageName: "token",
  },
  {
    name: i18n.t("common.nft"),
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
