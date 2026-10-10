<script setup>
import { onMounted, onUnmounted, ref } from "vue";
const menuOpen = ref(false);
function closeMenu() {
  menuOpen.value = false;
}
function handleKey(event) {
  if (event.key === "Escape") closeMenu();
}
onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <a
        href="#top"
        class="brand"
        aria-label="MaxxDev — на главную"
        @click="closeMenu"
        >maxx<span>dev</span><i aria-hidden="true"></i
      ></a>
      <nav class="desktop-nav" aria-label="Основная навигация">
        <a href="#projects">Проекты</a><a href="#services">Услуги</a
        ><a href="#pricing">Стоимость</a><a href="#about">О разработчике</a>
      </nav>
      <a class="button button-outline header-cta" href="#contact"
        >Обсудить проект <span aria-hidden="true">↗</span></a
      >
      <button
        class="menu-button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Закрыть" : "Меню" }}
        <span aria-hidden="true">{{ menuOpen ? "×" : "+" }}</span>
      </button>
    </div>
    <nav
      v-if="menuOpen"
      id="mobile-nav"
      class="mobile-nav container"
      aria-label="Мобильная навигация"
    >
      <a href="#projects" @click="closeMenu">Проекты</a
      ><a href="#services" @click="closeMenu">Услуги</a
      ><a href="#pricing" @click="closeMenu">Стоимость</a
      ><a href="#about" @click="closeMenu">О разработчике</a
      ><a href="#contact" @click="closeMenu">Обсудить проект ↗</a>
    </nav>
  </header>
</template>
