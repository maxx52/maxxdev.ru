<script setup>
const features = [
  { title: "Страницы и контент", text: "Собирайте страницы из блоков, ведите блог и проверяйте оформление в мобильном предпросмотре." },
  { title: "Интернет-магазин", text: "Управляйте товарами, покупателями и заказами, настраивайте оплату и доставку." },
  { title: "Дизайн под ваш бренд", text: "Меняйте темы и шаблоны. Для индивидуальных решений доступен встроенный редактор кода." },
  { title: "SEO и заявки", text: "Настраивайте метатеги и редиректы, добавляйте формы с уведомлениями на почту и в Telegram." },
];
</script>

<template>
  <section id="nova" class="section container nova-section" data-reveal aria-labelledby="nova-heading">
    <div class="nova-panel">
      <div class="nova-lead">
        <p class="eyebrow">СОБСТВЕННАЯ РАЗРАБОТКА / CMS</p>
        <h2 id="nova-heading">NOVA <span>Engine.</span></h2>
        <p class="nova-subtitle">Ваш сайт. Ваши правила.</p>
        <p class="nova-description">Система управления для сайтов компаний, блогов и интернет-магазинов. Обновляйте контент, меняйте оформление и обрабатывайте заявки в одной панели.</p>
        <div class="nova-actions">
          <a class="button button-primary" href="https://nova.maxxdev.ru" target="_blank" rel="noopener noreferrer">Посмотреть NOVA <span aria-hidden="true">↗</span></a>
          <a class="button button-outline" href="#contact">Обсудить сайт на NOVA</a>
        </div>
        <p class="nova-note">Разработка, установка на ваш сервер и настройка под задачи бизнеса. Стоимость — после обсуждения проекта.</p>
      </div>
      <div class="nova-features">
        <article v-for="(feature, index) in features" :key="feature.title">
          <span class="nova-number">0{{ index + 1 }}</span>
          <div><h3>{{ feature.title }}</h3><p>{{ feature.text }}</p></div>
        </article>
        <p class="nova-access">Совместная работа: роли пользователей, двухфакторный вход и журнал действий.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nova-panel { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; border: 1px solid var(--line); padding: 48px; background: radial-gradient(ellipse at 0 0, #ff6b1a14, transparent 65%), #0b0b0b; }
.nova-lead, .nova-features { min-width: 0; }
.nova-section h2 { font-size: clamp(36px, 5vw, 66px); overflow-wrap: anywhere; margin: 20px 0; }
.nova-section h2 span { color: var(--orange); }
.nova-subtitle { font-size: 22px; font-weight: 700; }
.nova-description, .nova-features p { color: var(--muted); line-height: 1.8; font-size: 14px; }
.nova-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.nova-note { color: var(--muted); font-size: 12px; line-height: 1.8; margin-top: 20px; }
.nova-features article { display: flex; gap: 20px; padding: 22px 0; border-bottom: 1px solid var(--line); }
.nova-number { color: var(--orange); font-size: 12px; padding-top: 4px; }
.nova-features h3 { margin: 0; font-size: 17px; }
.nova-features article p { margin: 8px 0 0; }
.nova-features .nova-access { font-size: 12px; margin-top: 24px; }
@media (max-width: 1000px) { .nova-panel { grid-template-columns: 1fr; gap: 20px; padding: 32px; } }
@media (max-width: 560px) { .nova-panel { padding: 24px 18px; } .nova-actions { flex-direction: column; } .nova-actions .button { width: 100%; gap: 16px; } .nova-subtitle { font-size: 19px; } }
</style>
