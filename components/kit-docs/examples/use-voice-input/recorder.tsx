"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { Button, useVoiceInput, type TranscribeHandler, type VoiceState } from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Stands in for a speech-to-text service, which this page does not have: it
 * reports what the kit handed over. A real one sends `audio` to a transcriber
 * and returns the words (as a string, a promise, or deltas).
 */
const transcribe: TranscribeHandler = async (audio, { mimeType }) => {
  await wait(800);
  return `Recorded ${(audio.size / 1024).toFixed(1)} KB of ${mimeType}. A transcriber would turn this into words.`;
};

const STATUS: Record<VoiceState, string> = {
  unsupported: "This browser cannot record here.",
  idle: "Nothing is recording. The browser asks for the microphone when you press the button.",
  requesting: "Waiting for the browser's permission prompt…",
  listening: "Listening. Press again to stop.",
  transcribing: "Transcribing…",
  denied: "The microphone is blocked. Allow it in the site settings, then try again.",
  failed: "Recording failed.",
};

export default function VoiceRecorder() {
  const [transcript, setTranscript] = useState("");
  const meterRef = useRef<HTMLDivElement>(null);
  const voice = useVoiceInput({
    onTranscribe: transcribe,
    onTranscript: setTranscript,
    // The incoming level is written onto this element as --ick-voice-level, 0 to 1. No re-render per frame.
    meterRef,
  });

  const recording = voice.state === "listening" || voice.state === "requesting";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          variant={recording ? "primary" : "outline"}
          icon={recording ? <Square size={14} aria-hidden /> : <Mic size={14} aria-hidden />}
          onClick={voice.toggle}
          disabled={!voice.supported || voice.state === "denied"}
        >
          {recording ? "Stop" : "Record"}
        </Button>
        {voice.state === "denied" && (
          <Button variant="ghost" onClick={voice.reset}>
            Try again
          </Button>
        )}
        <div
          ref={meterRef}
          aria-hidden
          style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            overflow: "hidden",
            background: "var(--ick-surface-active)",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--ick-marker)",
              transformOrigin: "left",
              transform: "scaleX(var(--ick-voice-level, 0))",
            }}
          />
        </div>
      </div>

      {/* Not a live region: the hook already speaks each state through the kit's own. */}
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--ick-ink-soft)" }}>
        {voice.state === "failed" && voice.error ? voice.error : STATUS[voice.state]}
      </p>

      {transcript && (
        <p
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.6,
            background: "var(--ick-surface-sunken)",
            color: "var(--ick-ink)",
          }}
        >
          {transcript}
        </p>
      )}
    </div>
  );
}
