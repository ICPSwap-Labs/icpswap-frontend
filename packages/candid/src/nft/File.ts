import type { Principal } from '@dfinity/principal';
export interface Chunk { 'content' : Array<number>, 'batch_id' : bigint }
export interface FileCanister {
  'addAdmin' : (arg_0: string) => Promise<boolean>,
  'chunkSize' : () => Promise<bigint>,
  'clearChunk' : () => Promise<boolean>,
  'commit_batch' : (
      arg_0: {
        'batch_id' : bigint,
        'content_type' : string,
        'chunk_ids' : Array<bigint>,
      },
    ) => Promise<undefined>,
  'create_batch' : () => Promise<{ 'batch_id' : bigint }>,
  'create_chunk' : (arg_0: Chunk) => Promise<{ 'chunk_id' : bigint }>,
  'cycleAvailable' : () => Promise<bigint>,
  'cycleBalance' : () => Promise<bigint>,
  'getAdminList' : () => Promise<Array<string>>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'http_request_streaming_callback' : (
      arg_0: StreamingCallbackToken,
    ) => Promise<StreamingCallbackHttpResponse>,
  'maxFileSize' : (arg_0: bigint) => Promise<Result>,
  'removeAdmin' : (arg_0: string) => Promise<boolean>,
}
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export interface _SERVICE extends FileCanister {}
