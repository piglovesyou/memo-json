import crypto from "crypto";

const length = 6;

export function createHash(s: string | Buffer): string {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, length);
}
