<script setup>
import { ref } from "vue";
import { useHeroMotion } from "../../composables/useHeroMotion.js";
const energy = ref(null);
const { moveEnergy, resetEnergy } = useHeroMotion(energy);
</script>

<template>
  <section id="top" class="hero container">
    <div class="hero-copy">
      <div class="eyebrow">
        <span class="signal" aria-hidden="true"></span>РАЗРАБОТКА САЙТОВ И
        ПРИЛОЖЕНИЙ
      </div>
      <h1>Создаю.<br />Запускаю.<br /><span>Развиваю.</span></h1>
      <p class="hero-description">
        Сайты для бизнеса, приложения для Android<br class="desktop-break" />
        и программы для компьютера.<br />От вашей идеи до работающего продукта.
      </p>
      <div class="hero-actions">
        <a href="#contact" class="button button-primary"
          >Обсудить задачу <span aria-hidden="true">↗</span></a
        ><a href="#projects" class="text-link"
          >Мои проекты <span aria-hidden="true">↓</span></a
        >
      </div>
    </div>
    <div
      ref="energy"
      class="energy"
      @pointermove="moveEnergy"
      @pointerleave="resetEnergy"
      aria-hidden="true"
    >
      <div class="energy-glow"></div>
      <div class="energy-core"></div>
      <div class="energy-ring ring-one"></div>
      <div class="energy-ring ring-two"></div>
      <div class="energy-ring ring-three"></div>
      <span class="energy-cross">+</span>
      <div class="energy-label">ОТ ИДЕИ<br />ДО ЗАПУСКА<span></span></div>
      <div class="energy-coordinate">WEB / MOBILE / DESKTOP</div>
    </div>
    <div class="hero-bottom">
      <span>Личный подход. Прямой контакт.</span
      ><a href="#projects" aria-label="Прокрутить к портфолио"
        >Листайте вниз <span aria-hidden="true">↓</span></a
      >
    </div>
  </section>
</template>
