"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { Button, SystemMessage, announce } from "inline-chat-kit";

type Status = "offline" | "reconnecting" | "online";

/**
 * The message has no button of its own, so the host puts one under it. Once
 * the connection is back, a second line is added rather than the first one
 * removed: the transcript records what happened, it does not edit it.
 */
export default function SystemMessageWithAction() {
  const [status, setStatus] = useState<Status>("offline");

  useEffect(() => {
    if (status !== "reconnecting") return;
    const timer = window.setTimeout(() => {
      setStatus("online");
      // SystemMessage is not a live region, so whoever adds one says it out loud.
      announce("Back online.");
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <SystemMessage tone="danger">Lost the connection. Nothing since your last message was saved.</SystemMessage>

      {status === "online" ? (
        <SystemMessage>Back online. Everything from here on is saved again.</SystemMessage>
      ) : (
        <div>
          <Button
            variant="outline"
            icon={<RotateCw size={14} aria-hidden />}
            loading={status === "reconnecting"}
            onClick={() => setStatus("reconnecting")}
          >
            Reconnect
          </Button>
        </div>
      )}
    </div>
  );
}
