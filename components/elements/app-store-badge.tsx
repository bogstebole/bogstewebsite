"use client";

import { ProjectTag } from "@/components/ui/project-tag";

interface AppStoreBadgeProps {
  active: boolean;
}

const APP_STORE_ICON = (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/images/app-store-icon.png"
    alt=""
    style={{
      flexShrink: 0,
      height: 16,
      objectFit: "cover",
      rotate: "6.64deg",
      transformOrigin: "50% 50%",
      width: 16,
    }}
  />
);

export function AppStoreBadge({ active }: AppStoreBadgeProps) {
  return (
    <ProjectTag
      label="App store"
      variant="glass"
      active={active}
      icon={APP_STORE_ICON}
    />
  );
}
