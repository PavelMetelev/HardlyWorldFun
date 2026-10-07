const SITE = "https://hardly-world-fun.vercel.app/";
const SERVER_IP = "mc.HardlyWorld.fun";
const VERSION = "1.21.4";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function telegram(token, method, payload) {
  const response = await fetch(
    "https://api.telegram.org/bot" + token + "/" + method,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  return response.ok;
}

async function getServerStatus() {
  try {
    const response = await fetch(
      "https://api.mcsrvstat.us/3/" + encodeURIComponent(SERVER_IP),
      { cache: "no-store", headers: { Accept: "application/json" } },
    );

    if (!response.ok) return { online: false, error: true };
    const data = await response.json();

    return {
      online: Boolean(data.online),
      players: Number(data.players?.online ?? 0),
      maxPlayers: Number(data.players?.max ?? 0),
      version: String(data.version ?? VERSION),
      error: false,
    };
  } catch {
    return { online: false, error: true };
  }
}

function menu() {
  return {
    inline_keyboard: [
      [
        { text: "🟢 Статус сервера", callback_data: "status" },
        { text: "📜 Правила", url: SITE + "#rules" },
      ],
      [
        { text: "🧩 Моды", url: SITE + "#mods" },
        { text: "🛠 Техподдержка", url: SITE + "#support" },
      ],
      [{ text: "🌐 Открыть сайт", url: SITE }],
    ],
  };
}

async function handleMessage(token, message) {
  const chatId = message.chat?.id;
  const text = String(message.text ?? "").trim();

  if (!chatId) return;
  console.log("HardlyWorld Telegram incoming chat:", chatId, "type:", message.chat?.type, "username:", message.from?.username || "");

  if (text === "/start" || text === "/help") {
    await telegram(token, "sendMessage", {
      chat_id: chatId,
      text:
        "🔥 <b>HardlyWorld</b>\n\n" +
        "Официальный бот проекта. Здесь можно быстро проверить сервер и открыть нужные разделы сайта.\n\n" +
        "IP: <code>" + SERVER_IP + "</code>\n" +
        "Версия: <code>" + VERSION + "</code>",
      parse_mode: "HTML",
      reply_markup: menu(),
    });
    return;
  }

  if (text === "/status") {
    const status = await getServerStatus();
    const body = status.error
      ? "⚠️ Не удалось получить статус сервера."
      : status.online
        ? "🟢 <b>Сервер онлайн</b>\nИгроки: <b>" + status.players + "/" + (status.maxPlayers || "∞") + "</b>\nВерсия: <code>" + escapeHtml(status.version) + "</code>\nIP: <code>" + SERVER_IP + "</code>"
        : "🔴 <b>Сервер офлайн</b>\nIP: <code>" + SERVER_IP + "</code>";

    await telegram(token, "sendMessage", {
      chat_id: chatId,
      text: body,
      parse_mode: "HTML",
      reply_markup: menu(),
    });
    return;
  }

  if (text.startsWith("/status")) {
    await handleMessage(token, { ...message, text: "/status" });
    return;
  }

  await telegram(token, "sendMessage", {
    chat_id: chatId,
    text: "Выбери действие в меню 👇",
    reply_markup: menu(),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) {
    return res.status(503).json({ error: "Telegram bot is not configured." });
  }

  const receivedSecret = req.headers["x-telegram-bot-api-secret-token"];
  if (receivedSecret !== secret) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    await handleMessage(token, req.body || {});
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(200).json({ ok: true });
  }
}
