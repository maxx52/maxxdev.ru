<script setup>
import BrandLink from "./BrandLink.vue";
import { profile } from "../../data/profile.js";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer container">
    <BrandLink />
    <p>© {{ year }} {{ profile.name }}. Разработка сайтов и приложений.</p>
    <a href="#top" class="back-top">Наверх <span aria-hidden="true">↑</span></a>
  </footer>
</template>
