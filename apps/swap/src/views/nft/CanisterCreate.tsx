import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Box, InputAdornment } from "components/Mui";
import { MainCard, Breadcrumbs, AuthButton } from "components/index";
import Upload, { UploadRef } from "components/NFT/Upload";
import { WRAPPED_ICP_TOKEN_INFO, SOCIAL_LINKS, NFTCanisterController, NFTTradeTokenCanisterId } from "constants/index";
import { createCanister, setCanisterLogo, useNFTMintInfo, setCanisterLogoInController } from "hooks/nft/useNFTCalls";
import { useErrorTip } from "hooks/useTips";
import CanisterCreateConfirm from "components/NFT/CanisterCreateConfirm";
import { useSelectedCanistersManager } from "store/nft/hooks";
import FilledTextField, { FilledTextFiledMenus, FilledTextFieldLabel } from "components/Input/FilledTextField";
import { Identity as TypeIdentity, CanisterCreateDetails } from "types/index";
import { MuiSlider } from "components/Slider/MuiSlider/Marks";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { BigNumber, parseTokenAmount, isValidUrl, numberToString } from "@icpswap/utils";
import { useApprove } from "hooks/token/useApprove";
import { useAccount } from "store/auth/hooks";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { getLocaleMessage } from "i18n/service";
import { CardContent1120 } from "components/Layout/CardContent1120";
import { useTranslation } from "react-i18next";

