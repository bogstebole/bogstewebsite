const FEED_URL = "https://bogste.substack.com/feed";

export type SubstackPost = {
  title: string;
  link: string;
  image: string | null;
  dateText: string;
  timeText: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ");
}

function readTag(xml: string, name: string): string | null {
  const cdata = xml.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${name}>`));
  if (cdata) return decode(cdata[1].trim());
  const plain = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return plain ? decode(plain[1].trim()) : null;
}

function readAttr(xml: string, name: string, attribute: string): string | null {
  const m = xml.match(new RegExp(`<${name}[^>]*\\s${attribute}="([^"]+)"`));
  return m ? m[1] : null;
}

function formatPubDate(d: Date) {
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  let h = d.getUTCHours();
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return {
    dateText: `${day} ${month} ${year}`,
    timeText: `${h}:${min}${ampm}`,
  };
}

export async function getLatestSubstackPost(): Promise<SubstackPost | null> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const item = xml.match(/<item>([\s\S]*?)<\/item>/)?.[1];
    if (!item) return null;

    const title = readTag(item, "title");
    const link = readTag(item, "link");
    const pubDate = readTag(item, "pubDate");
    const image = readAttr(item, "enclosure", "url");

    if (!title || !link || !pubDate) return null;

    const d = new Date(pubDate);
    if (Number.isNaN(d.getTime())) return null;

    const { dateText, timeText } = formatPubDate(d);

    return { title, link, image, dateText, timeText };
  } catch {
    return null;
  }
}
