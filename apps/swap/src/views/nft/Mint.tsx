import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Box, CircularProgress, InputAdornment, Checkbox } from "@mui/material";
import { useAccount } from "store/global/hooks";
import { FilledTextField, TextFieldNumberComponent, TextButton, MainCard, NoData, Breadcrumbs } from "components/index";
import Upload, { UploadRef } from "components/NFT/Upload";
import { useMintNFTCallback, useCanisterMetadata, useUserCanisterList } from "hooks/nft/useNFTCalls";
import { useTips, TIP_ERROR } from "hooks/useTips";
import { NFT_UPLOAD_FILES, MAX_NFT_MINT_SUPPLY } from "constants/index";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { Identity as TypeIdentity } from "types/index";
import { type NFTControllerInfo } from "@icpswap/types";
import RequiredMark from "components/RequiredMark";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedOutlined from "@mui/icons-material/RadioButtonCheckedOutlined";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { stringToArrayBuffer } from "utils/index";
import BigNumber from "bignumber.js";
import { getLocaleMessage } from "locales/services";
import Button from "components/authentication/ButtonConnector";
import { useParsedQueryString } from "@icpswap/hooks";
import { CardContent1120 } from "components/Layout/CardContent1120";

export type Metadata = { label: string; value: string; key: number };

export type MintTokenInfo = { metadata: Metadata[]; [key: string]: any };

let metadataKey = 0;

