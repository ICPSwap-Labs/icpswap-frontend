import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Chunk { 'content' : Array<number>, 'batch_id' : bigint }
export interface FileCanister {
  'addAdmin' : ActorMethod<[string], boolean>,
  'chunkSize' : ActorMethod<[], bigint>,
  'clearChunk' : ActorMethod<[], boolean>,
  'commit_batch' : ActorMethod<
    [
      {
        'batch_id' : bigint,
        'content_type' : string,
        'chunk_ids' : Array<bigint>,
      },
      string,
    ],
    undefined
  >,
  'create_batch' : ActorMethod<[string], { 'batch_id' : bigint }>,
  'create_chunk' : ActorMethod<[Chunk, string], { 'chunk_id' : bigint }>,
  'cycleAvailable' : ActorMethod<[], NatResult>,
  'cycleBalance' : ActorMethod<[], NatResult>,
  'getAdminList' : ActorMethod<[], Array<string>>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'http_request_streaming_callback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackHttpResponse
  >,
  'maxFileSize' : ActorMethod<[bigint], TextResult>,
  'removeAdmin' : ActorMethod<[string], boolean>,
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
export type NatResult = { 'ok' : bigint } |
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
export type TextResult = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE extends FileCanister {}
