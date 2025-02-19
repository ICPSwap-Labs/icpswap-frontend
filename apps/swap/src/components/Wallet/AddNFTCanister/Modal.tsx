import { useState, useMemo } from "react";
import {
  Button,
  Grid,
  Typography,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Modal from "components/modal/index";
import { IconSearch } from "@tabler/icons";
import { useSelectedCanistersManager } from "store/nft/hooks";
import { useNFTCanisterList, useCanisterLogo } from "hooks/nft/useNFTCalls";
import { OFFICIAL_CANISTER_IDS } from "constants/index";
import { isICPSwapOfficial } from "utils";
import type { NFTControllerInfo } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { NoData, FilledTextField } from "components/index";
import { useTranslation } from "react-i18next";

export function CollectionInfoItem({ data }: { data: NFTControllerInfo }) {
  const { t } = useTranslation();
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
    <TableRow>
      <TableCell>
        <Grid container alignItems="center">
          <Avatar src={logo ?? ""}>&nbsp;</Avatar>
          <Grid
            ml={1}
            item
            xs
            sx={{
              width: "120px",
              overflow: "hidden",
            }}
          >
            <Typography
              fontSize={12}
              color="textSecondary"
              sx={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.name}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography>{data.cid?.toString()}</Typography>
      </TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}

export default function AddNFTCanisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchValue, setSearchValue] = useState("");

  const { result } = useNFTCanisterList(0, 1000);
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
      title={t`Add NFTs`}
      dialogProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "700px",
            maxWith: "700px",
          },
        },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <TableContainer style={{ maxHeight: "400px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("common.name")}</TableCell>
                  <TableCell>{t("common.address")}</TableCell>
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, index) => (
                  <CollectionInfoItem key={`${item.cid}-${index}`} data={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {list.length === 0 ? <NoData /> : null}
        </Grid>
      </Grid>
    </Modal>
  );
}
