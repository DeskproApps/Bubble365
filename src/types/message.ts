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

export function isBubble365Message(parsedMsg: unknown): parsedMsg is Message<unknown> {
  const msg = parsedMsg as Message

  if (!msg)
    return false

  if (msg.protocol !== "bubble365")
    return false

  return msg.version === 1
}