export default function NFTCanisterCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const account = useAccount();

  const [values, setValues] = useState<CanisterCreateDetails>({} as CanisterCreateDetails);
  const [openErrorTip] = useErrorTip();
  const [canisterId, setCanisterId] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [, setSelectedCanisters] = useSelectedCanistersManager();
  const uploadRef = useRef<UploadRef>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const { result: NFTMintInfo } = useNFTMintInfo();

  const onFieldChange = (value: string, field: string) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const onSocialMediaLinkChange = (value: string, index: number) => {
    const socialMediaLinks = [...(values.socialMediaLinks ?? [])];

    if (socialMediaLinks.find((media) => media.label === value)) return;

    if (socialMediaLinks[index]) {
      socialMediaLinks.splice(index, 1, { label: value, value: socialMediaLinks[index].value });
    } else {
      socialMediaLinks[index] = { label: value, value: "" };
    }

    setValues({
      ...values,
      socialMediaLinks,
    });
  };

  const handleFileUploaded = ({ file_path }: { file_path: string }) => {
    setValues({
      ...values,
      image: file_path,
    });
  };

  const approve = useApprove();

  const handleMint = async (identity: TypeIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading) return;

    const { status: approveStatus } = await approve({
      canisterId: NFTTradeTokenCanisterId,
      spender: NFTCanisterController,
      account,
      value: numberToString(parseTokenAmount((NFTMintInfo ?? [])[0] ?? 0, WRAPPED_ICP_TOKEN_INFO.decimals)),
    });

    if (approveStatus === "err") {
      openErrorTip(t`Failed to approve, please try again.`);
      return;
    }

    const { status, data, message } = await createCanister({
      name: values.name,
      ownerName: values.minter,
      introduction: values.introduction,
      royalties: BigInt(new BigNumber(values.royalties).multipliedBy(100).toString()),
      image: "",
      linkMap: (values.socialMediaLinks ?? []).reduce(
        (previousValue, currentValue) => {
          if (currentValue.label && currentValue.value) {
            return [...previousValue, { k: currentValue.label, v: currentValue.value }];
          }
          return [...previousValue];
        },
        [] as { k: string; v: string }[],
      ),
    });

    if (status === "ok") {
      if (data) {
        setSelectedCanisters([data]);

        setCanisterId(data);

        const { filePath } = (await uploadRef.current?.uploadCb()) ?? {};

        if (filePath) await setCanisterLogo(data, filePath);
        if (filePath) await setCanisterLogoInController(data, filePath);
      }

      history.push("/info-tools/nft/canister/list");
    } else {
      openErrorTip(getLocaleMessage(message) ?? t`Failed to create NFT collection`);
    }

    closeLoading();
  };

  const handleSocialMediaAdd = () => {
    if ((values.socialMediaLinks ?? []).length >= 10) return;
    setValues({
      ...values,
      socialMediaLinks: [...(values.socialMediaLinks ?? []), { label: "", value: "" }],
    });
  };

  const handleMediaDelete = (index: number) => {
    const socialMediaLinks = [...(values.socialMediaLinks ?? [])];

    if (socialMediaLinks[index]) {
      socialMediaLinks.splice(index, 1);
    }

    setValues({
      ...values,
      socialMediaLinks,
    });
  };

  const handleMediaInput = (value: string, index: number) => {
    const socialMediaLinks = [...(values.socialMediaLinks ?? [])];

    if (socialMediaLinks[index]) {
      socialMediaLinks.splice(index, 1, { label: socialMediaLinks[index].label, value });
    }

    setValues({
      ...values,
      socialMediaLinks,
    });
  };

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  const handleFileError = (fileError: string) => {
    setFileError(fileError);
  };

  const getErrorMsg = (values: CanisterCreateDetails) => {
    if (!values.name) return t("nft.enter.collection.name");
    if (values.name && values.name.toLocaleLowerCase().includes("icpswap")) return t`Invalid collection name`;
    if (!values.minter) return t`Enter the creator`;
    if (values.minter && values.minter.toLocaleLowerCase().includes("icpswap")) return t`Invalid collection creator`;
    if (!values.introduction) return t`Enter the description`;
    if ((values.socialMediaLinks ?? []).length > 0) {
      for (let i = 0; i < values.socialMediaLinks.length; i++) {
        if (!isValidUrl(values.socialMediaLinks[i].value)) {
          return t`Media link must start with http or https`;
        }
      }
    }
    if (fileError) return t`File error`;
    if (!file) return t`Upload collection avatar`;
    if (!values.royalties && String(values.royalties) !== "0") return t`Select the creator royalties`;
    return undefined;
  };

  const errorMsg = getErrorMsg(values);

  const isExistInSocialLinks = (value: FilledTextFiledMenus) => {
    return (values.socialMediaLinks ?? []).findIndex((social) => social.label === value.value) !== -1;
  };

  return (
    <CardContent1120>
      <Breadcrumbs
        prevLabel={t("nft.canister.list")}
        currentLabel={t("nft.create.canister")}
        prevLink="/info-tools/nft/canister/list"
      />

      <MainCard sx={{ margin: "16px 0 0 0" }}>
        <Grid container justifyContent="center">
          <Box
            sx={{
              maxWidth: "474px",
              width: "100%",
            }}
          >
            <Typography sx={{ margin: "28px 0 0 0", fontSize: "20px", fontWeight: 700, color: "text.primary" }}>
              {t("nft.create.canister")}
            </Typography>

            <Box mt="32px">
              <FilledTextField
                label={t("nft.collection.name")}
                labelSize="16px"
                required
                fullWidth
                border="none"
                placeholder={t("nft.create.collection.name.placeholder")}
                onChange={(value: string) => onFieldChange(value, "name")}
                placeholderSize="16px"
                fontSize="16px"
                textFieldProps={{
                  slotProps: {
                    input: {
                      disableUnderline: true,
                      inputProps: {
                        maxLength: 50,
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box mt={3}>
              <FilledTextField
                label={t("nft.collection.description")}
                labelSize="16px"
                required
                fullWidth
                multiline
                rows={4}
                fontSize="16px"
                border="none"
                placeholderSize="16px"
                placeholder={t`Enter the canister description`}
                onChange={(value: string) => onFieldChange(value, "introduction")}
                textFieldProps={{
                  slotProps: {
                    input: {
                      disableUnderline: true,
                      inputProps: {
                        maxLength: 500,
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box mt={3}>
              <FilledTextField
                label={t("common.creator")}
                labelSize="16px"
                required
                fullWidth
                border="none"
                fontSize="16px"
                placeholderSize="16px"
                placeholder={t`Enter the creator`}
                onChange={(value: string) => onFieldChange(value, "minter")}
                textFieldProps={{
                  slotProps: {
                    input: {
                      disableUnderline: true,
                      inputProps: {
                        maxLength: 50,
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box mt={3}>
              <Grid container>
                <Grid item xs>
                  <Typography component="span" fontSize="16px">
                    {t("common.social.media.links")}
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
                    onClick={handleSocialMediaAdd}
                  >
                    <AddIcon fontSize="small" />
                    <Typography color="text.primary">{t("common.add")}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Box mt={2}>
                {(values.socialMediaLinks ?? []).map((socialMediaLink, index) => (
                  <Grid
                    container
                    key={socialMediaLink.label ? socialMediaLink.label : index}
                    sx={{
                      marginBottom: "10px",
                      "&:last-child": {
                        marginBottom: "0px",
                      },
                    }}
                  >
                    <Box mr="10px" sx={{ width: "145px" }}>
                      <FilledTextField
                        select
                        border="none"
                        placeholder={t`Media`}
                        value={socialMediaLink.label}
                        onChange={(value) => onSocialMediaLinkChange(value, index)}
                        menus={SOCIAL_LINKS}
                        menuDisabled={(value: FilledTextFiledMenus) => isExistInSocialLinks(value)}
                      />
                    </Box>
                    <Grid item xs>
                      <FilledTextField
                        border="none"
                        fullWidth
                        placeholderSize="16px"
                        placeholder={t`Enter your link, e.g. https://yoursite.io`}
                        onChange={(value: string) => handleMediaInput(value, index)}
                        textFieldProps={{
                          slotProps: {
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <HighlightOffIcon
                                    sx={{
                                      color: "#8492C4",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleMediaDelete(index)}
                                  />
                                </InputAdornment>
                              ),
                              disableUnderline: true,
                              inputProps: {
                                maxLength: 100,
                              },
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Box>

            <Box mt={3}>
              <FilledTextFieldLabel label={t("nft.upload.avatar")} labelSize="16px" required />

              <Box mt={2}>
                <Box
                  sx={{
                    height: "160px",
                  }}
                >
                  <Upload
                    ref={uploadRef}
                    onUploaded={handleFileUploaded}
                    maxSize={2 * 1024 * 1024}
                    types={["image"]}
                    accept=".jpeg, .png, .jpg, .gif, .apng"
                    placeholder={t`Upload collection avatar`}
                    uploadImmediately={false}
                    canisterId={canisterId}
                    onFileSelected={handleFileChange}
                    onFileError={handleFileError}
                    imageProps={{
                      style: {
                        maxWidth: 108,
                        maxHeight: 108,
                      },
                    }}
                  />
                </Box>
                <Box mt={1}>
                  <Typography>{t("nft.create.avatar.support")}</Typography>
                </Box>
              </Box>
            </Box>

            <Box mt={3}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FilledTextFieldLabel label={t("nft.create.royalty.fee")} labelSize="16px" required />

                {values.royalties || String(values.royalties) === "0" ? (
                  <Typography component="span" fontSize="16px">
                    : {values.royalties}%
                  </Typography>
                ) : null}
              </Box>

              <Box mt="30px">
                <MuiSlider
                  value={Number(values.royalties ?? 0)}
                  onChange={(event: any, value: string) => onFieldChange(value, "royalties")}
                  size="small"
                  min={0}
                  max={20}
                  step={0.1}
                  marks={[{ value: 0 }, { value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }]}
                />
              </Box>
            </Box>

            <Box mt={4}>
              <Typography variant="h3" align="center" color="textPrimary">
                Pay: {parseTokenAmount((NFTMintInfo ?? [])[0] ?? 0, WRAPPED_ICP_TOKEN_INFO.decimals).toNumber()}{" "}
                {WRAPPED_ICP_TOKEN_INFO.symbol}
              </Typography>
              <AuthButton
                fullWidth
                variant="contained"
                sx={{
                  marginTop: "20px",
                }}
                disabled={!!errorMsg}
                onClick={() => setConfirmModal(true)}
              >
                {errorMsg || t`Create`}
              </AuthButton>
            </Box>
          </Box>
        </Grid>
      </MainCard>

      {confirmModal ? (
        <Identity onSubmit={handleMint} fullScreenLoading>
          {({ submit }: CallbackProps) => (
            <CanisterCreateConfirm
              details={values}
              open={confirmModal}
              onClose={() => setConfirmModal(false)}
              onConfirm={submit}
              mintInfo={NFTMintInfo}
            />
          )}
        </Identity>
      ) : null}
    </CardContent1120>
  );
}
