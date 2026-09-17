import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { timelineData } from './data.js'

gsap.registerPlugin(ScrollTrigger)

// ─── Month labels ───
const MONTH_PT = {
  'JANEIRO': 'Janeiro', 'FEVEREIRO': 'Fevereiro', 'MARÇO': 'Março',
  'ABRIL': 'Abril', 'MAIO': 'Maio', 'JUNHO': 'Junho',
  'JULHO': 'Julho', 'AGOSTO': 'Agosto', 'SETEMBRO': 'Setembro',
  'OUTUBRO': 'Outubro', 'NOVEMBRO': 'Novembro', 'DEZEMBRO': 'Dezembro'
}

// ─── Era color palette ───
function getEraColors(yearStr) {
  const isBC = /a\.c\./i.test(yearStr)
  const num = parseInt(yearStr.replace(/[^\d]/g, '')) || 0
  const year = isBC ? -num : num

  if (year < -800)  return { c1: '#E8D5A8', c2: '#D4BC88', name: 'Pré-História' }
  if (year < 0)     return { c1: '#C4D8EC', c2: '#A8C4DC', name: 'Antiguidade' }
  if (year < 500)   return { c1: '#EAE0C8', c2: '#D8CCA8', name: 'Antiguidade Clássica' }
  if (year < 1000)  return { c1: '#C8DCC8', c2: '#A8C8A8', name: 'Alta Idade Média' }
  if (year < 1400)  return { c1: '#E2D8C4', c2: '#CCBFA4', name: 'Idade Média' }
  if (year < 1600)  return { c1: '#F0DEC0', c2: '#DECA9C', name: 'Renascimento' }
  if (year < 1750)  return { c1: '#BED8EC', c2: '#A0C4DC', name: 'Era Moderna' }
  if (year < 1870)  return { c1: '#E4DCCC', c2: '#CCCAB0', name: 'Século XVIII–XIX' }
  if (year < 1914)  return { c1: '#ECD8E4', c2: '#D8C0D0', name: 'Belle Époque' }
  if (year < 1945)  return { c1: '#D8D4D0', c2: '#C0BCB8', name: 'Guerras Mundiais' }
  if (year < 1970)  return { c1: '#C4D8E8', c2: '#A8C8DC', name: 'Pós-Guerra' }
  if (year < 2000)  return { c1: '#C8D4DC', c2: '#B0C0CC', name: 'Guerra Fria' }
  return              { c1: '#D4E4F0', c2: '#BCD0E4', name: 'Século XXI' }
}

// ─── Flatten all days ───
function getAllDays() {
  const days = []
  timelineData.forEach(m => {
    m.days.forEach(d => {
      days.push({ ...d, month: m.month, monthNum: m.monthNum, monthLabel: MONTH_PT[m.month] })
    })
  })
  return days
}

