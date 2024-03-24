import { useMemo, useState } from "react";
import { nftFile as fileActor } from "@icpswap/actor";
import { network, NETWORK, host } from "constants/index";
import { t } from "@lingui/macro";
import { Identity } from "types/index";

export interface UploadChunkRequest {
  batch_id: bigint;
  chunk: Blob;
  canisterId: string;
  identity?: Identity;
}

const uploadChunk = async ({ batch_id, chunk, canisterId, identity }: UploadChunkRequest) => {
  return (await fileActor(canisterId, identity)).create_chunk({
    batch_id,
    content: [...new Uint8Array(await chunk.arrayBuffer())],
  });
};

export interface FileUploadResult {
  loading: boolean;
  error: string;
  data: { filePath: string; batchId: bigint; fileType: string };
}

export type UploadCallbackProps = {
  file: File;
  identity?: Identity;
  canisterId: string;
};

export default function useFileUpload({ canisterId, fileType }: { canisterId: string; fileType: string }): [
  FileUploadResult,
  ({ file, identity, canisterId }: UploadCallbackProps) => Promise<
    | {
        filePath: string;
        batchId: bigint;
        fileType: string;
      }
    | undefined
  >,
] {
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState<string>("");
  const [batchId, setBatchId] = useState<bigint>(BigInt(0));

  const fileUploadCallback = async ({ file, identity, canisterId }: UploadCallbackProps) => {
    if (uploading) return;

    setUploading(true);

    const actor = await fileActor(canisterId, identity);

    const { batch_id } = await actor.create_batch();

    const promises: Promise<{ chunk_id: bigint }>[] = [];

    const chunkSize = 700000;

    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);

      promises.push(
        uploadChunk({
          batch_id,
          chunk,
          canisterId,
          identity,
        }),
      );
    }

    const chunkIds = await Promise.all(promises).catch((err) => {
      console.log(err);
      setFileError(t`Failed to upload, please try again`);
      setUploading(false);
    });

    if (!chunkIds) return;

    await actor.commit_batch({
      batch_id,
      chunk_ids: chunkIds.map(({ chunk_id }) => chunk_id),
      content_type: file.type,
    });

    setUploading(false);

    const filePath =
      network === NETWORK.IC
        ? `https://${canisterId}.raw.icp0.io/${batch_id}`
        : network === NETWORK.LOCAL
        ? // TODO get from process port
          `http://localhost:3000/dfx_image/${batch_id}?canisterId=${canisterId}`
        : `${host}/${batch_id}?canisterId=${canisterId}`;

    setFilePath(filePath);
    setBatchId(batch_id);

    return { filePath, batchId, fileType };
  };

  return useMemo(
    () => [
      {
        loading: uploading,
        error: fileError,
        data: { filePath, batchId, fileType },
      },
      fileUploadCallback,
    ],
    [uploading, filePath, batchId, fileUploadCallback, fileType],
  );
}