export default function NFTMint() {
  const history = useHistory();
  const account = useAccount();
  const [mintTokenInfo, setMintTokenInfo] = useState<MintTokenInfo>({} as MintTokenInfo);
  const [openTip] = useTips();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const uploadRef = useRef<UploadRef>(null);

  const [agree, setAgree] = useState(false);

  const { canister: NFTCanisterId } = useParsedQueryString() as { canister: string };

  const { result: canisterMetadata } = useCanisterMetadata(mintTokenInfo.nftCanister);

  useEffect(() => {
    if (NFTCanisterId) {
      setMintTokenInfo({ ...mintTokenInfo, nftCanister: NFTCanisterId });
    }
  }, [NFTCanisterId]);

  const handleFieldChange = (value: string, field: string) => {
    let new_value = value;

    if (field === "fee" && new BigNumber(new_value).isGreaterThan(100)) {
      new_value = "100";
    }

    setMintTokenInfo({ ...mintTokenInfo, [field]: new_value });
  };

  const mintNFTCallback = useMintNFTCallback();

  const handleMintNFT = async (identity: TypeIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading) return;

    const { filePath, fileType } = (await uploadRef.current?.uploadCb()) ?? {};

    if (!filePath) {
      closeLoading();
      return;
    }

    const { status, message, data } = await mintNFTCallback(mintTokenInfo.nftCanister, identity, {
      nftType: mintTokenInfo.series ?? "",
      fileType: fileType ?? "",
      artistName: "",
      introduction: mintTokenInfo.desc ?? "",
      royalties: BigInt(0),
      name: mintTokenInfo.name,
      link: mintTokenInfo.link ?? "",
      image: filePath,
      filePath,
      owner: { address: account },
      attributes: [{ k: "", v: "" }],
      count: !mintTokenInfo.supply ? BigInt(1) : BigInt(new BigNumber(mintTokenInfo.supply).toString()),
      metadata: [
        [
          ...stringToArrayBuffer(
            JSON.stringify(
              (mintTokenInfo.metadata ?? []).reduce(
                (previousValue, currentValue) => {
                  if (!!currentValue.label && !!currentValue.value) {
                    return [...previousValue, { label: currentValue.label, value: currentValue.value }];
                  }

                  return [];
                },
                [] as { label: string; value: string }[],
              ),
            ),
          ),
        ],
      ],
    });

    closeLoading();

    if (status === "err") {
      openTip(getLocaleMessage(message) ?? t`Failed to mint`, TIP_ERROR);
    } else {
      history.push(`/wallet/nft/view/${mintTokenInfo.nftCanister}/${Number(data)}`);
    }
  };

  const { result: userNFTCanister } = useUserCanisterList(account, 0, 100);
  const { content: nftCanisterList } = userNFTCanister ?? { content: [] as NFTControllerInfo[] };

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  const handleFileError = (fileError: string) => {
    setFileError(fileError);
  };

  const handleBeforeFileUpload = () => {
    if (!mintTokenInfo.nftCanister) {
      openTip("Select NFT Canister First", TIP_ERROR);
      return false;
    }
    return true;
  };

  const handleMetadataAdd = () => {
    setMintTokenInfo({
      ...mintTokenInfo,
      metadata: [...(mintTokenInfo.metadata ?? []), { label: "", value: "", key: ++metadataKey }],
    });
  };

  const handleMetadataLabelInput = (value: string, index: number) => {
    const metadata = [...(mintTokenInfo.metadata ?? [])];

    if (metadata[index]) {
      metadata.splice(index, 1, { ...metadata[index], label: value });
    }

    setMintTokenInfo({ ...mintTokenInfo, metadata });
  };

  const handleMetadataValueInput = (value: string, index: number) => {
    const metadata = [...(mintTokenInfo.metadata ?? [])];

    if (metadata[index]) {
      metadata.splice(index, 1, { ...metadata[index], value });
    }

    setMintTokenInfo({ ...mintTokenInfo, metadata });
  };

  const handleMetadataDelete = (index: number) => {
    const metadata = [...(mintTokenInfo.metadata ?? [])];

    if (metadata[index]) metadata.splice(index, 1);

    setMintTokenInfo({ ...mintTokenInfo, metadata });
  };

  let errorMsg = "";
  if (!agree) errorMsg = t`Agree the statement`;
  if (fileError) errorMsg = t`File error`;
  if (!file) errorMsg = t`Selected the file`;
  if (!mintTokenInfo.name) errorMsg = t`Enter the name`;
  if (!mintTokenInfo.nftCanister) errorMsg = t`Select the NFT canister`;

  return (
    <CardContent1120>
      <Breadcrumbs prevLink="/console" prevLabel={<Trans>Console</Trans>} currentLabel={<Trans>Mint NFT</Trans>} />

      <MainCard sx={{ margin: "16px 0 0 0" }}>
        <Grid container justifyContent="center">
          <Box sx={{ maxWidth: "474px", margin: "28px 0 0 0" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "text.primary" }}>
              <Trans>Mint NFT</Trans>
            </Typography>

            <Grid
              mt="32px"
              container
              sx={{ display: "grid", gap: "20px 0", gridTemplateColumns: "1fr", gridAutoFlow: "row" }}
            >
              <Box className="grid-box">
                <Box>
                  <FilledTextField
                    label={<Trans>NFT Canister</Trans>}
                    required
                    select
                    placeholder="Select the NFT canister"
                    helperText={mintTokenInfo.nftCanister ?? ""}
                    value={nftCanisterList.filter((canister) => canister.cid === mintTokenInfo.nftCanister)[0]?.name}
                    onChange={(value) => handleFieldChange(value, "nftCanister")}
                    menus={nftCanisterList.map((canister) => ({
                      value: canister.cid,
                      label: canister.name,
                    }))}
                    CustomNoData={
                      <Grid
                        container
                        alignItems="center"
                        flexDirection="column"
                        sx={{
                          paddingBottom: "20px",
                        }}
                      >
                        <NoData />
                        <TextButton to="/console/nft/canister/create">
                          <Trans>Create an NFT canister</Trans>
                        </TextButton>
                      </Grid>
                    }
                  />
                </Box>
              </Box>

              <Box className="grid-box">
                <FilledTextField
                  label={<Trans>NFT Name</Trans>}
                  required
                  placeholder="Enter the NFT name"
                  onChange={(value) => handleFieldChange(value, "name")}
                  InputProps={{
                    inputProps: {
                      maxLength: 200,
                    },
                  }}
                />
              </Box>

              <Box className="grid-box">
                <Box>
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <RequiredMark />
                      <Typography component="span" fontSize="16px" color="text.secondary">
                        <Trans>Supply</Trans>
                      </Typography>
                    </Grid>
                    <Typography component="span" fontSize="14px" color="text.primary">
                      <Trans>Max Supply:</Trans>
                      &nbsp;
                      {new BigNumber(canisterMetadata?.totalSupply ? String(canisterMetadata?.totalSupply) : 0)
                        .minus(canisterMetadata?.mintSupply ? String(canisterMetadata?.mintSupply) : 0)
                        .toFormat()}
                    </Typography>
                  </Grid>
                  <Box mt={2}>
                    <FilledTextField
                      placeholder={t`The number of copies that can be minted`}
                      onChange={(value) => handleFieldChange(value, "supply")}
                      value={mintTokenInfo.supply ?? 1}
                      InputProps={{
                        inputComponent: TextFieldNumberComponent,
                        inputProps: {
                          thousandSeparator: true,
                          decimalScale: 0,
                          allowNegative: false,
                          format: (formattedValue: string) => {
                            if (new BigNumber(formattedValue).isGreaterThan(MAX_NFT_MINT_SUPPLY)) {
                              return String(MAX_NFT_MINT_SUPPLY);
                            }
                            return formattedValue;
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box className="grid-box">
                <Box>
                  <FilledTextField
                    label={<Trans>Description</Trans>}
                    placeholder={t`Enter the NFT description`}
                    multiline
                    rows={5}
                    maxRows={5}
                    onChange={(value) => handleFieldChange(value, "desc")}
                    InputProps={{
                      inputProps: {
                        maxLength: 500,
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box className="grid-box">
                <Grid container>
                  <Grid item xs>
                    <Typography component="span" fontSize="16px" color="text.secondary">
                      <Trans>Metadata</Trans>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: "72px",
                        height: "31px",
                        border: "1px solid #4F5A84",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={handleMetadataAdd}
                    >
                      <AddIcon fontSize="small" />
                      <Typography color="text.primary">
                        <Trans>Add</Trans>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  {(mintTokenInfo.metadata ?? []).map((meta: Metadata, index) => (
                    <Grid
                      container
                      key={`${meta.key}`}
                      sx={{
                        marginBottom: "10px",
                        "&:last-child": {
                          marginBottom: "0px",
                        },
                      }}
                    >
                      <Box mr="10px" sx={{ width: "145px" }}>
                        <FilledTextField
                          fullWidth
                          placeholder={t`Metadata Key`}
                          InputProps={{
                            disableUnderline: true,
                            inputProps: {
                              maxLength: 100,
                            },
                          }}
                          onChange={(value: string) => handleMetadataLabelInput(value, index)}
                        />
                      </Box>
                      <Grid item xs>
                        <FilledTextField
                          fullWidth
                          placeholder={t`Metadata Value`}
                          onChange={(value: string) => handleMetadataValueInput(value, index)}
                          InputProps={{
                            disableUnderline: true,
                            inputProps: {
                              maxLength: 100,
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <HighlightOffIcon
                                  sx={{
                                    color: "#8492C4",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleMetadataDelete(index)}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>

              <Box className="grid-box">
                <>
                  <Box>
                    <RequiredMark />
                    <Typography component="span" fontSize="16px" color="text.secondary">
                      <Trans>Upload NFT File</Trans>
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Box sx={{ height: "180px" }}>
                      <Upload
                        ref={uploadRef}
                        maxSize={200 * 1024}
                        types={NFT_UPLOAD_FILES}
                        accept=".jpeg, .png, .jpg, .gif, .apng, .pdf, .txt, .json, .ppt, .pptx, .xls, .xlsx, .docx, .doc"
                        placeholder="Upload your file"
                        beforeUpload={handleBeforeFileUpload}
                        canisterId={mintTokenInfo.nftCanister}
                        uploadImmediately={false}
                        onFileSelected={handleFileChange}
                        onFileError={handleFileError}
                      />
                      <Typography sx={{ marginTop: "5px" }}>
                        <Trans>Support : image / txt / json / pdf / ppt / excel / word Size: ≤200K</Trans>
                      </Typography>
                    </Box>
                  </Box>
                </>
              </Box>
            </Grid>
            <Box mt={8}>
              <Identity onSubmit={handleMintNFT} fullScreenLoading>
                {({ submit, loading }: CallbackProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submit}
                    disabled={Boolean(errorMsg) || loading}
                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                  >
                    {errorMsg || t`Mint`}
                  </Button>
                )}
              </Identity>
              <Grid container mt="20px">
                <Box sx={{ marginRight: "8px" }}>
                  <Checkbox
                    checked={agree}
                    sx={{ padding: "0" }}
                    icon={<RadioButtonUncheckedOutlinedIcon sx={{ fontSize: "20px" }} />}
                    checkedIcon={<RadioButtonCheckedOutlined sx={{ fontSize: "20px" }} />}
                    onChange={() => setAgree(!agree)}
                  />
                </Box>
                <Grid item xs>
                  <Typography sx={{ cursor: "pointer" }} onClick={() => setAgree(!agree)}>
                    <Trans>
                      I declare this is the original artwork and agree I won’t violate the intellectual property and
                      assume all consequences!
                    </Trans>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </MainCard>
    </CardContent1120>
  );
}