// ─── Build panel for a day ───
function buildPanel(dayData, index, total) {
  const isSDD = dayData.day === 'SDD'
  const firstYear = dayData.events[0]?.year || '1900'
  const era = getEraColors(firstYear)

  const panel = document.createElement('div')
  panel.className = isSDD ? 'day-panel sdd-panel' : 'day-panel'
  panel.dataset.index = index
  panel.dataset.month = dayData.monthNum
  panel.dataset.day = dayData.day

  // ── Visual side ──
  const visual = document.createElement('div')
  visual.className = 'panel-visual'

  if (isSDD) {
    visual.innerHTML = `
      <div class="panel-visual-bg" style="background: linear-gradient(135deg, #D8CFC0, #C4B99A)"></div>
      <div class="panel-visual-pattern"></div>
      <div class="panel-visual-inner sdd-visual-inner">
        <div class="sdd-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="1.5"/>
            <path d="M24 14v11l7 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 8l32 32" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
          </svg>
        </div>
        <div class="deco-year">${dayData.monthLabel}</div>
        <div class="era-badge">Sem data determinada</div>
      </div>
    `
  } else {
    visual.innerHTML = `
      <div class="panel-visual-bg" style="--era-c1: ${era.c1}; --era-c2: ${era.c2}; background: linear-gradient(135deg, ${era.c1}, ${era.c2})"></div>
      <div class="panel-visual-pattern"></div>
      <div class="panel-visual-inner">
        <div class="image-placeholder">
          <svg class="image-ph-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="14" cy="17" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 27l8-7 6 5 5-4 13 10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <span class="image-ph-text">Espaço para imagem</span>
        </div>
        <div class="deco-year">${firstYear}</div>
        <div class="era-badge">${era.name}</div>
      </div>
    `
  }

  // ── Content side ──
  const content = document.createElement('div')
  content.className = 'panel-content'

  const eventsHtml = dayData.events.map(ev => `
    <div class="event-entry">
      <span class="event-yr">${ev.year}</span>
      <span class="event-desc">${ev.text}</span>
    </div>
  `).join('')

  if (isSDD) {
    content.innerHTML = `
      <div class="panel-date-header sdd-header">
        <span class="sdd-label">Eventos sem data exata</span>
        <span class="panel-month-name">${dayData.monthLabel}</span>
        <span class="panel-event-total">${dayData.events.length} registro${dayData.events.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="panel-events sdd-events">${eventsHtml}</div>
      <div class="panel-index">
        <span class="panel-index-num sdd-index-label">Data incerta · ${dayData.monthLabel}</span>
        <span class="arrow-hint">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          role para continuar
        </span>
      </div>
    `
  } else {
    content.innerHTML = `
      <div class="panel-date-header">
        <span class="panel-day-num">${dayData.day}</span>
        <span class="panel-month-name">${dayData.monthLabel}</span>
        <span class="panel-event-total">${dayData.events.length} evento${dayData.events.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="panel-events">${eventsHtml}</div>
      <div class="panel-index">
        <span class="panel-index-num">Dia ${String(index + 1).padStart(3, '0')} / ${total}</span>
        <span class="arrow-hint">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          role para continuar
        </span>
      </div>
    `
  }

  panel.appendChild(visual)
  panel.appendChild(content)
  return panel
}

// ─── Build all panels ───
function buildTimeline() {
  const track = document.getElementById('panels-track')
  const allDays = getAllDays()

  allDays.forEach((day, i) => {
    const panel = buildPanel(day, i, allDays.length)
    track.appendChild(panel)
  })

  return allDays
}

