import {Message} from "@/types/message"
import {ParentHandlers} from "@/types/parentHandlers"

export type PostMessageChannel = "initialize" | "call" | "badge" | "widget" | "hyperlink";

export type Settings = { override_hyperlink_open: boolean };
export type BadgeSetPayload = { count: number };
export type FocusPayload = { visible?: boolean };
export type HyperlinkOpenPayload = { url: string; target?: "_blank" | "_self"; button?: unknown };

export class ParentIframeService {
  private iframe: HTMLIFrameElement
  private pending = new Map<string, (msg: Message<unknown>) => void>()
  private handlers: ParentHandlers
  private readonly boundOnMessage: (event: MessageEvent) => void
  private readonly settings: Settings
  private readonly bubbleOrigin: string

  constructor(iframe: HTMLIFrameElement, handlers: ParentHandlers, settings: Settings) {
    const bubbleUrl = import.meta.env.VITE_BUBBLE_URL
    this.bubbleOrigin = new URL(bubbleUrl, window.location.href).origin

    this.iframe = iframe
    this.handlers = handlers
    this.settings = settings

    console.debug("[ParentIframeService] starting service..")

    this.boundOnMessage = this.onMessage.bind(this)
    window.addEventListener("message", this.boundOnMessage)
  }

  public sendMessage<TPayload>(channel: PostMessageChannel, cmd: string, payload?: TPayload, response_id?: string | null): void {
    const message = this.createMessage(channel, cmd, payload, response_id)
    console.debug("[ParentIframeService] Post message", message)
    this.iframe.contentWindow?.postMessage(JSON.stringify(message), this.bubbleOrigin)
  }

  public sendRequest<TRequest, TResponse>(
    channel: PostMessageChannel,
    cmd: string,
    payload?: TRequest,
    timeoutMs = 8000,
  ): Promise<Message<TResponse>> {
    const request = this.createMessage(channel, cmd, payload, null)

    return new Promise<Message<TResponse>>((resolve, reject) => {
      const timeoutHandle = window.setTimeout(() => {
        this.pending.delete(request.id)
        reject(new Error(`Timeout waiting for response to ${channel}/${cmd}`))
      }, timeoutMs)

      this.pending.set(request.id, (msg) => {
        window.clearTimeout(timeoutHandle)
        resolve(msg as Message<TResponse>)
      })

      this.iframe.contentWindow?.postMessage(JSON.stringify(request), this.bubbleOrigin)
    })
  }

  public destroy(): void {
    window.removeEventListener("message", this.boundOnMessage)

    // Reject all pending requests.
    for (const [id] of this.pending.entries()) {
      this.pending.delete(id)
    }
  }

  private createMessage<TPayload>(
    channel: PostMessageChannel,
    cmd: string,
    payload?: TPayload,
    responseId?: string | null,
  ): Message<TPayload> {
    return {
      protocol: "bubble365",
      version: 1,
      channel,
      cmd,
      id: crypto.randomUUID(),
      response_id: responseId ?? null,
      payload,
    }
  }

  private onMessage(event: MessageEvent): void {
    if (typeof event.data !== "string") return
    if (event.origin !== this.bubbleOrigin) return
    if (event.source !== this.iframe.contentWindow) return

    console.debug("[ParentIframeService] Received message", event.data)

    let parsed: unknown
    try {
      parsed = JSON.parse(event.data)
    } catch (error) {
      console.error("[ParentIframeService] Dropped message", { event: event.data, error })
      return
    }

    const msg = parsed as Message<unknown>
    if (!msg || msg.protocol !== "bubble365" || msg.version !== 1) return

    // response to a request
    if (msg.response_id && this.pending.has(msg.response_id)) {
      const resolver = this.pending.get(msg.response_id)!
      this.pending.delete(msg.response_id)
      resolver(msg)
      return
    }

    if (msg.channel === "initialize" && msg.cmd === 'request') {
      this.sendMessage("initialize", "request",
        {
          success: true,
          settings: this.settings,
        },
        msg.id)

      this.handlers.onInitialized?.()
      return
    }

    if (msg.channel === "badge" && msg.cmd === "set") {
      const payload = msg.payload as Partial<BadgeSetPayload> | undefined
      const count = typeof payload?.count === "number" ? payload.count : 0
      this.handlers.onBadgeSet?.(count)
      return
    }

    if (msg.channel === "widget" && msg.cmd === "set") {
      const payload = msg.payload as Partial<FocusPayload> | undefined
      this.handlers.onWidgetSet?.(payload?.visible)
      return
    }

    if (msg.channel === "hyperlink" && msg.cmd === "open" && msg.response_id === null) {
      this.handleHyperlinkOpenRequest(msg)
      return
    }
  }

  private handleHyperlinkOpenRequest(request: Message<unknown>): void {
    const payload = request.payload as Partial<HyperlinkOpenPayload> | undefined
    const url = typeof payload?.url === "string" ? payload.url : ""
    const target = payload?.target === "_self" ? "_self" : "_blank"
    const button = payload?.button

    this.handlers.onHyperlinkOpen?.(url, target, button)
  }
}
