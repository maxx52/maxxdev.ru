<script setup>
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";
import HeroSection from "./components/sections/HeroSection.vue";
import NovaSection from "./components/sections/NovaSection.vue";
import PortfolioSection from "./components/sections/PortfolioSection.vue";
import ServicesSection from "./components/sections/ServicesSection.vue";
import PricingSection from "./components/sections/PricingSection.vue";
import AboutSection from "./components/sections/AboutSection.vue";
import ProcessSection from "./components/sections/ProcessSection.vue";
import ContactSection from "./components/sections/ContactSection.vue";
import { useContactForm } from "./composables/useContactForm.js";
import { useScrollReveal } from "./composables/useScrollReveal.js";

const contact = useContactForm();
useScrollReveal();
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
  <SiteHeader />
  <main id="main">
    <HeroSection />
    <PortfolioSection />
    <NovaSection />
    <ServicesSection @select-platform="contact.selectPlatform" />
    <PricingSection @select-platform="contact.selectPlatform" />
    <AboutSection />
    <ProcessSection />
    <ContactSection :controller="contact" />
  </main>
  <SiteFooter />
</template>
