import { encodeTokenIdentifier } from "./index";

function icpbunnyimg(i: number) {
  const icbstorage = [
    "efqhu-yqaaa-aaaaf-qaeda-cai",
    "ecrba-viaaa-aaaaf-qaedq-cai",
    "fp7fo-2aaaa-aaaaf-qaeea-cai",
    "fi6d2-xyaaa-aaaaf-qaeeq-cai",
    "fb5ig-bqaaa-aaaaf-qaefa-cai",
    "fg4os-miaaa-aaaaf-qaefq-cai",
    "ft377-naaaa-aaaaf-qaega-cai",
    "fu2zl-ayaaa-aaaaf-qaegq-cai",
    "f5zsx-wqaaa-aaaaf-qaeha-cai",
    "f2yud-3iaaa-aaaaf-qaehq-cai",
  ];

  return "https://" + icbstorage[i % 10] + ".raw.icp0.io/Token/" + i;
}

export function extNFTImage(
  collection: string,
  index: number,
  id: string,
  fullSize: boolean,
  ref: string = "",
  cachePriority: number = 10,
) {
  const _ref = "?" + ref;

  if (collection === "4ggk4-mqaaa-aaaae-qad6q-cai" && fullSize == false) {
    return (
      "https://images.entrepot.app/t/dexpm-6aaaa-aaaal-qbgrq-cai/" +
      encodeTokenIdentifier("dexpm-6aaaa-aaaal-qbgrq-cai", index) +
      _ref +
      "&cache=" +
      cachePriority
    );
  }

  if (collection === "jeghr-iaaaa-aaaah-qco7q-cai")
    return "https://fl5nr-xiaaa-aaaai-qbjmq-cai.raw.icp0.io/nft/" + index;
  if (collection === "bxdf4-baaaa-aaaah-qaruq-cai")
    return "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.icp0.io/Token/" + index;
  if (collection === "y3b7h-siaaa-aaaah-qcnwa-cai")
    return "https://4nvhy-3qaaa-aaaah-qcnoq-cai.raw.icp0.io/Token/" + index;
  if (collection === "3db6u-aiaaa-aaaah-qbjbq-cai")
    return "https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.icp0.io?tokenId=" + index;
  if (collection === "q6hjz-kyaaa-aaaah-qcama-cai") return icpbunnyimg(index);
  if (collection === "pk6rk-6aaaa-aaaae-qaazq-cai") {
    if (fullSize) {
      return "https://" + collection + ".raw.icp0.io/?tokenid=" + id;
    } else {
      return "https://images.entrepot.app/t/7budn-wqaaa-aaaah-qcsba-cai/" + id;
    }
  }
  if (collection === "dhiaa-ryaaa-aaaae-qabva-cai") {
    if (fullSize) {
      return "https://" + collection + ".raw.icp0.io/?tokenid=" + id;
    } else {
      return "https://images.entrepot.app/tnc/qtejr-pqaaa-aaaah-qcyvq-cai/" + id;
    }
  }
  if (collection === "skjpp-haaaa-aaaae-qac7q-cai") {
    if (fullSize) {
      return "https://" + collection + ".raw.icp0.io/?tokenid=" + id;
    } else {
      return "https://images.entrepot.app/tnc/wtwf2-biaaa-aaaam-qauoq-cai/" + id;
    }
  }

  if (fullSize) {
    return "https://" + collection + ".raw.icp0.io/?cc=0&tokenid=" + id;
  } else {
    //add collections with wearables or other dynamic traits here
    //these images will not be cached
    if (collection === "7i54s-nyaaa-aaaal-abomq-cai ") {
      let cacheParam = (Math.random() + 1).toString(36).substring(7);
      return (
        "https://images.entrepot.app/t/7i54s-nyaaa-aaaal-abomq-cai /" +
        id +
        "?cache=" +
        cachePriority +
        "&cachebuster=" +
        cacheParam
      );
    }

    if (collection === "yrdz3-2yaaa-aaaah-qcvpa-cai")
      return "https://images.entrepot.app/tnc/" + collection + "/" + id + _ref;
    if (collection === "rw7qm-eiaaa-aaaak-aaiqq-cai")
      return "https://images.entrepot.app/tnc/" + collection + "/" + id + _ref;
    if (collection === "5movr-diaaa-aaaak-aaftq-cai")
      return "https://images.entrepot.app/tnc/" + collection + "/" + id + _ref;
    if (collection === "e3izy-jiaaa-aaaah-qacbq-cai")
      return "https://images.entrepot.app/tnc/" + collection + "/" + id + _ref;
    if (collection === "xjjax-uqaaa-aaaal-qbfgq-cai")
      return "https://images.entrepot.app/tnc/" + collection + "/" + id + _ref;

    //end of section
    if (collection === "6wih6-siaaa-aaaah-qczva-cai")
      return "https://" + collection + ".raw.icp0.io/?cc" + Date.now() + "&type=thumbnail&tokenid=" + id + _ref;
    if (collection === "kss7i-hqaaa-aaaah-qbvmq-cai")
      return "https://" + collection + ".raw.icp0.io/?type=thumbnail&tokenid=" + id;
    return "https://images.entrepot.app/t/" + collection + "/" + id + "?cache=" + cachePriority;
  }
}
