import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import VoiceRecorder from "../../examples/use-voice-input/recorder";

export const meta = {
  title: "useVoiceInput",
  description: "The microphone and everything around it: permission, recording, the level, the states. The kit records; you transcribe.",
};

export default function UseVoiceInputPage() {
  return (
    <>
      <DocHeader title="useVoiceInput" description={meta.description}>
        <ImportLine
          names={[
            "useVoiceInput",
            "type VoiceInput",
            "type VoiceState",
            "type TranscribeHandler",
            "type TranscribeContext",
            "type UseVoiceInputOptions",
          ]}
        />
      </DocHeader>

      <ComponentPreview file="use-voice-input/recorder.tsx" minHeight={240}>
        <VoiceRecorder />
      </ComponentPreview>
      <p>
        Nothing asks for the microphone until you press Record. This page has no transcriber behind it, so the handler
        reports what it was given. The recording itself is real.
      </p>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={["A composer of your own that should offer dictation, with the same states and wording as the kit's."]}
        avoid={[
          <>
            The kit&apos;s own composer. Pass <code>onTranscribe</code> to{" "}
            <DocLink to="components/chat-input">ChatInput</DocLink>,{" "}
            <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> or{" "}
            <DocLink to="components/chat-experience">ChatExperience</DocLink> and the microphone appears, wired to this
            hook. Leave it out and there is no microphone at all.
          </>,
        ]}
      />
      <p>
        <strong>The kit owns what is the same in every product; you own what differs.</strong> Permission,{" "}
        <code>MediaRecorder</code>, the level of the incoming signal and the states in between are identical wherever
        this ships. Turning audio into words is a choice (Whisper, Deepgram, a local model, your own endpoint) and a
        kit that chose one would be wrong for most of the people using it. So the hook hands you a <code>Blob</code> and
        takes text back.
      </p>
      <Callout title="What that costs">
        The browser&apos;s own <code>SpeechRecognition</code> cannot be used through this: it insists on holding the
        microphone itself and will not take a recording. It is the only free transcriber there is, and this design
        closes the door on it, deliberately, so every chat built on the kit behaves the same.
      </Callout>

      <H2 id="examples">Examples</H2>

      <H3 id="transcribe">A transcriber that streams</H3>
      <p>
        <code>onTranscribe</code> returns the same three shapes as <code>onSend</code>: a string, a promise of one, or an
        async iterable of deltas. Deltas accumulate, and <code>onTranscript</code> is called with the{" "}
        <strong>whole transcript so far</strong> each time it grows, so a long dictation appears as it is recognised,
        and you never have to remember where the last piece ended.
      </p>
      <Code
        code={`
const voice = useVoiceInput({
  onTranscribe: async function* (audio, { signal, mimeType }) {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "content-type": mimeType },
      body: audio,
      signal,
    });
    yield* response.body!.pipeThrough(new TextDecoderStream());
  },
  onTranscript: (text) => setDraft(before + text), // cumulative, not per delta
  onDone: (text) => console.log("final transcript", text),
});`}
      />
      <p>
        <code>mimeType</code> is what the recorder actually produced, which is not the same in every browser. Pass it
        on rather than assuming <code>audio/webm</code>. <code>signal</code> aborts when the reader cancels or the
        component goes away.
      </p>

      <H3 id="in-the-composer">In the kit&apos;s composer</H3>
      <p>
        With the kit&apos;s own composer there is nothing to call: give it the handler. The transcript is inserted at
        the caret, so dictating into a half-typed sentence finishes it rather than replacing it.
      </p>
      <Code code={`<ChatExperience onSend={send} onTranscribe={transcribe} />`} />

      <H3 id="meter">The level meter</H3>
      <p>
        Pass <code>meterRef</code> and the hook writes the incoming level onto that element as{" "}
        <code>--ick-voice-level</code>, from 0 to 1, once a frame. It is written straight to the element rather than
        returned as a number, because a value the component re-rendered on would be sixty renders a second for a
        decoration. Read it from CSS: the example draws <code>transform: scaleX(var(--ick-voice-level))</code>. Under{" "}
        <code>prefers-reduced-motion</code> the meter stays still and the state alone says it is listening.
      </p>

      <H2 id="states">States</H2>
      <PropsTable
        rows={[
          { name: "unsupported", type: "VoiceState", description: "No getUserMedia or MediaRecorder: an insecure context, or a browser without them. Do not offer the button." },
          { name: "idle", type: "VoiceState", description: "Ready. Nothing has been asked for yet." },
          { name: "requesting", type: "VoiceState", description: "The browser's permission prompt is up. The browser owns that dialog." },
          { name: "listening", type: "VoiceState", description: "Recording, and writing the level to the meter." },
          { name: "transcribing", type: "VoiceState", description: "Recording is over and your handler is working on it." },
          { name: "denied", type: "VoiceState", description: <>Refused. Not an error: the browser will not ask again on its own, so “try again” would send somebody to a button that cannot work. <code>reset()</code> offers the button again once they have changed the setting.</> },
          { name: "failed", type: "VoiceState", description: <>No microphone, one that would not open, or a handler that threw. <code>error</code> says which, in words safe to show.</> },
        ]}
      />
      <p>
        Each change is spoken through the kit&apos;s live region (listening, stopped, transcribing, nothing heard,
        transcript added, and the failures) in the strings of the <DocLink to="labels#groups">voice</DocLink> label
        group. A status line you draw beside the button should not be a live region of its own, or every state is said
        twice.
      </p>

      <H2 id="api">API</H2>

      <H3 id="options">Options</H3>
      <PropsTable
        rows={[
          {
            name: "onTranscribe",
            type: "TranscribeHandler",
            description: "Audio in, words out. Without it, a finished recording goes back to idle and nothing is transcribed.",
          },
          {
            name: "onTranscript",
            type: "(text: string) => void",
            description: "The transcript so far, every time it grows. Cumulative rather than per delta.",
          },
          { name: "onDone", type: "(text: string) => void", description: "Once, when a recording has been fully transcribed. Not called for an empty one." },
          {
            name: "meterRef",
            type: "RefObject<HTMLElement | null>",
            description: <>The element the level is written onto, as <code>--ick-voice-level</code>.</>,
          },
          {
            name: "labels",
            type: "Partial<VoiceLabels>",
            description: (
              <>
                What is said through the live region, and the errors it reports. A hook cannot read a{" "}
                <DocLink to="labels#provider">LabelsProvider</DocLink> rendered below it, so these come in here.
              </>
            ),
          },
        ]}
      />

      <H3 id="result">VoiceInput</H3>
      <PropsTable
        rows={[
          { name: "state", type: "VoiceState", description: "Where it is. See the table above." },
          { name: "supported", type: "boolean", description: "Whether a microphone can be asked for at all. False on the server and in an insecure context." },
          { name: "error", type: "string | null", description: "Why it failed, when it did. Safe to show." },
          { name: "start", type: "() => void", description: "Ask for the microphone and start recording." },
          { name: "stop", type: "() => void", description: "Stop recording and transcribe. While transcribing, cancels it instead." },
          { name: "toggle", type: "() => void", description: "Start from idle or failed; stop while requesting, listening or transcribing. What one button wants." },
          { name: "reset", type: "() => void", description: "Forget a refusal or an error, so the button can be offered again." },
        ]}
      />

      <H3 id="transcribe-handler">TranscribeHandler</H3>
      <Code
        code={`
type TranscribeHandler = (
  audio: Blob,
  context: TranscribeContext
) => string | Promise<string> | AsyncIterable<string>;

interface TranscribeContext {
  signal: AbortSignal; // aborts when the reader cancels, or the component goes away
  mimeType: string;    // what the recorder actually produced
}`}
      />
    </>
  );
}
