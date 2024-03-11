import { useState } from "react";
import MarketWrapper, { Pages, MarketPageConfig } from "components/NFT/market/MarketWrapper";
import { useParams } from "react-router-dom";
import CollectionInfo from "components/NFT/market/CollectionInfo";

export default function NFTCollectionMarketplace() {
  const { canisterId } = useParams<{ canisterId: string }>();
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<null | string>("price");
  const [pageConfig, setPageConfig] = useState<MarketPageConfig>(Pages[0]);

  const handlePageChange = (page: MarketPageConfig) => {
    setPageConfig(page);
  };

  const getComponent = () => {
    const Component = pageConfig.component;
    return <Component searchValue={searchValue} sortBy={sortBy} canisterId={canisterId} />;
  };

  return (
    <MarketWrapper
      defaultSortBy={sortBy}
      onSearchValueChange={setSearchValue}
      onSortByChange={setSortBy}
      onPageChange={handlePageChange}
      title={<CollectionInfo canisterId={canisterId} />}
    >
      {getComponent()}
    </MarketWrapper>
  );
}
