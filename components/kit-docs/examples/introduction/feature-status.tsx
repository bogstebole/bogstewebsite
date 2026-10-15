"use client";

import { InlineChatBanner, INLINE_CHAT_FEATURE_STATUS } from "inline-chat-kit/demo";

/** What the demo can actually do: the kit's own list, checked in a browser before it is written. */
export default function FeatureStatus() {
  return <InlineChatBanner status={INLINE_CHAT_FEATURE_STATUS} />;
}
