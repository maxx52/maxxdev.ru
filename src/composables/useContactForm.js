import { onMounted, ref } from "vue";
import { postContact } from "../services/contactApi.js";

export function useContactForm() {
  const form = ref(null);
  const contactFeedback = ref("");
  const draft = ref({ name: "", contact: "", platform: "Сайт", goal: "" });
  const isSending = ref(false);
  const website = ref("");
  let pendingRequest = null;

  function persistDraft() {
    contactFeedback.value = "";
    try {
      localStorage.setItem("maxim-impulse-brief", JSON.stringify(draft.value));
    } catch {
      /* The form still works without storage. */
    }
  }

  function validBrief() {
    if (!form.value?.reportValidity()) return false;
    if (
      !draft.value.name.trim() ||
      !draft.value.contact.trim() ||
      !draft.value.goal.trim()
    ) {
      contactFeedback.value = "Заполните имя, контакт и описание задачи.";
      return false;
    }
    return true;
  }

  async function submitBrief() {
    if (isSending.value || !validBrief()) return;
    const payload = Object.fromEntries(
      Object.entries(draft.value).map(([key, value]) => [key, value.trim()]),
    );
    const fingerprint = JSON.stringify(payload);
    if (!pendingRequest || pendingRequest.fingerprint !== fingerprint) {
      pendingRequest = { fingerprint, requestId: crypto.randomUUID() };
    }
    isSending.value = true;
    contactFeedback.value = "";
    try {
      const result = await postContact({
        ...payload,
        requestId: pendingRequest.requestId,
        website: website.value,
      });
      draft.value = { name: "", contact: "", platform: "Сайт", goal: "" };
      try {
        localStorage.removeItem("maxim-impulse-brief");
      } catch {
        /* Storage is optional. */
      }
      pendingRequest = null;
      contactFeedback.value = result.message;
    } catch (error) {
      contactFeedback.value = error.message;
    } finally {
      isSending.value = false;
    }
  }

  function selectPlatform(platform) {
    if (isSending.value) return;
    draft.value.platform = platform;
    persistDraft();
  }
  onMounted(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("maxim-impulse-brief") || "null",
      );
      if (saved && typeof saved === "object") {
        for (const key of ["name", "contact", "goal"])
          if (typeof saved[key] === "string")
            draft.value[key] = saved[key].slice(0, key === "goal" ? 4000 : 200);
        if (
          [
            "Сайт",
            "Android-приложение",
            "Программа для компьютера",
            "Пока не определился",
          ].includes(saved.platform)
        )
          draft.value.platform = saved.platform;
      }
    } catch {
      /* Ignore unavailable storage and invalid older drafts. */
    }
  });
  return {
    form,
    draft,
    website,
    isSending,
    contactFeedback,
    persistDraft,
    submitBrief,
    selectPlatform,
  };
}
