<script setup>
const props = defineProps({ controller: { type: Object, required: true } });
const {
  form,
  draft,
  website,
  isSending,
  contactFeedback,
  persistDraft,
  submitBrief,
} = props.controller;
</script>

<template>
  <form
    ref="form"
    id="brief-form"
    class="brief-form"
    @submit.prevent="submitBrief"
    :aria-busy="isSending"
    @input="persistDraft"
  >
    <div class="form-heading">
      <h3>Короткий бриф</h3>
      <span aria-hidden="true">↗</span>
    </div>
    <fieldset class="brief-fields" :disabled="isSending">
      <legend class="sr-only">Данные заявки</legend>
      <label class="form-trap" aria-hidden="true"
        >Ваш сайт<input
          v-model="website"
          name="website"
          tabindex="-1"
          autocomplete="off"
      /></label>
      <div class="form-row">
        <label
          >Как вас зовут<input
            v-model="draft.name"
            name="name"
            autocomplete="name"
            placeholder="Ваше имя"
            required
            maxlength="200" /></label
        ><label
          >Как с вами связаться<input
            v-model="draft.contact"
            name="contact"
            autocomplete="email"
            placeholder="Email, Telegram или телефон"
            required
            maxlength="200"
        /></label>
      </div>
      <label
        >Что нужно разработать<select
          v-model="draft.platform"
          name="platform"
          @change="persistDraft"
        >
          <option>Сайт</option>
          <option>Android-приложение</option>
          <option>Программа для компьютера</option>
          <option>Пока не определился</option>
        </select></label
      >
      <label
        >Расскажите о задаче<textarea
          v-model="draft.goal"
          name="goal"
          rows="4"
          placeholder="Для кого продукт, какие задачи он должен решать, желаемые сроки…"
          required
          maxlength="4000"
        ></textarea>
      </label>
    </fieldset>
    <div class="form-actions">
      <button type="submit" class="button button-primary" :disabled="isSending">
        {{ isSending ? "Отправляем…" : "Отправить заявку ↗" }}
      </button>
    </div>
    <p class="form-note">
      Оставьте удобный способ связи — я отвечу по указанному контакту.
    </p>
    <p v-if="contactFeedback" class="form-feedback" role="status">
      {{ contactFeedback }}
    </p>
  </form>
</template>
