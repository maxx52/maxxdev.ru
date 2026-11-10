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
        <span class="signal" aria-hidden="true"></span>ИМПУЛЬС / ВЕБ-РАЗРАБОТКА
      </div>
      <h1>Сайты для бизнеса.<br /><span>Приложения<br />для людей.</span></h1>
      <p class="hero-description">
        Разрабатываю сайты, Android-приложения и программы для компьютера.
        Помогаю определить, что нужно для запуска, и развиваю проект после него.
      </p>
      <div class="hero-actions">
        <a href="#contact" class="button button-primary"
          >Обсудить задачу <span aria-hidden="true">↗</span></a
        ><a href="#projects" class="text-link"
          >Смотреть проекты <span aria-hidden="true">↓</span></a
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
      <svg class="impulse-visual" viewBox="0 0 560 500" fill="none">
        <defs>
          <pattern id="impulse-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0v30" stroke="#3b4146" stroke-opacity=".45"/>
          </pattern>
          <linearGradient id="impulse-signal" x1="40" y1="300" x2="515" y2="180" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9d4220"/>
            <stop offset=".55" stop-color="#ff803a"/>
            <stop offset="1" stop-color="#ffbd85"/>
          </linearGradient>
          <radialGradient id="impulse-halo">
            <stop stop-color="#ff803a" stop-opacity=".26"/>
            <stop offset="1" stop-color="#ff803a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect x="10" y="10" width="540" height="480" rx="22" fill="#10161b" stroke="#303840"/>
        <rect x="30" y="30" width="500" height="440" rx="12" fill="url(#impulse-grid)"/>
        <ellipse cx="282" cy="249" rx="219" ry="189" fill="url(#impulse-halo)"/>
        <g stroke="#835135" stroke-opacity=".55">
          <circle cx="282" cy="249" r="185"/>
          <circle cx="282" cy="249" r="151" stroke-dasharray="3 7"/>
          <path d="M282 49v400M63 249h438" stroke-dasharray="3 7"/>
        </g>
        <path d="M38 291h72l28-47 29 89 38-147 34 105h34l25-42 23 42h59l32-78 21 78h87"
              stroke="url(#impulse-signal)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <g transform="translate(208 175)">
          <rect width="148" height="148" rx="27" fill="#151a1f" stroke="#ff803a" stroke-width="2"/>
          <path d="M34 104V44h16v37l49-37h16v60H99V67l-49 37H34Z" fill="#ff803a"/>
        </g>
        <g fill="#c7b4a7" font-family="monospace" font-size="11" letter-spacing="2">
          <text x="36" y="59">IMPULSE / 01</text>
          <text x="36" y="452">WEB / ANDROID / DESKTOP</text>
        </g>
        <circle cx="507" cy="55" r="5" fill="#ff803a"/>
      </svg>
    </div>
    <div class="hero-bottom">
      <span>Личный подход. Прямой контакт.</span
      ><a href="#projects" aria-label="Прокрутить к портфолио"
        >Листайте вниз <span aria-hidden="true">↓</span></a
      >
    </div>
  </section>
</template>
