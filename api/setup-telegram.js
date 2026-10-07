export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const setupKey = process.env.TELEGRAM_SETUP_KEY;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!setupKey || !token || !webhookSecret) {
    return res.status(503).json({ error: "Telegram setup is not configured." });
  }

  if (String(req.query?.key || "") !== setupKey) {
    return res.status(404).json({ error: "Not found." });
  }

  const webhookUrl = "https://hardly-world-fun.vercel.app/api/telegram";

  try {
    const response = await fetch("https://api.telegram.org/bot" + token + "/setWebhook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: webhookSecret,
        allowed_updates: ["message", "callback_query"],
        drop_pending_updates: true,
      }),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 502).json(data);
  } catch {
    return res.status(502).json({ error: "Telegram API unavailable." });
  }
}
