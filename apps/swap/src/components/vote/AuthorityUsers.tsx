import { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import { pageArgsFormat } from "@icpswap/utils";
import { Pagination, PaginationType, NoData, MainCard, ListLoading } from "components/index";
import { useVotingAuthorityUsers } from "@icpswap/hooks";
import { Principal } from "@dfinity/principal";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAuthorityUser from "components/vote/AddAuthorityUser";
import DeleteAuthorityUser from "components/vote/DeleteAuthorityUser";
import { useTranslation } from "react-i18next";

export default function AuthorityUsers({ canisterId }: { canisterId: string }) {
  const { t } = useTranslation();
  const [addShow, setAddShow] = useState(false);
  const [deletedUser, setDeletedUser] = useState<undefined | string>(undefined);
  const [refresh, setRefresh] = useState(false);

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const { result, loading } = useVotingAuthorityUsers(canisterId, offset, pagination.pageSize, refresh);

  const { content: list, totalElements } = result ?? { content: [] as Principal[], totalElements: BigInt(0) };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="flex-end">
        <Button variant="contained" size="large" onClick={() => setAddShow(true)}>
          {t("vote.add.user")}
        </Button>
      </Grid>

      <TableContainer className={loading ? "with-loading" : ""}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("common.principal.id")}</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((user) => (
              <TableRow key={user.toString()}>
                <TableCell>
                  <Typography>{user.toString()}</Typography>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => setDeletedUser(user.toString())}>
                    {t("common.delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {list.length === 0 && !loading ? <NoData /> : null}

        {loading ? <ListLoading loading={loading} /> : null}

        {Number(totalElements) > 0 ? (
          <Pagination
            count={Number(totalElements)}
            defaultPageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        ) : null}
      </TableContainer>

      {addShow ? (
        <AddAuthorityUser
          open={addShow}
          onClose={() => setAddShow(false)}
          canisterId={canisterId}
          onSuccess={handleRefresh}
        />
      ) : null}

      {deletedUser ? (
        <DeleteAuthorityUser
          open={!!deletedUser}
          onClose={() => setDeletedUser(undefined)}
          canisterId={canisterId}
          user={deletedUser}
          onSuccess={handleRefresh}
        />
      ) : null}
    </MainCard>
  );
}
