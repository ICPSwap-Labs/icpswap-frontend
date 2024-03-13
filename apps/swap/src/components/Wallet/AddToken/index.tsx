import { useState } from "react";
import AddTokenModal from "./modal";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";

export default function AddToken() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <AddIcon style={{ cursor: "pointer" }} onClick={() => setModalVisible(true)} />
      {modalVisible ? <AddTokenModal open={modalVisible} onClose={() => setModalVisible(false)} /> : null}
    </>
  );
}
