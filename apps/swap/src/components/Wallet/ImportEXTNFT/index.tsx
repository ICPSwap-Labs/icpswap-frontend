import { useState } from "react";
import { ImportNFTCanisterModal } from "./Modal";
import { ReactComponent as ImportIcon } from "assets/icons/import.svg";

export function ImportEXTNft() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <ImportIcon style={{ cursor: "pointer" }} onClick={() => setModalVisible(true)} />
      {modalVisible && <ImportNFTCanisterModal open={modalVisible} onClose={() => setModalVisible(false)} />}
    </>
  );
}
