import { useMemo, useState } from "react";
import { fileCanisterId, network, NETWORK, host } from "constants/index";
import { NFTCanister } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";

export interface UploadChunkRequest {
  batch_id: bigint;
  chunk: Blob;
  canisterId: string;
}

const uploadChunk = async ({ batch_id, chunk, canisterId }: UploadChunkRequest) => {
  return (await NFTCanister(canisterId, true)).create_chunk({
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
  canisterId: string;
};

export default function useFileUpload({ fileType }: { fileType: string }): [
  FileUploadResult,
  ({ file, canisterId }: UploadCallbackProps) => Promise<
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

  const fileUploadCallback = async ({ file, canisterId }: UploadCallbackProps) => {
    if (uploading) return;

    setUploading(true);

    const actor = await NFTCanister(canisterId, true);

    const result = resultFormat<{
      batch_id: bigint;
    }>(await actor.create_batch());

    const batch_id = result.data?.batch_id;

    if (!batch_id && batch_id !== BigInt(0)) {
      setFileError(`Failed to create batch${result.message ? `, ${result.message}` : ""}`);
      setUploading(false);
      return;
    }

    const promises: Promise<{ chunk_id: bigint }>[] = [];

    const chunkSize = 700000;

    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);

      promises.push(
        uploadChunk({
          batch_id,
          chunk,
          canisterId,
        }),
      );
    }

    const chunkIds = await Promise.all(promises).catch((err) => {
      console.error(err);
      setFileError(`Failed to upload, please try again`);
      setUploading(false);
    });

    if (!chunkIds) {
      setFileError(`Failed to upload, please try again`);
      setUploading(false);
      return;
    }

    await actor.commit_batch({
      batch_id,
      chunk_ids: chunkIds.map(({ chunk_id }) => chunk_id),
      content_type: file.type,
    });

    setUploading(false);

    const filePath =
      network === NETWORK.IC
        ? `https://${canisterId ?? fileCanisterId}.raw.icp0.io/${batch_id}`
        : network === NETWORK.LOCAL
        ? // TODO get from process port
          `http://localhost:3000/dfx_image/${batch_id}?canisterId=${canisterId ?? fileCanisterId}`
        : `${host}/${batch_id}?canisterId=${canisterId ?? fileCanisterId}`;

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
