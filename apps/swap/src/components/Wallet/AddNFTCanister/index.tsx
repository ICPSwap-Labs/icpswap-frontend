import { useState } from "react";
import AddNFTCanisterModal from "./Modal";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";

export default function AddNFTCanister() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <AddIcon style={{ cursor: "pointer" }} onClick={() => setModalVisible(true)} />
      {modalVisible && <AddNFTCanisterModal open={modalVisible} onClose={() => setModalVisible(false)} />}
    </>
  );
}
