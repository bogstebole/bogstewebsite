/**
 * Every page in the inline-chat-kit docs, in the order the sidebar shows them.
 *
 * Paths are relative to the docs root (`/inline-chat-experience`), so the same
 * list serves the public site and the `/dive` review copy. `""` is the root.
 * The page each path renders is in `registry.ts`; this file stays free of
 * imports so the sidebar can read it on the client.
 */

export interface DocNavItem {
  path: string;
  title: string;
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}

export const DOCS_NAV: DocNavGroup[] = [
  {
    title: "Getting started",
    items: [
      { path: "", title: "Introduction" },
      { path: "status", title: "Status" },
      { path: "installation", title: "Installation" },
      { path: "usage", title: "Wiring a model" },
      { path: "theming", title: "Theming" },
      { path: "bring-your-own-button", title: "Bring your own button" },
      { path: "labels", title: "Labels" },
      { path: "nextjs", title: "Next.js" },
    ],
  },
  {
    title: "Assembly",
    items: [
      { path: "components/chat-experience", title: "ChatExperience" },
      { path: "components/chat-turn-row", title: "ChatTurnRow" },
      { path: "components/conversation", title: "Conversation" },
      { path: "components/chat-header", title: "ChatHeader" },
    ],
  },
  {
    title: "Input",
    items: [
      { path: "components/chat-input", title: "ChatInput" },
      { path: "components/attachments", title: "Attachments" },
    ],
  },
  {
    title: "Agent",
    items: [
      { path: "components/tool", title: "Tool" },
      { path: "components/reasoning", title: "Reasoning" },
      { path: "components/chain-of-thought", title: "ChainOfThought" },
      { path: "components/task-list", title: "TaskList" },
      { path: "components/approval", title: "Approval" },
      { path: "components/context", title: "Context" },
      { path: "components/sources", title: "Sources & InlineCitation" },
    ],
  },
  {
    title: "Questions",
    items: [
      { path: "components/question-card", title: "QuestionCard" },
      { path: "components/question-group", title: "QuestionGroup" },
    ],
  },
  {
    title: "Answer",
    items: [
      { path: "components/answer-actions", title: "AnswerActions" },
      { path: "components/branch", title: "Branch" },
      { path: "components/code-block", title: "CodeBlock" },
      { path: "components/artifact", title: "Artifact" },
      { path: "components/system-message", title: "SystemMessage" },
    ],
  },
  {
    title: "States",
    items: [
      { path: "components/empty-state", title: "EmptyState" },
      { path: "components/loader", title: "Loader" },
    ],
  },
  {
    title: "Surface",
    items: [
      { path: "components/text-highlighter", title: "TextHighlighter" },
      { path: "components/reply-thread-popup", title: "ReplyThreadPopup" },
      { path: "components/custom-cursor", title: "CustomCursor" },
    ],
  },
  {
    title: "Primitives",
    items: [
      { path: "components/button", title: "Button" },
      { path: "components/chip", title: "Chip" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { path: "hooks/use-chat-turns", title: "useChatTurns" },
      { path: "hooks/use-voice-input", title: "useVoiceInput" },
    ],
  },
];

export const DOCS_PAGES: DocNavItem[] = DOCS_NAV.flatMap((group) => group.items);

/** Where the docs live on the public site. Prefix with `useReviewBase()`. */
export const DOCS_ROOT = "/inline-chat-experience";

/** `""` → `/inline-chat-experience`, `"components/tool"` → `/inline-chat-experience/components/tool`. */
export function docsHref(base: string, path: string): string {
  return `${base}${DOCS_ROOT}${path ? `/${path}` : ""}`;
}
