<script setup>
import { profile } from "../../data/profile.js";
import ContactForm from "../contact/ContactForm.vue";
defineProps({ controller: { type: Object, required: true } });
</script>

<template>
  <section id="contact" class="contact-section" data-reveal>
    <div class="container contact-layout">
      <div class="contact-copy">
        <p class="eyebrow">НАЧНЁМ С РАЗГОВОРА</p>
        <h2>
          Есть идея?<br /><span>Давайте<br />создадим.</span>
        </h2>
        <p>
          Расскажите, что хотите сделать.<br />Краткого описания достаточно,<br />чтобы
          начать обсуждение.
        </p>
        <a
          v-if="profile.email"
          :href="`mailto:${profile.email}`"
          class="github-contact"
          >{{ profile.email }} ↗</a
        >
      </div>
      <ContactForm :controller="controller" />
    </div>
  </section>
</template>
