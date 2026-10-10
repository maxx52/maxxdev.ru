import { onMounted, onUnmounted } from "vue";

export function useHeroMotion(energy) {
  let mediaQuery;
  let frame = 0;
  onMounted(() => {
    mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  });
  function moveEnergy(event) {
    if (!energy.value || mediaQuery?.matches || event.pointerType === "touch")
      return;
    const rect = energy.value.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      energy.value?.style.setProperty("--move-x", `${x * 18}px`);
      energy.value?.style.setProperty("--move-y", `${y * 18}px`);
    });
  }

  function resetEnergy() {
    cancelAnimationFrame(frame);
    energy.value?.style.setProperty("--move-x", "0px");
    energy.value?.style.setProperty("--move-y", "0px");
  }

  onUnmounted(() => cancelAnimationFrame(frame));
  return { moveEnergy, resetEnergy };
}
