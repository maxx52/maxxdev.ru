<script setup>
import { profile } from "../../data/profile.js";
</script>

<template>
  <a href="#top" class="brand" :aria-label="`${profile.name} — на главную`">
    <svg class="brand-mark" width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="currentColor" />
      <path d="M10 28V12h4v10l12-10h4v16h-4V18L14 28h-4Z" fill="#17120e" />
    </svg>
    {{ profile.name }}
  </a>
</template>
