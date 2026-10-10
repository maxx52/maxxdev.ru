<script setup>
import { services } from "../../data/services.js";
const emit = defineEmits(["select-platform"]);
</script>

<template>
  <section id="services" class="section services-section" data-reveal>
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">ЧЕМ МОГУ ПОМОЧЬ</p>
          <h2>Технологии —<br />под <span>вашу задачу.</span></h2>
        </div>
        <p class="section-intro">
          Не знаете, с чего начать?<br />Сначала разберём задачу и выберем
          решение.
        </p>
      </div>
      <div class="services-grid">
        <article
          v-for="service in services"
          :key="service.number"
          class="service-card"
        >
          <div class="service-top">
            <span>{{ service.number }}</span
            ><span aria-hidden="true">↗</span>
          </div>
          <p class="eyebrow">{{ service.label }}</p>
          <h3>{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
          <ul class="tech-list">
            <li v-for="item in service.items" :key="item">{{ item }}</li>
          </ul>
          <a
            :href="`#contact`"
            class="service-link"
            @click="emit('select-platform', service.platform)"
            >Обсудить разработку <span aria-hidden="true">↗</span></a
          >
        </article>
      </div>
    </div>
  </section>
</template>
