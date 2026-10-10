<script setup>
import ProjectArtwork from "./ProjectArtwork.vue";
defineProps({ project: { type: Object, required: true } });
const emit = defineEmits(["open"]);
</script>

<template>
  <button
    class="project-card"
    @click="emit('open', project)"
    :aria-label="`Открыть кейс ${project.title}`"
  >
    <ProjectArtwork :project="project" />
    <div class="project-meta">
      <div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.type }}</p>
      </div>
      <span aria-hidden="true">↗</span>
    </div>
  </button>
</template>
