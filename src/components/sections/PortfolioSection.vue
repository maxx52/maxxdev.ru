<script setup>
import { computed, ref } from "vue";
import { profile } from "../../data/profile.js";
import { projects } from "../../data/projects.js";
import ProjectCard from "../portfolio/ProjectCard.vue";
import ProjectDialog from "../portfolio/ProjectDialog.vue";
const category = ref("Все");
const categories = ["Все", "Web", "Android", "Desktop"];
const visibleProjects = computed(() =>
  category.value === "Все"
    ? projects
    : projects.filter((project) => project.category === category.value),
);
const projectDialog = ref(null);
function openProject(project) {
  projectDialog.value?.open(project);
}
</script>

<template>
  <section id="projects" class="section portfolio container" data-reveal>
    <div class="section-heading">
      <div>
        <p class="eyebrow">ПОРТФОЛИО / SELECTED WORK</p>
        <h2>Идеи, которые<br />стали <span>продуктами.</span></h2>
      </div>
      <p class="section-intro">
        Мои проекты — от сайтов и CMS<br />до мобильных и настольных приложений.
      </p>
    </div>
    <div class="portfolio-toolbar">
      <span>Избранные работы</span>
      <div class="filters" role="group" aria-label="Фильтр проектов">
        <button
          v-for="item in categories"
          :key="item"
          :aria-pressed="category === item"
          :class="{ active: category === item }"
          @click="category = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <TransitionGroup name="project" tag="div" class="project-grid">
      <ProjectCard
        v-for="project in visibleProjects"
        :key="project.id"
        :project="project"
        @open="openProject"
      />
    </TransitionGroup>
    <a
      :href="profile.github"
      target="_blank"
      rel="noopener noreferrer"
      class="portfolio-github"
      >Больше кода и проектов на GitHub <span aria-hidden="true">↗</span></a
    >
    <ProjectDialog ref="projectDialog" />
  </section>
</template>
