import { useMemo, useState } from "react";
import { network, NETWORK, host } from "constants/index";
import { t } from "@lingui/macro";
import { createVotingBatch, createVotingChunk, commitVotingChunk } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { useTips, MessageTypes } from "hooks/useTips";

export interface UploadChunkRequest {
  batch_id: bigint;
  chunk: Blob;
  canisterId: string;
  projectId: string;
}

const uploadChunk = async ({ batch_id, chunk, canisterId, projectId }: UploadChunkRequest) => {
  const { data } = await createVotingChunk(
    true,
    canisterId,
    {
      batch_id,
      content: [...new Uint8Array(await chunk.arrayBuffer())],
    },
    projectId,
  );

  return data;
};

export interface FileUploadResult {
  loading: boolean;
  error: string;
  data: { filePath: string; batchId: bigint };
}

export type UploadCallbackProps = {
  file: File;
  canisterId: string;
  projectId: string;
};

export default function useVotingImageUpload(): [
  FileUploadResult,
  ({ file, canisterId, projectId }: UploadCallbackProps) => Promise<
    | {
        filePath: string;
        batchId: bigint;
      }
    | undefined
  >,
] {
  const [openTip] = useTips();
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState<string>("");
  const [batchId, setBatchId] = useState<bigint>(BigInt(0));

  const fileUploadCallback = async ({ file, canisterId, projectId }: UploadCallbackProps) => {
    if (uploading) return;

    setUploading(true);

    const batchResult = (await createVotingBatch(true, canisterId, projectId)).data;

    if (!batchResult) {
      setUploading(false);
      return;
    }

    const { batch_id } = batchResult;

    const promises: Promise<{ chunk_id: bigint } | undefined>[] = [];

    const chunkSize = 700000;

    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);

      promises.push(
        uploadChunk({
          batch_id,
          chunk,
          canisterId,
          projectId,
        }),
      );
    }

    const chunkIds = await Promise.all(promises)
      .then((result) => {
        return (result.filter((ele) => !!ele?.chunk_id) as { chunk_id: bigint }[]).map((ele) => ele.chunk_id);
      })
      .catch((err) => {
        console.error(err);
        setFileError(t`Failed to upload, please try again`);
        setUploading(false);
        return undefined;
      });

    if (!chunkIds) {
      setUploading(false);
      return;
    }

    const { status, message } = await commitVotingChunk(
      true,
      canisterId,
      {
        batch_id,
        chunk_ids: chunkIds,
        content_type: file.type,
      },
      projectId,
    );

    if (status === ResultStatus.ERROR) {
      openTip(t`Failed to upload: ${message}`, MessageTypes.error);
      setUploading(false);
      return;
    }

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

    return { filePath, batchId };
  };

  return useMemo(
    () => [
      {
        loading: uploading,
        error: fileError,
        data: { filePath, batchId },
      },
      fileUploadCallback,
    ],
    [uploading, filePath, batchId, fileUploadCallback],
  );
}
