<script setup>
import { profile } from "../../data/profile.js";
</script>

<template>
  <section id="about" class="section about container" data-reveal>
    <div class="about-title">
      <p class="eyebrow">О РАЗРАБОТЧИКЕ</p>
      <h2>
        Один проект.<br /><span>Личная<br />ответственность.</span>
      </h2>
      <div class="signature">{{ profile.name }} <span>/ разработчик</span></div>
    </div>
    <div class="about-content">
      <p class="about-lead">
        Я разрабатываю сайты и приложения. Мне нравится превращать идеи в
        инструменты, которыми удобно пользоваться каждый день.
      </p>
      <p>
        Работаю с Vue.js, Kotlin, Jetpack Compose и Compose Desktop. Опыт
        собственных проектов помогает видеть продукт целиком: интерфейс, логику
        и сценарии использования.
      </p>
      <p>
        Со мной можно обсудить задачу напрямую. Начинаем с того, что должно
        получиться, затем продумываем структуру и последовательно движемся к
        запуску.
      </p>
      <div class="about-tools">
        <span>Vue.js</span><span>Kotlin</span><span>Compose</span>
      </div>
      <a
        :href="profile.github"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
        >Познакомиться с моими проектами <span aria-hidden="true">↗</span></a
      >
    </div>
  </section>
</template>
