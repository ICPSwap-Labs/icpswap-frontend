import { useState, useMemo, useCallback } from "react";
import { Modal } from "components/index";
import { getPool } from "hooks/swap/v3Calls";
import { useTheme, Typography, Box, Avatar, CircularProgress, Button } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import CurrencySelector from "components/CurrencySelector/selector";
import { getUserPositionIds } from "hooks/swap/useUserPositionIds";
import { useUpdateUserPositionPools } from "store/hooks";
import { updateUserPositionPoolId } from "@icpswap/hooks";
import { useTips, TIP_SUCCESS } from "hooks/index";
import { useAccountPrincipal } from "store/auth/hooks";

function AddIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5V6H1.5C0.671573 6 0 6.67157 0 7.5C0 8.32843 0.671573 9 1.5 9H6V13.5C6 14.3284 6.67157 15 7.5 15C8.32843 15 9 14.3284 9 13.5V9H13.5C14.3284 9 15 8.32843 15 7.5C15 6.67157 14.3284 6 13.5 6H9V1.5Z"
        fill="#8492C4"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_32599_39163)">
        <path d="M11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656L11.06 5.72656Z" fill="#8492C4" />
      </g>
      <defs>
        <clipPath id="clip0_32599_39163">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface SelectedTokenProps {
  selectedTokenIds?: string[];
  onTokenChange: (token: TokenInfo) => void;
}

function SelectedToken({ selectedTokenIds, onTokenChange }: SelectedTokenProps) {
  const theme = useTheme() as Theme;

  const [token, setToken] = useState<null | TokenInfo>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleTokenChange = (token: TokenInfo) => {
    onTokenChange(token);
    setToken(token);
    setSelectorOpen(false);
  };

  const handleSelectToken = () => {
    setSelectorOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "64px",
          width: "100%",
          background: theme.palette.background.level3,
          borderRadius: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "0 10px",
        }}
        onClick={handleSelectToken}
      >
        {token ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0 8px" }}>
            <Avatar sx={{ width: "24px", height: "24px" }} src={token?.logo}>
              &nbsp;
            </Avatar>
            <Typography sx={{ fontSize: "16px", fontWeight: 600 }} color="text.primary">
              {token?.symbol}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography color="text.primary">
              <Trans>Select a token</Trans>
            </Typography>
          </Box>
        )}
        <ArrowIcon />
      </Box>

      <CurrencySelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onChange={handleTokenChange}
        disabledCurrencyIds={selectedTokenIds}
      />
    </>
  );
}

export interface FindPositionsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FindPositionsModal({ open, onClose }: FindPositionsModalProps) {
  const theme = useTheme() as Theme;
  const [openTip] = useTips();

  const principal = useAccountPrincipal();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [tokenA, setTokenA] = useState<null | TokenInfo>(null);
  const [tokenB, setTokenB] = useState<null | TokenInfo>(null);

  const handleTokenAChange = (tokenA: TokenInfo) => {
    setTokenA(tokenA);
    setError("");
  };

  const handleTokenBChange = (tokenB: TokenInfo) => {
    setTokenB(tokenB);
    setError("");
  };

  const handleClose = useCallback(() => {
    onClose();
    setTokenA(null);
    setTokenB(null);
  }, [onClose, setTokenA, setTokenB]);

  const selectedTokenIds = useMemo(() => {
    return [tokenA?.canisterId, tokenB?.canisterId].filter((ele) => !!ele) as string[];
  }, [tokenA, tokenB]);

  const updateStoreUserPositionPool = useUpdateUserPositionPools();

  const handleImport = async () => {
    if (!tokenA || !tokenB || loading || !principal) return;

    setLoading(true);

    const poolData = await getPool(tokenA.canisterId, tokenB.canisterId);

    if (!poolData) {
      setError(t`No available pools`);
      setLoading(false);
      return;
    }

    const poolId = poolData.canisterId.toString();
    const positionIds = await getUserPositionIds(poolId, principal.toString());

    if (!positionIds || positionIds.length === 0) {
      setError(t`No available position in this pool`);
      setLoading(false);
      return;
    }

    updateStoreUserPositionPool([poolId]);
    updateUserPositionPoolId(poolId, true);

    openTip("Imported successfully", TIP_SUCCESS);

    setLoading(false);

    handleClose();
  };

  return (
    <Modal
      open={open}
      title={t`Select a trading pair`}
      onClose={handleClose}
      background={theme.palette.background.level1}
      dialogProps={{
        sx: {
          "& .MuiDialog-paper": {
            padding: "0",
            width: "570px",
            backgroundColor: theme.palette.background.level2,
          },
          "& .MuiDialogContent-root": {
            padding: "0",
          },
        },
      }}
    >
      <Box
        sx={{
          padding: "20px 22px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px 0",
        }}
      >
        <SelectedToken onTokenChange={handleTokenAChange} selectedTokenIds={selectedTokenIds} />

        <AddIcon />

        <SelectedToken onTokenChange={handleTokenBChange} selectedTokenIds={selectedTokenIds} />

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleImport}
          disabled={!!error}
          startIcon={loading ? <CircularProgress color="inherit" size={30} /> : null}
        >
          {error || <Trans>Import</Trans>}
        </Button>
      </Box>
    </Modal>
  );
}
