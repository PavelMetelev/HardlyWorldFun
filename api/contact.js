import crypto from "node:crypto";

const WIDTH = 720;
const HEIGHT = 400;
const MAX_MESSAGE = 2500;
const MIN_FORM_TIME_MS = 2200;
const MAX_FORM_TIME_MS = 20 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

const rateLimit = globalThis.__hardlyWorldContactRateLimit || new Map();
globalThis.__hardlyWorldContactRateLimit = rateLimit;

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function verifyToken(token) {
  const secret = process.env.CAPTCHA_SECRET;
  if (!secret || typeof token !== "string") return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");

  try {
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return null;
    }
  } catch {
    return null;
  }

  const payload = safeJson(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload || payload.v !== 1 || !Array.isArray(payload.rounds) || Date.now() > payload.exp) {
    return null;
  }

  return payload;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInsideRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}

function segmentHitsRect(a, b, rect) {
  if (pointInsideRect(a, rect) || pointInsideRect(b, rect)) return true;

  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy];
  const q = [
    a.x - rect.x,
    rect.x + rect.w - a.x,
    a.y - rect.y,
    rect.y + rect.h - a.y,
  ];

  for (let i = 0; i < 4; i += 1) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const r = q[i] / p[i];
      if (p[i] < 0) {
        if (r > t1) return false;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return false;
        if (r < t1) t1 = r;
      }
    }
  }

  return t0 <= t1;
}

function validateCaptcha(payload, proof) {
  if (!Array.isArray(proof) || proof.length !== payload.rounds.length) return false;

  return payload.rounds.every((round, index) => {
    const trace = proof[index];

    if (!Array.isArray(trace) || trace.length < 8) return false;

    const points = trace.map((point) => ({
      x: Number(point?.x),
      y: Number(point?.y),
      t: Number(point?.t),
    }));

    if (
      points.some(
        (point) =>
          !Number.isFinite(point.x) ||
          !Number.isFinite(point.y) ||
          !Number.isFinite(point.t) ||
          point.x < 0 ||
          point.x > WIDTH ||
          point.y < 0 ||
          point.y > HEIGHT,
      )
    ) {
      return false;
    }

    for (let i = 1; i < points.length; i += 1) {
      if (points[i].t <= points[i - 1].t) return false;
      if (round.obstacles.some((rect) => segmentHitsRect(points[i - 1], points[i], rect))) {
        return false;
      }
    }

    const first = points[0];
    const last = points[points.length - 1];
    const elapsed = last.t - first.t;

    if (elapsed < 350 || elapsed > 120000) return false;
    if (distance(first, round.start) > 58) return false;
    if (distance(last, round.target) > 64) return false;

    let travelled = 0;
    for (let i = 1; i < points.length; i += 1) {
      travelled += distance(points[i - 1], points[i]);
    }

    const direct = distance(round.start, round.target);

    return travelled >= direct * 0.62;
  });
}

function clean(value, maxLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function getIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return String(forwarded || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const captchaSecret = process.env.CAPTCHA_SECRET;

  if (!token || !chatId || !captchaSecret) {
    return res.status(503).json({
      error: "Техническая связь временно недоступна. Администратору нужно настроить форму.",
    });
  }

  const ip = getIp(req);
  const now = Date.now();
  const bucket = (rateLimit.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);

  if (bucket.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Слишком много обращений. Попробуйте снова через несколько минут.",
    });
  }

  rateLimit.set(ip, [...bucket, now]);

  const body = req.body && typeof req.body === "object" ? req.body : safeJson(String(req.body || "{}"));
  const name = clean(body?.name, 40);
  const telegram = clean(body?.telegram, 60);
  const category = clean(body?.category, 40);
  const message = clean(body?.message, MAX_MESSAGE);
  const honeypot = clean(body?.website, 80);
  const startedAt = Number(body?.startedAt);
  const captchaToken = body?.captchaToken;
  const captchaProof = body?.captchaProof;

  if (honeypot) {
    return res.status(400).json({ error: "Проверка не пройдена." });
  }

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Укажи игровой ник или имя." });
  }

  if (message.length < 15) {
    return res.status(400).json({ error: "Опиши проблему чуть подробнее — минимум 15 символов." });
  }

  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: "Сообщение слишком длинное." });
  }

  if (!Number.isFinite(startedAt) || now - startedAt < MIN_FORM_TIME_MS || now - startedAt > MAX_FORM_TIME_MS) {
    return res.status(400).json({ error: "Форма заполнена подозрительно быстро. Пройдите проверку ещё раз." });
  }

  const challenge = verifyToken(captchaToken);
  if (!challenge || !validateCaptcha(challenge, captchaProof)) {
    return res.status(400).json({ error: "Проверка человека не пройдена. Пройдите капчу заново." });
  }

  const ticketId =
    "HW-" +
    new Date().toISOString().slice(0, 10).replaceAll("-", "") +
    "-" +
    crypto.randomBytes(3).toString("hex").toUpperCase();

  const text = [
    "🛠 НОВОЕ ОБРАЩЕНИЕ В ТЕХПОДДЕРЖКУ",
    "",
    "Заявка: " + ticketId,
    "Категория: " + (category || "Другое"),
    "Ник / имя: " + name,
    "Telegram: " + (telegram || "не указан"),
    "",
    message,
    "",
    "Источник: hardly-world-fun.vercel.app",
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      "https://api.telegram.org/bot" + token + "/sendMessage",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    if (!telegramResponse.ok) {
      let telegramError = "Неизвестная ошибка Telegram";
      try {
        const telegramData = await telegramResponse.json();
        telegramError =
          typeof telegramData?.description === "string"
            ? telegramData.description
            : telegramError;
      } catch {}
      console.error("Telegram delivery failed:", telegramResponse.status, telegramError);
      return res.status(502).json({
        error: "Не удалось доставить обращение техническому администратору.",
        debug: process.env.NODE_ENV === "development" ? telegramError : undefined,
      });
    }

    return res.status(200).json({
      ok: true,
      ticketId,
    });
  } catch {
    return res.status(502).json({
      error: "Сервис Telegram временно недоступен. Попробуйте ещё раз.",
    });
  }
}
