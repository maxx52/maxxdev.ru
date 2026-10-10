<script setup>
defineProps({ project: { type: Object, required: true } });
</script>

<template>
  <div class="project-art" :class="project.artwork" aria-hidden="true">
    <template v-if="project.artwork === 'keyboard'"
      ><div class="daric-mark">D<span>↗</span></div>
      <div class="key-grid">
        <span
          v-for="key in [
            'Й',
            'Ц',
            'У',
            'К',
            'Е',
            'Н',
            'Ф',
            'Ы',
            'В',
            'А',
            'П',
            'Р',
            'Я',
            'Ч',
            'С',
            'М',
            'И',
            'Т',
          ]"
          :key="key"
          >{{ key }}</span
        >
      </div></template
    >
    <template v-else-if="project.artwork === 'player'"
      ><div class="vinyl"><div class="vinyl-center">P</div></div>
      <div class="waveform">
        <span
          v-for="(height, i) in [
            13, 27, 40, 23, 55, 71, 43, 86, 57, 33, 65, 83, 37, 53, 21, 42, 29,
            13,
          ]"
          :key="i"
          :style="{ height: height + 'px' }"
        ></span></div
    ></template>
    <template v-else
      ><div class="projection-screen">
        <div class="projection-letter">H<span></span></div>
        <div class="projection-line"></div>
        <div class="projection-line short"></div>
      </div>
      <div class="projection-stand"></div>
      <span class="projection-light"></span
    ></template>
    <span class="project-art-label">{{ project.category.toUpperCase() }}</span
    ><span class="project-open">↗</span>
  </div>
</template>