// ─── Hero animation ───
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('.hero-eyebrow', { opacity: 0, y: 24, duration: 0.8 })
    .from('.hero-line', { opacity: 0, y: 64, duration: 1, stagger: 0.12 }, '-=0.5')
    .from('.hero-desc', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
    .from('.hero-cta', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.stat-item, .stat-sep', { opacity: 0, y: 12, duration: 0.5, stagger: 0.07 }, '-=0.3')
}

// ─── Horizontal scroll ───
function setupHorizontalScroll(allDays) {
  const track = document.getElementById('panels-track')
  const wrapper = document.getElementById('timeline-wrapper')
  const progressBar = document.getElementById('progress-bar')
  const dayIndicator = document.getElementById('day-indicator')

  const getScrollDist = () => track.scrollWidth - window.innerWidth

  const scrollTween = gsap.to(track, {
    x: () => -getScrollDist(),
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${getScrollDist()}`,
      invalidateOnRefresh: true,
      onUpdate(self) {
        progressBar.style.width = `${self.progress * 100}%`

        // Current visible panel index
        const currentX = gsap.getProperty(track, 'x')
        const panelIndex = Math.round(-currentX / window.innerWidth)
        const clampedIdx = Math.max(0, Math.min(panelIndex, allDays.length - 1))
        const day = allDays[clampedIdx]

        if (day) {
          dayIndicator.textContent = `${day.day} · ${day.monthLabel}`
          updateActivePill(day.monthNum)
        }
      }
    }
  })

  // ── Panel entrance: reveal events with IntersectionObserver-style via containerAnimation ──
  const panels = document.querySelectorAll('.day-panel')

  panels.forEach(panel => {
    // When panel enters the viewport, animate its events in
    gsap.fromTo(panel.querySelector('.panel-visual-inner'),
      { scale: 1.05, opacity: 0.6 },
      {
        scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 80%',
          end: 'left 20%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    gsap.fromTo(panel.querySelector('.panel-date-header'),
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 75%',
          end: 'left 45%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    // Events: stagger in
    const events = panel.querySelectorAll('.event-entry')
    gsap.fromTo(events,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 65%',
          end: 'left 30%',
          toggleActions: 'play none none reverse',
        }
      }
    )
  })

  window.addEventListener('resize', () => ScrollTrigger.refresh())
  return scrollTween
}

// ─── Active month pill ───
function updateActivePill(monthNum) {
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.month) === monthNum)
  })
}

// ─── Month nav via pills ───
function setupMonthNav(scrollTween) {
  const track = document.getElementById('panels-track')
  const wrapper = document.getElementById('timeline-wrapper')

  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const monthNum = parseInt(pill.dataset.month)
      const targetPanel = document.querySelector(`.day-panel[data-month="${monthNum}"]`)
      if (!targetPanel) return

      const panelIndex = parseInt(targetPanel.dataset.index)
      const totalPanels = document.querySelectorAll('.day-panel').length
      const totalScroll = track.scrollWidth - window.innerWidth
      const progress = panelIndex / (totalPanels - 1)

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY
      const targetY = wrapperTop + progress * totalScroll
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    })
  })
}

// ─── Search ───
function setupSearch(allDays) {
  const input = document.getElementById('search-input')
  const overlay = document.getElementById('search-overlay')
  const grid = document.getElementById('search-results')
  const countEl = document.getElementById('search-count')
  const closeBtn = document.getElementById('close-search')

  // Flatten events
  const allEvents = []
  allDays.forEach((day, di) => {
    day.events.forEach(ev => {
      allEvents.push({
        year: ev.year, text: ev.text,
        day: day.day, monthLabel: day.monthLabel,
        monthNum: day.monthNum, dayIndex: di,
        label: `${day.day} de ${day.monthLabel}`
      })
    })
  })

  function hl(str, q) {
    if (!q) return str
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return str.replace(re, '<mark>$1</mark>')
  }

  let timer = null
  function doSearch(q) {
    q = q.trim()
    if (q.length < 2) { overlay.classList.add('hidden'); return }
    overlay.classList.remove('hidden')

    const ql = q.toLowerCase()
    const matches = allEvents.filter(ev =>
      ev.text.toLowerCase().includes(ql) ||
      ev.year.toLowerCase().includes(ql) ||
      ev.monthLabel.toLowerCase().includes(ql) ||
      ev.label.toLowerCase().includes(ql)
    ).slice(0, 80)

    countEl.textContent = `${matches.length} evento${matches.length !== 1 ? 's' : ''} encontrado${matches.length !== 1 ? 's' : ''}`

    grid.innerHTML = matches.map(ev => `
      <div class="search-result-card" data-day-index="${ev.dayIndex}">
        <div class="result-date">${hl(ev.label.toUpperCase(), q)}</div>
        <div class="result-year">${hl(ev.year, q)}</div>
        <p class="result-text">${hl(ev.text, q)}</p>
      </div>
    `).join('')

    grid.querySelectorAll('.search-result-card').forEach(card => {
      card.addEventListener('click', () => {
        const di = parseInt(card.dataset.dayIndex)
        closeSearch()
        navigateToPanel(di)
      })
    })
  }

  function navigateToPanel(dayIndex) {
    const track = document.getElementById('panels-track')
    const wrapper = document.getElementById('timeline-wrapper')
    const totalPanels = document.querySelectorAll('.day-panel').length
    const totalScroll = track.scrollWidth - window.innerWidth
    const progress = dayIndex / (totalPanels - 1)
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: wrapperTop + progress * totalScroll, behavior: 'smooth' })
  }

  function closeSearch() {
    overlay.classList.add('hidden')
    input.value = ''
  }

  input.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(() => doSearch(input.value), 200)
  })

  input.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch() })
  closeBtn.addEventListener('click', closeSearch)

  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault(); input.focus()
    }
  })
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  const allDays = buildTimeline()
  animateHero()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const scrollTween = setupHorizontalScroll(allDays)
      setupMonthNav(scrollTween)
      setupSearch(allDays)
    })
  })
})
