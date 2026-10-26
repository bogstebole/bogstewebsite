#!/usr/bin/env node
// Seals the TripUp case study for the public repo.
//
//   npm run tripup:seal
//
// The readable content lives only on this machine, in private/tripup/
// (gitignored):
//   private/tripup/content.json   all the text, links and the media list
//   private/tripup/media/         the pictures and videos it refers to
//
// This script encrypts them with TRIPUP_CONTENT_KEY (from .env.local) into
// content/tripup/, which is what gets committed:
//   content/tripup/content.enc
//   content/tripup/media/<opaque id>.enc   one per file the content uses
//
// To change the case study: edit private/tripup/, run this, commit
// content/tripup/. Files whose content didn't change keep their sealed copy,
// so the commit only holds what changed. Media no longer used is removed.
//
// A new key: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
// The same key must be set as TRIPUP_CONTENT_KEY wherever the site runs.

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const SRC = path.join("private", "tripup");
const OUT = path.join("content", "tripup");
const IV_BYTES = 12;
const TAG_BYTES = 16;

const fail = (message) => {
  console.error(`tripup:seal: ${message}`);
  process.exit(1);
};

const raw = process.env.TRIPUP_CONTENT_KEY;
if (!raw) fail("TRIPUP_CONTENT_KEY is not set (put it in .env.local).");
const key = Buffer.from(raw, "base64");
if (key.length !== 32) fail("TRIPUP_CONTENT_KEY must be 32 bytes, base64.");

const seal = (plain, name) => {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(`tripup:${name}`));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]);
};

const open = (sealed, name) => {
  const decipher = createDecipheriv("aes-256-gcm", key, sealed.subarray(0, IV_BYTES));
  decipher.setAAD(Buffer.from(`tripup:${name}`));
  decipher.setAuthTag(sealed.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
  return Buffer.concat([decipher.update(sealed.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]);
};

const mediaId = (name) => createHmac("sha256", key).update(`media:${name}`).digest("hex").slice(0, 32);

/** Writes the sealed file unless an existing one already holds exactly this. */
const write = (outFile, plain, name) => {
  if (fs.existsSync(outFile)) {
    try {
      if (open(fs.readFileSync(outFile), name).equals(plain)) return "unchanged";
    } catch {
      // Sealed with another key, or damaged: seal it again.
    }
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, seal(plain, name));
  return "sealed";
};

// ── The content ──
const contentFile = path.join(SRC, "content.json");
if (!fs.existsSync(contentFile)) fail(`${contentFile} is missing.`);
const plainContent = fs.readFileSync(contentFile);
let content;
try {
  content = JSON.parse(plainContent.toString("utf8"));
} catch (e) {
  fail(`${contentFile} is not valid JSON: ${e.message}`);
}
for (const field of ["hero", "links", "sections", "coverage", "perf", "end"]) {
  if (!(field in content)) fail(`${contentFile} has no "${field}".`);
}

// ── The media it uses ──
const used = new Set();
if (content.hero.icon) used.add(content.hero.icon);
if (content.hero.video) used.add(content.hero.video);
if (content.hero.videoHevc) used.add(content.hero.videoHevc);
if (content.hero.videoPoster) used.add(content.hero.videoPoster);
for (const section of content.sections) {
  for (const item of section.media ?? []) {
    if (item.src) used.add(item.src);
    if (item.poster) used.add(item.poster);
  }
}

const mediaDir = path.join(SRC, "media");
const missing = [...used].filter((name) => !fs.existsSync(path.join(mediaDir, name)));
if (missing.length) fail(`content.json uses media that isn't in ${mediaDir}: ${missing.join(", ")}`);

const counts = { sealed: 0, unchanged: 0, removed: 0 };
counts[write(path.join(OUT, "content.enc"), plainContent, "content.json")]++;

const keep = new Set();
for (const name of used) {
  const id = `${mediaId(name)}.enc`;
  keep.add(id);
  counts[write(path.join(OUT, "media", id), fs.readFileSync(path.join(mediaDir, name)), name)]++;
}

// Sealed media nothing uses any more.
const outMedia = path.join(OUT, "media");
if (fs.existsSync(outMedia)) {
  for (const file of fs.readdirSync(outMedia)) {
    if (file.endsWith(".enc") && !keep.has(file)) {
      fs.rmSync(path.join(outMedia, file));
      counts.removed++;
    }
  }
}

const unused = fs.existsSync(mediaDir)
  ? fs.readdirSync(mediaDir).filter((f) => !f.startsWith(".") && !used.has(f))
  : [];

console.log(
  `tripup:seal: ${counts.sealed} sealed, ${counts.unchanged} unchanged, ${counts.removed} removed` +
    ` (content + ${used.size} media files) → ${OUT}/`,
);
if (unused.length) console.log(`tripup:seal: not used by content.json, so not published: ${unused.join(", ")}`);
