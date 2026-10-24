import "server-only";
import { createDecipheriv, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { TripUpContent } from "@/components/tripup/types";

// The TripUp case study is committed only in encrypted form (content/tripup/,
// written by scripts/tripup-seal.mjs). It's opened here, on the server, with
// TRIPUP_CONTENT_KEY, and only after the password check has passed.
// Without the key nothing opens: the page shows no content at all.
//
// A sealed file is: 12-byte IV, 16-byte GCM tag, then the ciphertext
// (AES-256-GCM, with "tripup:<name>" as associated data, so a file can't be
// swapped for another). Keep this in step with the seal script.

const DIR = path.join(process.cwd(), "content", "tripup");
const IV_BYTES = 12;
const TAG_BYTES = 16;

function contentKey(): Buffer | null {
  const raw = process.env.TRIPUP_CONTENT_KEY;
  if (!raw) return null;
  const key = Buffer.from(raw, "base64");
  return key.length === 32 ? key : null;
}

/** The sealed file's name for a media file: says nothing about what's in it. */
const mediaId = (key: Buffer, name: string) =>
  createHmac("sha256", key).update(`media:${name}`).digest("hex").slice(0, 32);

function open(sealed: Buffer, key: Buffer, name: string): Buffer {
  const iv = sealed.subarray(0, IV_BYTES);
  const tag = sealed.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(`tripup:${name}`));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(sealed.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]);
}

/** The case study's text and layout, or null if it can't be opened. */
export async function loadTripUpContent(): Promise<TripUpContent | null> {
  const key = contentKey();
  if (!key) return null;
  try {
    const sealed = await readFile(path.join(DIR, "content.enc"));
    return JSON.parse(open(sealed, key, "content.json").toString("utf8")) as TripUpContent;
  } catch {
    return null;
  }
}

const MEDIA_NAME = /^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp|gif|mp4|webm)$/i;

/** One media file, decrypted, or null if there's no such file or no key. */
export async function loadTripUpMedia(name: string): Promise<Buffer | null> {
  const key = contentKey();
  if (!key || !MEDIA_NAME.test(name)) return null;
  try {
    const sealed = await readFile(path.join(DIR, "media", `${mediaId(key, name)}.enc`));
    return open(sealed, key, name);
  } catch {
    return null;
  }
}
