import { useState, useMemo } from "react";
import { Button, Typography, Avatar, InputAdornment, useTheme, useMediaQuery, Box, makeStyles } from "components/Mui";
import { Header, HeaderCell, TableRow, Flex, LoadingRow } from "@icpswap/ui";
import AddIcon from "@mui/icons-material/Add";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Modal from "components/modal/index";
import { IconSearch } from "@tabler/icons";
import { useSelectedCanistersManager } from "store/nft/hooks";
import { useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import { OFFICIAL_CANISTER_IDS } from "constants/index";
import { isICPSwapOfficial } from "utils";
import type { NFTControllerInfo } from "@icpswap/types";
import { NoData, FilledTextField } from "components/index";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 80px",
      gap: "0 6px",
    },
  };
});

export function CollectionInfoItem({ data }: { data: NFTControllerInfo }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { result: logo } = useCanisterLogo(data.cid);

  const [userSelectedCanisters, setUserSelectedCanisters, deleteUserSelectedCanister] = useSelectedCanistersManager();

  const hasBeenAdded = (canister: NFTControllerInfo) => {
    return (
      !!userSelectedCanisters.find((canisterId) => canisterId === canister?.cid) ||
      OFFICIAL_CANISTER_IDS.includes(canister?.cid)
    );
  };

  const handleAddNFTCanister = (canisterId: string) => {
    setUserSelectedCanisters([canisterId]);
  };

  const handleDeleteNFTCanister = (canisterId: string) => {
    deleteUserSelectedCanister(canisterId);
  };

  return (
    <TableRow className={classes.wrapper}>
      <Flex gap="0 4px">
        <Avatar src={logo ?? ""}>&nbsp;</Avatar>
        <Typography
          fontSize={12}
          color="textSecondary"
          sx={{
            width: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data.name}
        </Typography>
      </Flex>
      <Typography>{data.cid?.toString()}</Typography>
      <Box>
        {!isICPSwapOfficial(data.owner) ? (
          hasBeenAdded(data) ? (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<HorizontalRuleIcon />}
              onClick={() => handleDeleteNFTCanister(data.cid)}
            >
              {t("common.delete")}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddNFTCanister(data.cid)}
            >
              {t("common.add")}
            </Button>
          )
        ) : null}
      </Box>
    </TableRow>
  );
}

export default function AddNFTCanisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchValue, setSearchValue] = useState("");

  const { result, loading } = useNFTCanisterList(0, 1000);
  const { content } = result ?? { content: [] as NFTControllerInfo[] };

  const list = useMemo(() => {
    return content.filter((item) =>
      !searchValue ? true : item.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) || item.cid === searchValue,
    );
  }, [searchValue, content]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("wallet.nft.add")}
      dialogProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "700px",
            maxWith: "700px",
          },
        },
      }}
    >
      <FilledTextField
        contained
        borderRadius="12px"
        background={theme.palette.background.level1}
        textFieldProps={{
          slotProps: {
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="1rem" />
                </InputAdornment>
              ),
            },
          },
        }}
        fullWidth
        size={matchDownSM ? "small" : undefined}
        placeholder="Search canister"
        onChange={setSearchValue}
      />

      <Header className={classes.wrapper} sx={{ margin: "20px 0 0 0" }}>
        <HeaderCell>{t("common.name")}</HeaderCell>
        <HeaderCell>{t("common.address")}</HeaderCell>
        <HeaderCell>&nbsp;</HeaderCell>
      </Header>

      {loading ? (
        <Box sx={{ padding: "20px 0" }}>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : (
        <Box sx={{ maxHeight: "420px", overflow: "hidden auto" }}>
          {list.map((item, index) => (
            <CollectionInfoItem key={`${item.cid}-${index}`} data={item} />
          ))}
        </Box>
      )}

      {list.length === 0 && loading === false ? <NoData /> : null}
    </Modal>
  );
}
