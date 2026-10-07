export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const setupKey = process.env.TELEGRAM_SETUP_KEY;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!setupKey || !token || !chatId) {
    return res.status(503).json({ error: "Telegram is not configured." });
  }

  if (String(req.query?.key || "") !== setupKey) {
    return res.status(404).json({ error: "Not found." });
  }

  try {
    const response = await fetch(
      "https://api.telegram.org/bot" + token + "/getChat?chat_id=" + encodeURIComponent(chatId),
      { cache: "no-store" },
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error_code: data?.error_code,
        description: data?.description,
      });
    }

    const sendResponse = await fetch(
      "https://api.telegram.org/bot" + token + "/sendMessage",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Тест HardlyWorld Support: Telegram-связь с сайтом работает.",
        }),
      },
    );
    const sendData = await sendResponse.json();

    return res.status(200).json({
      ok: true,
      chat_type: data?.result?.type,
      username: data?.result?.username ?? null,
      first_name: data?.result?.first_name ?? null,
      send_ok: sendData?.ok === true,
      send_error_code: sendData?.error_code ?? null,
      send_description: sendData?.description ?? null,
    });
  } catch {
    return res.status(502).json({ ok: false, error: "Telegram API unavailable." });
  }
}
