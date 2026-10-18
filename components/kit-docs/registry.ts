import type { ComponentType } from "react";

/**
 * What a docs page module exports: the page, and the words that describe it
 * to a search engine and to the header above it.
 */
export interface DocPageModule {
  default: ComponentType;
  meta: { title: string; description: string };
}

/**
 * Path → page. Each entry is its own import, so a page's examples are only in
 * the bundle of the page that shows them. The order and the sidebar titles are
 * in `nav.ts`; every path there has an entry here.
 */
export const DOCS_REGISTRY: Record<string, () => Promise<DocPageModule>> = {
  "": () => import("./pages/introduction"),
  status: () => import("./pages/status"),
  installation: () => import("./pages/installation"),
  usage: () => import("./pages/usage"),
  theming: () => import("./pages/theming"),
  "bring-your-own-button": () => import("./pages/bring-your-own-button"),
  labels: () => import("./pages/labels"),
  nextjs: () => import("./pages/nextjs"),

  "components/chat-experience": () => import("./pages/components/chat-experience"),
  "components/chat-turn-row": () => import("./pages/components/chat-turn-row"),
  "components/conversation": () => import("./pages/components/conversation"),
  "components/chat-header": () => import("./pages/components/chat-header"),

  "components/chat-input": () => import("./pages/components/chat-input"),
  "components/attachments": () => import("./pages/components/attachments"),

  "components/tool": () => import("./pages/components/tool"),
  "components/reasoning": () => import("./pages/components/reasoning"),
  "components/chain-of-thought": () => import("./pages/components/chain-of-thought"),
  "components/task-list": () => import("./pages/components/task-list"),
  "components/approval": () => import("./pages/components/approval"),
  "components/context": () => import("./pages/components/context"),
  "components/sources": () => import("./pages/components/sources"),

  "components/question-card": () => import("./pages/components/question-card"),
  "components/question-group": () => import("./pages/components/question-group"),

  "components/answer-actions": () => import("./pages/components/answer-actions"),
  "components/branch": () => import("./pages/components/branch"),
  "components/code-block": () => import("./pages/components/code-block"),
  "components/artifact": () => import("./pages/components/artifact"),
  "components/system-message": () => import("./pages/components/system-message"),

  "components/empty-state": () => import("./pages/components/empty-state"),
  "components/loader": () => import("./pages/components/loader"),

  "components/text-highlighter": () => import("./pages/components/text-highlighter"),
  "components/reply-thread-popup": () => import("./pages/components/reply-thread-popup"),
  "components/custom-cursor": () => import("./pages/components/custom-cursor"),

  "components/button": () => import("./pages/components/button"),
  "components/chip": () => import("./pages/components/chip"),

  "hooks/use-chat-turns": () => import("./pages/hooks/use-chat-turns"),
  "hooks/use-voice-input": () => import("./pages/hooks/use-voice-input"),
};
