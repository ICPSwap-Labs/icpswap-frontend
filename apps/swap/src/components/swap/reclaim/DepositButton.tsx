import { useState } from "react";
import { TextButton } from "@icpswap/ui";
import { DepositModal } from "components/swap/DepositModal";
import { Pool, Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface DepositButtonProps {
  token: Token | undefined;
  pool: Pool | null | undefined;
  onDepositSuccess: () => void;
  fontSize?: string;
}

export function DepositButton({ token, pool, fontSize, onDepositSuccess }: DepositButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TextButton onClick={() => setOpen(true)} sx={{ fontSize }}>
        {t("common.deposit")}
      </TextButton>
      {open && pool && token ? (
        <DepositModal
          open={open}
          onClose={() => setOpen(false)}
          pool={pool}
          token={token}
          onDepositSuccess={onDepositSuccess}
        />
      ) : null}
    </>
  );
}
