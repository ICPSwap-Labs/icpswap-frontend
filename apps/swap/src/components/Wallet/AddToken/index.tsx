import { useState } from "react";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import AddTokenModal from "./modal";

export default function AddToken() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <AddIcon style={{ cursor: "pointer" }} onClick={() => setModalVisible(true)} />
      {modalVisible ? <AddTokenModal open={modalVisible} onClose={() => setModalVisible(false)} /> : null}
    </>
  );
}
