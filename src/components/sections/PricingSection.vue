<script setup>
import { pricing } from "../../data/pricing.js";
const emit = defineEmits(["select-platform"]);
</script>

<template>
  <section id="pricing" class="section pricing-section container" data-reveal>
    <div class="section-heading">
      <div>
        <p class="eyebrow">СТАРТОВЫЕ ЦЕНЫ</p>
        <h2>Понятный бюджет.<br /><span>До начала работы.</span></h2>
      </div>
      <p class="section-intro">
        Выберите ориентир под свою задачу.<br />Точную стоимость согласуем после
        обсуждения.
      </p>
    </div>
    <div class="pricing-grid">
      <article v-for="offer in pricing" :key="offer.id" class="pricing-card">
        <div class="service-top">
          <span>{{ offer.number }}</span
          ><span aria-hidden="true">↗</span>
        </div>
        <h3>{{ offer.title }}</h3>
        <p class="pricing-start">
          <span>от</span> {{ offer.startingPrice }} <span>₽</span>
        </p>
        <p class="pricing-description">{{ offer.description }}</p>
        <dl class="pricing-list">
          <div v-for="item in offer.items" :key="item.title">
            <dt>{{ item.title }}</dt>
            <dd>от {{ item.price }} ₽</dd>
          </div>
        </dl>
        <a
          href="#contact"
          class="button button-outline"
          @click="emit('select-platform', offer.platform)"
          >Обсудить проект <span aria-hidden="true">↗</span></a
        >
      </article>
    </div>
    <div class="pricing-policy">
      <p>
        Это стартовые цены. Итоговая стоимость зависит от количества страниц или
        экранов, сложности дизайна, функций и интеграций. Объём работ, стоимость
        и сроки согласуем до начала разработки.
      </p>
      <p>
        Домены, хостинг и платные сторонние сервисы оплачиваются отдельно, если
        нужны для проекта.
      </p>
      <p>
        Программы для компьютера — индивидуальный расчёт.
        <a
          href="#contact"
          @click="emit('select-platform', 'Программа для компьютера')"
          >Обсудить задачу ↗</a
        >
      </p>
    </div>
  </section>
</template>
