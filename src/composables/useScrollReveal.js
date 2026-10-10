import { onMounted, onUnmounted } from "vue";

export function useScrollReveal() {
  let observer;
  onMounted(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.06 },
      );
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        // Keep the initial viewport and very tall blocks visible at every width.
        if (element.getBoundingClientRect().top > window.innerHeight) {
          element.classList.add("will-reveal");
          observer.observe(element);
        }
      });
    }
  });
  onUnmounted(() => observer?.disconnect());
}
