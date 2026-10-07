import crypto from "node:crypto";

const WIDTH = 720;
const HEIGHT = 400;
const ROUNDS = 3;
const EXPIRY_MS = 10 * 60 * 1000;

function randomInt(min, max) {
  return crypto.randomInt(min, max + 1);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function overlaps(a, b, pad = 0) {
  return !(
    a.x + a.w + pad < b.x ||
    b.x + b.w + pad < a.x ||
    a.y + a.h + pad < b.y ||
    b.y + b.h + pad < a.y
  );
}

function makeRound() {
  const start = { x: randomInt(70, WIDTH - 70), y: randomInt(70, HEIGHT - 70) };
  let target = { x: randomInt(70, WIDTH - 70), y: randomInt(70, HEIGHT - 70) };

  while (distance(start, target) < 280) {
    target = { x: randomInt(70, WIDTH - 70), y: randomInt(70, HEIGHT - 70) };
  }

  const obstacles = [];
  let safety = 0;

  while (obstacles.length < 3 && safety < 60) {
    safety += 1;
    const obstacle = {
      x: randomInt(140, WIDTH - 260),
      y: randomInt(55, HEIGHT - 125),
      w: randomInt(70, 120),
      h: randomInt(42, 78),
    };

    const startBox = { x: start.x - 58, y: start.y - 58, w: 116, h: 116 };
    const targetBox = { x: target.x - 58, y: target.y - 58, w: 116, h: 116 };

    if (
      !overlaps(obstacle, startBox, 10) &&
      !overlaps(obstacle, targetBox, 10) &&
      obstacles.every((existing) => !overlaps(obstacle, existing, 18))
    ) {
      obstacles.push(obstacle);
    }
  }

  return { start, target, obstacles };
}

function sign(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = process.env.CAPTCHA_SECRET;

  if (!secret) throw new Error("CAPTCHA_SECRET is not configured");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");

  return encoded + "." + signature;
}

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.end();
  }

  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed" });
  }

  try {
    const rounds = Array.from({ length: ROUNDS }, makeRound);
    const payload = {
      v: 1,
      nonce: crypto.randomBytes(18).toString("hex"),
      exp: Date.now() + EXPIRY_MS,
      width: WIDTH,
      height: HEIGHT,
      rounds,
    };

    const token = sign(payload);

    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({
      token,
      width: WIDTH,
      height: HEIGHT,
      rounds,
    });
  } catch {
    return res.status(503).json({ error: "Captcha is not configured" });
  }
}
