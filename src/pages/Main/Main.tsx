import React, {useCallback, useEffect, useRef} from "react"
import {
  useDeskproAppClient,
} from "@deskpro/app-sdk"
import {ParentIframeService} from "@/types/services/parentIframeService"

const BUBBLE_URL = import.meta.env.VITE_BUBBLE_URL as string

export const Main = () => {
  const {client} = useDeskproAppClient()
  const clientRef = useRef<typeof client | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const iframeServiceRef = useRef<ParentIframeService | null>(null)

  useEffect(() => {
    if (!client) return;

    clientRef.current = client;
    void client.run().catch(console.error);
  }, [client]);

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const service = new ParentIframeService(iframe, {
      onInitialized: () => {
        console.info("IframeService initialized")
      },
      onBadgeSet: (count) => {
        void clientRef.current?.setBadgeCount?.(count)
      },
      onWidgetSet: (visible) => {
        if (visible)
          clientRef.current?.focus()
        else
          clientRef.current?.unfocus()
      },
      onHyperlinkOpen: (url, target) => {
        if (url.includes("deskpro.com/app") || url.includes("deskprotesting.com/app")) {
            window.parent.location.replace(url)
            return
        }
        window.open(url, target ?? "_blank")
      }},
    {
      override_hyperlink_open: true
    }
  )

    iframeServiceRef.current = service

    return () => {
      service.destroy?.()
      iframeServiceRef.current = null
    }
  }, [])

  // Not used, since there is no easy click to dial functionality in Deskpro yet.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startCall = useCallback(async () => {
    const service = iframeServiceRef.current
    if (!service) return

    const response = await service.sendRequest<
      { number: string },
      { success: boolean; error?: string }
    >("call", "start", {number: "+31201234567"})

    if (response.payload?.success) {
      console.log("Call started:", response.payload)
    } else {
      console.error("Call failed:", response.payload?.error)
    }
  }, [])

  return (
    <div className="root">
      <iframe
        ref={iframeRef}
        title="Bubble365"
        src={BUBBLE_URL}
        className="iframe"
      />
    </div>
  )
}
