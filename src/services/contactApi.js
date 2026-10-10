export async function postContact(payload, send = fetch) {
  try {
    const response = await send("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json().catch(() => null);
    if (
      !response.ok ||
      result?.ok !== true ||
      result.requestId !== payload.requestId
    ) {
      throw new Error(
        result?.error || "Не удалось принять заявку. Попробуйте ещё раз.",
      );
    }
    return {
      message: "Заявка принята. Я свяжусь с вами по указанному контакту.",
    };
  } catch (error) {
    if (
      error.name === "TimeoutError" ||
      error.name === "AbortError" ||
      error instanceof TypeError
    ) {
      throw new Error(
        "Не удалось получить подтверждение. Попробуйте отправить ещё раз — данные сохранены.",
      );
    }
    throw error;
  }
}
