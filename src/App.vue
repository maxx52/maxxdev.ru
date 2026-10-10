<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { profile, projects, services } from './content.js'
import { postContact } from './contact.js'

const menuOpen = ref(false)
const category = ref('Все')
const categories = ['Все', 'Android', 'Desktop']
const visibleProjects = computed(() => category.value === 'Все' ? projects : projects.filter(project => project.category === category.value))
const chosenProject = ref(null)
const caseDialog = ref(null)
const energy = ref(null)
const contactFeedback = ref('')
const draft = ref({ name: '', contact: '', platform: 'Сайт', goal: '' })
const year = new Date().getFullYear()
let observer
let mediaQuery
let frame = 0
let removeKeyListener
let lockRestore = ''

const isSending = ref(false)
const website = ref('')
let pendingRequest = null

function closeMenu() { menuOpen.value = false }

async function openProject(project) {
  chosenProject.value = project
  await nextTick()
  lockRestore = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  caseDialog.value.showModal()
}

function closeProject() { caseDialog.value?.close() }
function handleDialogClose() {
  document.body.style.overflow = lockRestore
  chosenProject.value = null
}

function moveEnergy(event) {
  if (!energy.value || mediaQuery?.matches || event.pointerType === 'touch') return
  const rect = energy.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - .5
  const y = (event.clientY - rect.top) / rect.height - .5
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    energy.value?.style.setProperty('--move-x', `${x * 18}px`)
    energy.value?.style.setProperty('--move-y', `${y * 18}px`)
  })
}

function resetEnergy() {
  cancelAnimationFrame(frame)
  energy.value?.style.setProperty('--move-x', '0px')
  energy.value?.style.setProperty('--move-y', '0px')
}

function persistDraft() {
  contactFeedback.value = ''
  try { localStorage.setItem('maxim-impulse-brief', JSON.stringify(draft.value)) } catch { /* The form still works without storage. */ }
}

function validBrief() {
  const form = document.getElementById('brief-form')
  if (!form.reportValidity()) return false
  if (!draft.value.name.trim() || !draft.value.contact.trim() || !draft.value.goal.trim()) {
    contactFeedback.value = 'Заполните имя, контакт и описание задачи.'
    return false
  }
  return true
}

async function submitBrief() {
  if (isSending.value || !validBrief()) return
  const payload = Object.fromEntries(Object.entries(draft.value).map(([key, value]) => [key, value.trim()]))
  const fingerprint = JSON.stringify(payload)
  if (!pendingRequest || pendingRequest.fingerprint !== fingerprint) {
    pendingRequest = { fingerprint, requestId: crypto.randomUUID() }
  }
  isSending.value = true
  contactFeedback.value = ''
  try {
    const result = await postContact({ ...payload, requestId: pendingRequest.requestId, website: website.value })
    draft.value = { name: '', contact: '', platform: 'Сайт', goal: '' }
    try { localStorage.removeItem('maxim-impulse-brief') } catch { /* Storage is optional. */ }
    pendingRequest = null
    contactFeedback.value = result.message
  } catch (error) {
    contactFeedback.value = error.message
  } finally { isSending.value = false }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  try {
    const saved = JSON.parse(localStorage.getItem('maxim-impulse-brief') || 'null')
    if (saved && typeof saved === 'object') {
      for (const key of ['name', 'contact', 'goal']) if (typeof saved[key] === 'string') draft.value[key] = saved[key].slice(0, key === 'goal' ? 4000 : 200)
      if (['Сайт', 'Android-приложение', 'Программа для компьютера', 'Пока не определился'].includes(saved.platform)) draft.value.platform = saved.platform
    }
  } catch { /* Ignore unavailable storage and invalid older drafts. */ }
  if (!mediaQuery.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: .06 })
    document.querySelectorAll('[data-reveal]').forEach(element => {
      // Keep the initial viewport and very tall blocks visible at every width.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('will-reveal')
        observer.observe(element)
      }
    })
  }
  const handleKey = event => { if (event.key === 'Escape') closeMenu() }
  window.addEventListener('keydown', handleKey)
  removeKeyListener = () => window.removeEventListener('keydown', handleKey)
})

