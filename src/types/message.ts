import {PostMessageChannel} from "@/types/services/parentIframeService"

export interface Message<TPayload = unknown> {
  protocol: "bubble365";
  version: 1;
  id: string;
  response_id: string | null;
  channel: PostMessageChannel;
  cmd: string;
  payload?: TPayload;
}
