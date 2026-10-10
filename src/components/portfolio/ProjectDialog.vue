<script setup>
import { nextTick, onUnmounted, ref } from "vue";
const chosenProject = ref(null);
const caseDialog = ref(null);
let lockRestore = "";
async function open(project) {
  chosenProject.value = project;
  await nextTick();
  if (caseDialog.value.open) return;
  lockRestore = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  caseDialog.value.showModal();
}
function closeProject() {
  caseDialog.value?.close();
}
function handleDialogClose() {
  document.body.style.overflow = lockRestore;
  chosenProject.value = null;
}
function closeOnBackdrop(event) {
  if (event.target === caseDialog.value) closeProject();
}
async function discussProject() {
  closeProject();
  await nextTick();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
}
onUnmounted(() => {
  if (chosenProject.value) document.body.style.overflow = lockRestore;
});
defineExpose({ open });
</script>

<template>
  <dialog
    ref="caseDialog"
    class="case-dialog"
    aria-labelledby="case-title"
    @close="handleDialogClose"
    @click="closeOnBackdrop"
  >
    <template v-if="chosenProject"
      ><div class="case-top">
        <p class="eyebrow">{{ chosenProject.category }} / КЕЙС</p>
        <button
          class="dialog-close"
          aria-label="Закрыть кейс"
          @click="closeProject"
        >
          ×
        </button>
      </div>
      <h2 id="case-title">{{ chosenProject.title }}</h2>
      <p class="case-description">{{ chosenProject.description }}</p>
      <div class="case-tags">
        <span v-for="tag in chosenProject.tags" :key="tag">{{ tag }}</span>
      </div>
      <h3>Задача</h3>
      <p>{{ chosenProject.task }}</p>
      <h3>Что реализовано</h3>
      <ul class="case-features">
        <li v-for="feature in chosenProject.features" :key="feature">
          {{ feature }}
        </li>
      </ul>
      <a
        :href="chosenProject.link"
        target="_blank"
        rel="noopener noreferrer"
        class="button button-primary"
        >{{ chosenProject.linkText }} ↗</a
      ><button class="case-contact text-link" @click="discussProject">
        Нужен похожий проект? ↗
      </button></template
    >
  </dialog>
</template>