onUnmounted(() => {
  observer?.disconnect()
  removeKeyListener?.()
  cancelAnimationFrame(frame)
  if (chosenProject.value) document.body.style.overflow = lockRestore
})
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
  <header class="site-header">
    <div class="container header-inner">
      <a href="#top" class="brand" aria-label="MaxxDev — на главную" @click="closeMenu">maxx<span>dev</span><i aria-hidden="true"></i></a>
      <nav class="desktop-nav" aria-label="Основная навигация"><a href="#projects">Проекты</a><a href="#services">Услуги</a><a href="#about">О разработчике</a></nav>
      <a class="button button-outline header-cta" href="#contact">Обсудить проект <span aria-hidden="true">↗</span></a>
      <button class="menu-button" :aria-expanded="menuOpen" aria-controls="mobile-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Закрыть' : 'Меню' }} <span aria-hidden="true">{{ menuOpen ? '×' : '+' }}</span></button>
    </div>
    <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav container" aria-label="Мобильная навигация"><a href="#projects" @click="closeMenu">Проекты</a><a href="#services" @click="closeMenu">Услуги</a><a href="#about" @click="closeMenu">О разработчике</a><a href="#contact" @click="closeMenu">Обсудить проект ↗</a></nav>
  </header>

  <main id="main">
    <section id="top" class="hero container">
      <div class="hero-copy">
        <div class="eyebrow"><span class="signal" aria-hidden="true"></span>РАЗРАБОТКА САЙТОВ И ПРИЛОЖЕНИЙ</div>
        <h1>Создаю.<br>Запускаю.<br><span>Развиваю.</span></h1>
        <p class="hero-description">Сайты для бизнеса, приложения для Android<br class="desktop-break"> и программы для компьютера.<br>От вашей идеи до работающего продукта.</p>
        <div class="hero-actions"><a href="#contact" class="button button-primary">Обсудить задачу <span aria-hidden="true">↗</span></a><a href="#projects" class="text-link">Мои проекты <span aria-hidden="true">↓</span></a></div>
      </div>
      <div ref="energy" class="energy" @pointermove="moveEnergy" @pointerleave="resetEnergy" aria-hidden="true"><div class="energy-glow"></div><div class="energy-core"></div><div class="energy-ring ring-one"></div><div class="energy-ring ring-two"></div><div class="energy-ring ring-three"></div><span class="energy-cross">+</span><div class="energy-label">ОТ ИДЕИ<br>ДО ЗАПУСКА<span></span></div><div class="energy-coordinate">WEB / MOBILE / DESKTOP</div></div>
      <div class="hero-bottom"><span>Личный подход. Прямой контакт.</span><a href="#projects" aria-label="Прокрутить к портфолио">Листайте вниз <span aria-hidden="true">↓</span></a></div>
    </section>

    <section id="projects" class="section portfolio container" data-reveal>
      <div class="section-heading"><div><p class="eyebrow">ПОРТФОЛИО / SELECTED WORK</p><h2>Идеи, которые<br>стали <span>продуктами.</span></h2></div><p class="section-intro">Мои проекты — от мобильных приложений<br>до инструментов для компьютера.</p></div>
      <div class="portfolio-toolbar"><span>Избранные работы</span><div class="filters" role="group" aria-label="Фильтр проектов"><button v-for="item in categories" :key="item" :aria-pressed="category === item" :class="{ active: category === item }" @click="category = item">{{ item }}</button></div></div>
      <TransitionGroup name="project" tag="div" class="project-grid">
        <button v-for="project in visibleProjects" :key="project.id" class="project-card" @click="openProject(project)" :aria-label="`Открыть кейс ${project.title}`">
          <div class="project-art" :class="project.artwork" aria-hidden="true">
            <template v-if="project.artwork === 'keyboard'"><div class="daric-mark">D<span>↗</span></div><div class="key-grid"><span v-for="key in ['Й','Ц','У','К','Е','Н','Ф','Ы','В','А','П','Р','Я','Ч','С','М','И','Т']" :key="key">{{ key }}</span></div></template>
            <template v-else-if="project.artwork === 'player'"><div class="vinyl"><div class="vinyl-center">P</div></div><div class="waveform"><span v-for="(height, i) in [13,27,40,23,55,71,43,86,57,33,65,83,37,53,21,42,29,13]" :key="i" :style="{height: height + 'px'}"></span></div></template>
            <template v-else><div class="projection-screen"><div class="projection-letter">H<span></span></div><div class="projection-line"></div><div class="projection-line short"></div></div><div class="projection-stand"></div><span class="projection-light"></span></template>
            <span class="project-art-label">{{ project.category.toUpperCase() }}</span><span class="project-open">↗</span>
          </div>
          <div class="project-meta"><div><h3>{{ project.title }}</h3><p>{{ project.type }}</p></div><span aria-hidden="true">↗</span></div>
        </button>
      </TransitionGroup>
      <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="portfolio-github">Больше кода и проектов на GitHub <span aria-hidden="true">↗</span></a>
    </section>

    <section id="services" class="section services-section" data-reveal>
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">ЧЕМ МОГУ ПОМОЧЬ</p><h2>Технологии —<br>под <span>вашу задачу.</span></h2></div><p class="section-intro">Не знаете, с чего начать?<br>Сначала разберём задачу и выберем решение.</p></div>
        <div class="services-grid"><article v-for="service in services" :key="service.number" class="service-card"><div class="service-top"><span>{{ service.number }}</span><span aria-hidden="true">↗</span></div><p class="eyebrow">{{ service.label }}</p><h3>{{ service.title }}</h3><p class="service-description">{{ service.description }}</p><ul class="tech-list"><li v-for="item in service.items" :key="item">{{ item }}</li></ul><a :href="`#contact`" class="service-link" @click="draft.platform = service.number === '01' ? 'Сайт' : service.number === '02' ? 'Android-приложение' : 'Программа для компьютера'; persistDraft()">Обсудить разработку <span aria-hidden="true">↗</span></a></article></div>
      </div>
    </section>

    <section id="about" class="section about container" data-reveal>
      <div class="about-title"><p class="eyebrow">О РАЗРАБОТЧИКЕ</p><h2>Один проект.<br><span>Личная<br>ответственность.</span></h2><div class="signature">Максим <span>/ разработчик</span></div></div>
      <div class="about-content"><p class="about-lead">Я разрабатываю сайты и приложения. Мне нравится превращать идеи в инструменты, которыми удобно пользоваться каждый день.</p><p>Работаю с Vue.js, Kotlin, Jetpack Compose и Compose Desktop. Опыт собственных проектов помогает видеть продукт целиком: интерфейс, логику и сценарии использования.</p><p>Со мной можно обсудить задачу напрямую. Начинаем с того, что должно получиться, затем продумываем структуру и последовательно движемся к запуску.</p><div class="about-tools"><span>Vue.js</span><span>Kotlin</span><span>Compose</span></div><a :href="profile.github" target="_blank" rel="noopener noreferrer" class="text-link">Познакомиться с моими проектами <span aria-hidden="true">↗</span></a></div>
    </section>

    <section class="section process container" data-reveal>
      <div class="section-heading"><div><p class="eyebrow">КАК ПРОХОДИТ РАБОТА</p><h2>Понятный путь<br>от идеи <span>до запуска.</span></h2></div></div>
      <ol class="process-grid"><li><span class="step-number">01</span><h3>Обсуждаем</h3><p>Задачи, аудиторию и нужные функции. Согласуем объём, стоимость и сроки.</p></li><li><span class="step-number">02</span><h3>Проектируем</h3><p>Структуру и интерфейс. Показываю, как будет выглядеть и работать продукт.</p></li><li><span class="step-number">03</span><h3>Разрабатываем</h3><p>Превращаю согласованную идею в работающий сайт или приложение.</p></li><li><span class="step-number">04</span><h3>Запускаем</h3><p>Проверяем сценарии, готовим запуск и обсуждаем дальнейшее развитие.</p></li></ol>
      <div class="price-note"><span aria-hidden="true">↗</span><p>Стоимость зависит от задачи.<br><strong>Обсудим объём и бюджет до начала работы.</strong></p><a href="#contact">Расскажите о проекте ↗</a></div>
    </section>

    <section id="contact" class="contact-section" data-reveal>
      <div class="container contact-layout"><div class="contact-copy"><p class="eyebrow">НАЧНЁМ С РАЗГОВОРА</p><h2>Есть идея?<br><span>Давайте<br>создадим.</span></h2><p>Расскажите, что хотите сделать.<br>Краткого описания достаточно,<br>чтобы начать обсуждение.</p><a :href="profile.github" target="_blank" rel="noopener noreferrer" class="github-contact">{{ profile.githubLabel }} <span aria-hidden="true">↗</span></a><a v-if="profile.email" :href="`mailto:${profile.email}`" class="github-contact">{{ profile.email }} ↗</a></div>
        <form id="brief-form" class="brief-form" @submit.prevent="submitBrief" :aria-busy="isSending" @input="persistDraft">
          <div class="form-heading"><h3>Короткий бриф</h3><span aria-hidden="true">↗</span></div>
          <fieldset class="brief-fields" :disabled="isSending"><legend class="sr-only">Данные заявки</legend>
          <label class="form-trap" aria-hidden="true">Ваш сайт<input v-model="website" name="website" tabindex="-1" autocomplete="off"></label>
          <div class="form-row"><label>Как вас зовут<input v-model="draft.name" name="name" autocomplete="name" placeholder="Ваше имя" required maxlength="200"></label><label>Как с вами связаться<input v-model="draft.contact" name="contact" autocomplete="email" placeholder="Email, Telegram или телефон" required maxlength="200"></label></div>
          <label>Что нужно разработать<select v-model="draft.platform" name="platform" @change="persistDraft"><option>Сайт</option><option>Android-приложение</option><option>Программа для компьютера</option><option>Пока не определился</option></select></label>
          <label>Расскажите о задаче<textarea v-model="draft.goal" name="goal" rows="4" placeholder="Для кого продукт, какие задачи он должен решать, желаемые сроки…" required maxlength="4000"></textarea></label>
          </fieldset>
          <div class="form-actions"><button type="submit" class="button button-primary" :disabled="isSending">{{ isSending ? 'Отправляем…' : 'Отправить заявку ↗' }}</button></div>
          <p class="form-note">Оставьте удобный способ связи — я отвечу по указанному контакту.</p>
          <p v-if="contactFeedback" class="form-feedback" role="status">{{ contactFeedback }}</p>
        </form>
      </div>
    </section>
  </main>

  <footer class="site-footer container"><a href="#top" class="brand">maxx<span>dev</span></a><p>© {{ year }} MaxxDev. Сайты и приложения.</p><a href="#top" class="back-top">Наверх <span aria-hidden="true">↑</span></a></footer>

  <dialog ref="caseDialog" class="case-dialog" aria-labelledby="case-title" @close="handleDialogClose" @click="event => { if (event.target === caseDialog) closeProject() }">
    <template v-if="chosenProject"><div class="case-top"><p class="eyebrow">{{ chosenProject.category }} / КЕЙС</p><button class="dialog-close" aria-label="Закрыть кейс" @click="closeProject">×</button></div><h2 id="case-title">{{ chosenProject.title }}</h2><p class="case-description">{{ chosenProject.description }}</p><div class="case-tags"><span v-for="tag in chosenProject.tags" :key="tag">{{ tag }}</span></div><h3>Задача</h3><p>{{ chosenProject.task }}</p><h3>Что реализовано</h3><ul class="case-features"><li v-for="feature in chosenProject.features" :key="feature">{{ feature }}</li></ul><a :href="chosenProject.link" target="_blank" rel="noopener noreferrer" class="button button-primary">{{ chosenProject.linkText }} ↗</a><button class="case-contact text-link" @click="closeProject(); nextTick(() => document.getElementById('contact').scrollIntoView({behavior: mediaQuery?.matches ? 'instant' : 'smooth'}))">Нужен похожий проект? ↗</button></template>
  </dialog>
</template>
