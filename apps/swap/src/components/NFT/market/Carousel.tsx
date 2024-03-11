import { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import CarouselArrow from "assets/images/nft/CarouselArrow";
import { useMarketplaceRecommendCanisters } from "hooks/nft/tradeData";
import { useCanisterMetadata } from "hooks/nft/useNFTCalls";
import type { NFTControllerInfo } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import CollectionAvatar from "../CollectionAvatar";

const customizeTheme = createTheme({
  breakpoints: {
    values: {
      sm: 680,
      1200: 1200,
      md: 1400,
    },
  },
});

const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      width: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative",

      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },

    collections: {
      position: "relative",
      width: "100%",
      margin: "0 auto",
      overflow: "hidden",
      height: "338px",
    },

    collectionWrapper: {
      position: "absolute",
      width: "320px",
      height: "338px",
      left: "calc(50% - 160px)",
      overflow: "hidden",
      filter: "brightness(90%)",

      [customizeTheme.breakpoints.down("1200")]: {
        "&.diff0": {
          filter: "brightness(100%)",
          "& .collection": {
            height: "258px",
          },
          "& .avatarWrapper": {
            height: "190px",
          },
        },

        "&.diff1": {
          "& .collection": {
            height: "298px",
          },
          "& .avatarWrapper": {
            height: "230px",
          },
        },

        "&.diff2": {
          "& .collection": {
            height: "258px",
          },
          "& .avatarWrapper": {
            height: "190px",
          },
        },
      },

      "& .collection": {
        height: "258px",
      },

      "& .avatarWrapper": {
        height: "190px",
      },

      "&.diff0": {
        filter: "brightness(100%)",
        "& .collection": {
          height: "338px",
        },
        "& .avatarWrapper": {
          height: "270px",
        },
      },

      "&.diff1": {
        "& .collection": {
          height: "298px",
        },
        "& .avatarWrapper": {
          height: "230px",
        },
      },

      "&.diff2": {
        "& .collection": {
          height: "258px",
        },
        "& .avatarWrapper": {
          height: "190px",
        },
      },
    },
    arrow: {
      position: "absolute",
      top: "50%",
      zIndex: 100,
      cursor: "pointer",
    },
    leftArrow: {
      left: "0",
      transform: "translate(0, -50%)",
    },
    rightArrow: {
      right: "0",
      transform: "translate(0, -50%) rotate(180deg)",
    },

    collection: {
      background: "#fff",
      borderRadius: "12px",
      padding: "4px",
      width: "100%",
      cursor: "pointer",
    },

    avatarWrapper: {
      borderRadius: "12px",
      width: "312px",
      height: "270px",
      position: "relative",
    },

    viewAll: {
      marginTop: "32px",
      width: "260px",
      height: "48px",
      background: theme.colors.secondaryMain,
      borderRadius: "12px",
      margin: "0 auto",
      cursor: "pointer",
    },
  };
});

export function ViewAllArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2448 2.15039H3.1607V0.650391H13.0598H13.8098V1.40039V11.2995H12.3098V3.20677L2.92004 12.5965L1.85938 11.5358L11.2448 2.15039Z"
        fill="white"
      />
    </svg>
  );
}

export function Collection({ collection }: { collection: NFTControllerInfo }) {
  const classes = useStyles();
  const { result: metadata } = useCanisterMetadata(collection.cid);

  return (
    <Box className={`${classes.collection} collection`}>
      <Box className={`${classes.avatarWrapper} avatarWrapper`}>
        <CollectionAvatar metadata={metadata} />
      </Box>

      <Typography
        color="text.level1"
        fontWeight="600"
        align="center"
        fontSize="20px"
        sx={{
          marginTop: "18px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          whiteSpace: "nowrap",
        }}
      >
        {collection.name}
      </Typography>
    </Box>
  );
}

export default function MarketCarousel() {
  const classes = useStyles();
  const history = useHistory();

  const { result } = useMarketplaceRecommendCanisters(0, 100);

  const collections = useMemo(() => {
    if (result && result.content) return result.content;
    return [];
  }, [result]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(false);

  useEffect(() => {
    if (!initialIndex && collections.length) {
      setActiveIndex(parseInt(String(collections.length / 2 + 1)) - 1);
    }
  }, [initialIndex, setActiveIndex, setInitialIndex, collections]);

  const handleLeftArrowClick = () => {
    if (activeIndex - 1 < 0) {
      setActiveIndex(collections.length - 1);
    } else {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleRightArrowClick = () => {
    if (activeIndex + 1 >= collections.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const displayedArray = useMemo(() => {
    if (activeIndex === 1) {
      return [collections.length - 1, 0, 1, 2, 3];
    }

    if (activeIndex === 0) {
      return [collections.length - 2, collections.length - 1, 0, 1, 2];
    }

    if (activeIndex === collections.length - 2) {
      return [activeIndex - 2, activeIndex - 1, activeIndex, activeIndex + 1, 0];
    }

    if (activeIndex === collections.length - 1) {
      return [activeIndex - 2, activeIndex - 1, activeIndex, 0, 1];
    }

    return [activeIndex - 2, activeIndex - 1, activeIndex, activeIndex + 1, activeIndex + 2];
  }, [activeIndex]);

  const handleCollectionClick = (collection: NFTControllerInfo) => {
    history.push(`/marketplace/NFT/${collection.cid}`);
  };

  const handleLoadCollections = () => {
    history.push(`/marketplace/collections`);
  };

  return (
    <Box mt="30px">
      <Box className={classes.container}>
        <Box className={classes.collections}>
          {collections.map((collection, index) => {
            const diff = displayedArray.indexOf(index) - displayedArray.indexOf(activeIndex);
            const absDiff = Math.abs(diff);
            const isActive = activeIndex === index;
            const transformX = diff * 320 - 60 * diff;

            return (
              <Grid
                container
                alignItems="center"
                key={index}
                className={`${classes.collectionWrapper} diff${absDiff}`}
                sx={{
                  transform: isActive ? `translateX(0px)` : `translateX(${transformX}px)`,
                  transition: "all 500ms",
                  zIndex: isActive ? 100 : 100 - absDiff,
                  visibility: displayedArray.includes(index) ? "visible" : "hidden",
                }}
                onClick={() => handleCollectionClick(collection)}
              >
                <Collection collection={collection} />
              </Grid>
            );
          })}
        </Box>

        <Box className={`${classes.leftArrow} ${classes.arrow}`} onClick={handleLeftArrowClick}>
          <CarouselArrow />
        </Box>
        <Box className={`${classes.rightArrow} ${classes.arrow}`} onClick={handleRightArrowClick}>
          <CarouselArrow />
        </Box>
      </Box>

      <Grid
        className={classes.viewAll}
        container
        alignItems="center"
        justifyContent="center"
        onClick={handleLoadCollections}
      >
        <Typography color="text.primary" fontSize="18px" fontWeight="600" sx={{ marginRight: "10px" }}>
          <Trans>View All</Trans>
        </Typography>
        <ViewAllArrow />
      </Grid>
    </Box>
  );
}
