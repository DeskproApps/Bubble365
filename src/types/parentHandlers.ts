export type ParentHandlers = {
  onInitialized?: () => void;
  onBadgeSet?: (count: number) => void;
  onWidgetSet?: (visible?: boolean) => void;
  onHyperlinkOpen?: (url: string, target?: "_blank" | "_self", button?: unknown) => void;
};
