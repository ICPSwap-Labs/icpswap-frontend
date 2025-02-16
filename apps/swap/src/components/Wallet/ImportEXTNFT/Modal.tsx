import { useEffect, useState } from "react";
import Modal from "components/modal/index";
import type { EXTCollection } from "@icpswap/types";
import { NFT_STANDARDS } from "@icpswap/constants";
import { FilledTextField } from "components/index";
import { useEXTAllCollections } from "@icpswap/hooks";
import { Button, Box } from "@mui/material";
import { isValidPrincipal } from "@icpswap/utils";
import { useEXTManager } from "store/nft/hooks";
import { useTranslation } from "react-i18next";

export const Standards = [{ label: "EXT", value: NFT_STANDARDS.EXT }];

export interface Value {
  id: string;
  standard: string;
}

export function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_25889_76502)">
        <path
          d="M8.00196 10.9668C8.44927 10.9668 8.82422 11.3417 8.82422 11.7891C8.82422 12.2364 8.44927 12.6113 8.00196 12.6113C7.57109 12.6113 7.1797 12.2364 7.19943 11.8088C7.1797 11.3385 7.55136 10.9668 8.00196 10.9668Z"
          fill="#B79C4A"
        />
        <path
          d="M0.389341 13.8799C-0.127039 12.9885 -0.130329 11.9262 0.382763 11.0381L5.53341 2.11824C6.04321 1.22033 6.96415 0.6875 7.99691 0.6875C9.02967 0.6875 9.9506 1.22361 10.4604 2.11495L15.6176 11.0447C16.1307 11.9426 16.1274 13.0116 15.6078 13.9029C15.0947 14.7844 14.177 15.3139 13.1508 15.3139H2.86271C1.83323 15.3139 0.909011 14.7778 0.389341 13.8799ZM1.50762 13.2352C1.79377 13.7286 2.30028 14.0213 2.86599 14.0213H13.1541C13.7133 14.0213 14.2165 13.7352 14.4961 13.2517C14.7789 12.7616 14.7822 12.1761 14.4994 11.6828L9.34213 2.75631C9.06256 2.26624 8.56263 1.97681 7.99691 1.97681C7.43448 1.97681 6.93126 2.26953 6.65169 2.7596L1.49775 11.6861C1.22147 12.1663 1.22476 12.7451 1.50762 13.2352Z"
          fill="#B79C4A"
        />
        <path
          d="M8.20506 5.19314C8.59645 5.30496 8.83984 5.66018 8.83984 6.09105C8.82011 6.35088 8.80366 6.614 8.78393 6.87384C8.72802 7.86384 8.6721 8.83411 8.61619 9.82411C8.59645 10.1596 8.33662 10.403 8.00114 10.403C7.66565 10.403 7.40253 10.1432 7.38609 9.80438C7.38609 9.60046 7.38608 9.41298 7.36635 9.20577C7.33017 8.57099 7.2907 7.9362 7.25452 7.30141C7.23479 6.89028 7.19861 6.47915 7.17887 6.06802C7.17887 5.92001 7.19861 5.78845 7.25452 5.65689C7.42226 5.28852 7.81366 5.10104 8.20506 5.19314Z"
          fill="#B79C4A"
        />
      </g>
      <defs>
        <clipPath id="clip0_25889_76502">
          <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ImportNFTCanisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [metadata, setMetadata] = useState<null | undefined | EXTCollection>(null);
  const [values, setValues] = useState<Value>({ standard: NFT_STANDARDS.EXT } as Value);
  const [riskWarning, setRiskWarning] = useState(false);

  const { result: extAllCollections } = useEXTAllCollections();

  const { nfts, importNFT } = useEXTManager();

  const handleValueChange = (value: any, filed: string) => {
    setStep(0);
    setMetadata(null);
    setRiskWarning(false);

    setValues({
      ...values,
      [filed]: value,
    });
  };

  const handleImport = async () => {
    if (!metadata) return;
    importNFT({ canisterId: values.id, standard: values.standard as NFT_STANDARDS });
    onClose();
  };

  useEffect(() => {
    if (values.id && extAllCollections) {
      const metadata = extAllCollections.find((e) => e.id === values.id);
      setMetadata(metadata);
    }
  }, [extAllCollections, values.id]);

  const isExisted = (id: string | null | undefined) => {
    if (!id) return false;

    if (id && nfts && nfts.length > 0) {
      if (nfts.find((ele) => ele.canisterId === id)) return true;
    }

    return false;
  };

  let error = "";
  if (values.id && isValidPrincipal(values.id) && isExisted(values.id)) error = t`The token exists`;
  if (values.id && !isValidPrincipal(values.id)) error = t("common.error.invalid.canister.id");
  if (values.id && !!extAllCollections?.length && !extAllCollections.find((e) => e.id === values.id))
    error = t`Non-existent canister id `;
  if (!values.id) error = t`Enter the canister id`;
  if (!values.standard) error = t`Select the token standard`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("nft.import")}
      dialogProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "700px",
            maxWith: "700px",
          },
        },
      }}
    >
      <Box>
        <FilledTextField
          label={t`NFT Standard`}
          select
          menus={Standards}
          placeholder={t`Select the NFT standard`}
          onChange={(value) => handleValueChange(value, "standard")}
          value={values.standard}
        />
      </Box>

      <Box mt="30px">
        <FilledTextField
          label={t`Canister ID`}
          placeholder={t`Enter the canister id`}
          onChange={(value) => handleValueChange(value, "id")}
          value={values.id}
        />
      </Box>

      <Box mt="30px">
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!!error || (!riskWarning && step === 1)}
          onClick={handleImport}
        >
          {error || (step === 1 ? t("common.confirm") : t("common,import"))}
        </Button>
      </Box>
    </Modal>
  );
}
