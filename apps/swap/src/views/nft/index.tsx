import { useState } from "react";
import MarketWrapper, { Pages, MarketPageConfig } from "components/NFT/market/MarketWrapper";
import MarketCarousel from "components/NFT/market/Carousel1";

export default function NFTMarketplace() {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<null | string>("time");
  const [pageConfig, setPageConfig] = useState<MarketPageConfig>(Pages[0]);

  const handlePageChange = (page: MarketPageConfig) => {
    setPageConfig(page);
  };

  const getComponent = () => {
    const Component = pageConfig.component;
    return <Component searchValue={searchValue} sortBy={sortBy} />;
  };

  return (
    <MarketWrapper
      defaultSortBy={sortBy}
      onSearchValueChange={setSearchValue}
      onSortByChange={setSortBy}
      onPageChange={handlePageChange}
      title={<MarketCarousel />}
    >
      {getComponent()}
    </MarketWrapper>
  );
}
