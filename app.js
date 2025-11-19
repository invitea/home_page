// ---------- Sistema de Cache Optimizado ----------
const CACHE_KEYS = {
  GALLERY: 'invitea_gallery_data',
  PLANS: 'invitea_plans_data',
  TIMESTAMP: 'invitea_cache_timestamp'
};

// Función para guardar en cache
function saveToCache(key, data) {
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    return true;
  } catch (e) {
    console.warn('Error guardando en cache:', e);
    return false;
  }
}

// Función para leer del cache
function getFromCache(key, maxAge = 24 * 60 * 60 * 1000) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (e) {
    console.warn('Error leyendo cache:', e);
    return null;
  }
}

// ---------- Datos Optimizados ----------
const GALLERY_DATA = [
  {
    id: 1,
    title: "Básico (Cumpleaños)",
    description: "Diseño festivo y colorido para celebrar.",
    image: "https://i.ibb.co/wFVHyPtL/04476d50-b059-4919-b8dc-81ac6d097f40.jpg",
    demoUrl: "https://invitea.github.io/JulianYEliasFEST/",
    type: "cumple"
  },
  {
    id: 2,
    title: "Estándar (Primera Comunión)",
    description: "Diseño festivo y elegante para celebrar.",
    image: "https://i.ibb.co/MyswS4v6/image.jpg",
    demoUrl: "https://invitea.github.io/JimenaLopezGaona/",
    confirmUrl: "https://invitea.github.io/JimenaLopezGaona_PanelControl/",
    type: "comunion"
  },
  {
    id: 3,
    title: "Premium (Boda)",
    description: "Diseño elegante para celebrar.",
    image: "https://i.ibb.co/fzTcNfzT/Maria-YJose.png",
    demoUrl: "https://invitea.github.io/NuestraBoda_Jose_Y_Maria/",
    confirmUrl: "https://invitea.github.io/Confirmaciones_Boda_Maria_Y_Jose/",
    type: "boda"
  }
];

const PLANS_DATA = [
  {
    id: "basic",
    title: "Básico",
    subtitle: "Perfecto para eventos pequeños",
    price: "$499 MXN",
    features: [
      "Portada (texto y tipografía personalizable)",
      "2 funciones a elegir",
      "2 actualizaciones"
    ],
    recommended: false
  },
  {
    id: "standard", 
    title: "Estándar",
    subtitle: "Nuestro paquete más elegido",
    price: "$899 MXN",
    features: [
      "Portada (texto y tipografía personalizable)",
      "3 funciones o las que elijas usar", 
      "Confirmación de asistencia",
      "Panel de confirmaciones en tiempo real",
      "Actualizaciones ilimitadas"
    ],
    recommended: true
  },
  {
    id: "premium",
    title: "Premium", 
    subtitle: "Para eventos con máxima personalización",
    price: "$1,199 MXN",
    features: [
      "Portada (texto y tipografía personalizable)",
      "8 funciones o las que elijas usar",
      "Confirmación de asistencia",
      "Panel de confirmaciones en tiempo real", 
      "Actualizaciones ilimitadas"
    ],
    recommended: false
  }
];

// ---------- Utilidades DOM ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const toastEl = document.getElementById('contactToast') || document.getElementById('toast');

// Mostrar notificaciones toast
function showToast(msg){
  if(!toastEl) { console.log('[toast]', msg); return; }
  toastEl.textContent = msg;
  toastEl.style.display = 'block';
  setTimeout(()=> { toastEl.style.display = 'none'; }, 2600);
}

// Actualizar estado del formulario
function setFormStatus(msg){
  const s = document.getElementById('formStatus');
  if(s) s.textContent = msg;
}

// Limpiar estados de error en formulario
function clearInvalids(form){
  ['name','email','phone','type','date','message'].forEach(id=>{
    const el = form[id];
    if(el) el.removeAttribute('aria-invalid');
  });
  setFormStatus('');
}

// Marcar campo como inválido
function markInvalid(el, msg){
  if(!el) return;
  el.setAttribute('aria-invalid','true');
  if(msg) setFormStatus(msg);
}

// ---------- Renderizado Optimizado de Galería ----------
function renderGallery() {
  const galleryContainer = document.getElementById('catalog');
  if (!galleryContainer) return;
  
  const cachedHTML = getFromCache(CACHE_KEYS.GALLERY);
  if (cachedHTML) {
    galleryContainer.innerHTML = cachedHTML;
    initGalleryInteractions();
    animateGalleryItems();
    return;
  }
  
  const galleryHTML = GALLERY_DATA.map(item => `
    <article class="card elev-1 fade-up" data-title="${item.title}" data-type="${item.type}">
      <div class="thumb" role="img" aria-label="${item.title}">
        <img loading="lazy" alt="Invitación ${item.title}" 
             src="${item.image}" 
             width="800" height="500"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDgwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0zMjAgMjUwTDM4MCAyNzBNNDIwIDIzMEw0NDAgMjUwTTM2MCAyMTBMMzQwIDE5ME0yODAgMjcwTDMwMCAyNTBNNDYwIDIxMEw0ODAgMTkwTTI0MCAyMzBMMjYwIDIxME01MDAgMjUwTDUyMCAyNzBNNTQwIDIzMEw1NjAgMjEwIiBzdHJva2U9IiNENkQ4REQiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIyNTAiIHI9IjQwIiBmaWxsPSIjRDZEOEREIi8+Cjwvc3ZnPgo='">
      </div>
      <div style="margin-top:10px">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="meta">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a class="btn btn-secondary" href="${item.demoUrl}" target="_blank" rel="noopener noreferrer">Demo</a>
            ${item.confirmUrl ? `<a class="btn btn-secondary" href="${item.confirmUrl}" target="_blank" rel="noopener noreferrer">Demo Confirmaciones</a>` : ''}
          </div>
        </div>
      </div>
    </article>
  `).join('');
  
  galleryContainer.innerHTML = galleryHTML;
  
  saveToCache(CACHE_KEYS.GALLERY, galleryHTML);
  
  initGalleryInteractions();
  animateGalleryItems();
}

// Animación de items de galería
function animateGalleryItems() {
  const items = document.querySelectorAll('#catalog .fade-up');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('in');
    }, 100 + index * 80);
  });
}

// Función para inicializar interacciones de galería
function initGalleryInteractions() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        const img = card.querySelector('img');
        if (img) {
          openModal(img.src, card.dataset.title, card.querySelector('p').textContent);
        }
      }
    });
  });
}

// ---------- Renderizado Optimizado de Planes ----------
function renderPlans() {
  const plansContainer = document.querySelector('.plans-grid');
  if (!plansContainer) return;
  
  const cachedHTML = getFromCache(CACHE_KEYS.PLANS);
  if (cachedHTML) {
    plansContainer.innerHTML = cachedHTML;
    initPlanInteractions();
    animatePlanItems();
    return;
  }
  
  const plansHTML = PLANS_DATA.map(plan => `
    <article class="plan-card fade-up ${plan.recommended ? 'recommended' : ''}" 
             role="listitem" aria-labelledby="plan-${plan.id}">
      ${plan.recommended ? '<div class="plan-badge" aria-hidden="true">Recomendado</div>' : ''}
      
      <header>
        <h3 id="plan-${plan.id}" class="plan-title">${plan.title}</h3>
        <p class="plan-sub">${plan.subtitle}</p>
      </header>

      <div class="plan-price" aria-hidden="true">${plan.price} <small>/ pago único</small></div>

      <ul class="plan-features">
        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>

      <div class="plan-cta-row">
        <button type="button" class="btn plan-cta" 
                data-plan="${plan.title}" 
                data-price="${plan.price}" 
                aria-label="Comprar plan ${plan.title}">
          Comprar
        </button>
      </div>
    </article>
  `).join('');
  
  plansContainer.innerHTML = plansHTML;
  
  saveToCache(CACHE_KEYS.PLANS, plansHTML);
  
  initPlanInteractions();
  animatePlanItems();
}

// Animación de items de planes
function animatePlanItems() {
  const items = document.querySelectorAll('.plans-grid .plan-card');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('in');
    }, 220 + index * 110);
  });
}

// Función para inicializar interacciones de planes
function initPlanInteractions() {
  wirePlanCTAs();
}

// ---------- Carga Diferida con Intersection Observer ----------
function initLazyLoading() {
  const sections = [
    { id: 'galeria', loader: renderGallery },
    { id: 'precios', loader: renderPlans }
  ];

  const observers = [];

  sections.forEach(({ id, loader }) => {
    const section = document.getElementById(id);
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loader();
          observer.unobserve(entry.target);
        }
      });
    }, { 
      rootMargin: '100px',
      threshold: 0.1 
    });

    observer.observe(section);
    observers.push(observer);
  });

  return observers;
}

// ---------- Inicialización del selector de fecha ----------
function initDatepicker(){
  if(typeof flatpickr === 'undefined'){ console.warn('flatpickr no cargado'); return; }
  try { if(flatpickr.l10ns && flatpickr.l10ns.es) flatpickr.localize(flatpickr.l10ns.es); } catch(e){}
  flatpickr('#date', {
    dateFormat: 'd/m/Y',
    altInput: false,
    allowInput: true,
    clickOpens: true,
    disableMobile: true,
    minDate: 'today'
  });
}

// ---------- Formateo de teléfono ----------
function formatPhoneDigits(digits){
  if(!digits) return '';
  let prefix = '';
  let core = digits;
  
  if(core.startsWith('52') && core.length > 2){
    prefix = '+52 ';
    core = core.slice(2);
  } else if(core.startsWith('521') && core.length > 3){
    prefix = '+52 ';
    core = core.slice(3);
  }
  
  if(core.length <= 2) return prefix + core;
  if(core.length <= 6) {
    return prefix + core.slice(0,2) + ' ' + core.slice(2);
  }
  
  const a = core.slice(0,2);
  const b = core.slice(2,6);
  const c = core.slice(6,10);
  if(c) return prefix + `${a} ${b} ${c}`;
  return prefix + `${a} ${b}`;
}

// Aplicar máscara de teléfono
function wirePhoneMask(){
  const phoneEl = document.getElementById('phone');
  if(!phoneEl) return;
  
  phoneEl.addEventListener('input', (e) => {
    const digits = phoneEl.value.replace(/\D/g,'');
    const formatted = formatPhoneDigits(digits);
    phoneEl.value = formatted;
  });
  
  phoneEl.addEventListener('paste', (ev) => {
    ev.preventDefault();
    const text = (ev.clipboardData || window.clipboardData).getData('text') || '';
    const digits = text.replace(/\D/g,'');
    phoneEl.value = formatPhoneDigits(digits);
  });
}

// ---------- Botones de planes ----------
function wirePlanCTAs(){
  const planBtns = $$('.plan-cta');
  planBtns.forEach(b => { b.replaceWith(b.cloneNode(true)); });
  
  $$('.plan-cta').forEach(b => b.addEventListener('click', ()=> {
    const plan = b.dataset.plan || '';
    const price = b.dataset.price || '';
    const nameField = $('#name');
    const messageField = $('#message');
    const selectedPlanField = $('#selectedPlan');

    if (selectedPlanField) selectedPlanField.value = `${plan} — paquete seleccionado (${price})`;
    if (messageField) messageField.value = `Estoy interesad@ en el plan "${plan}" (pago único ${price}).`;

    const contacto = $('#contacto');
    if (contacto) contacto.scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(()=>{ if(nameField) nameField.focus(); }, 600);
  }));
}

// ---------- Modal de vista previa ----------
const modal = $('#modal'), 
      modalImage = $('#modalImage'), 
      modalTitle = $('#modalTitle'), 
      modalDesc = $('#modalDesc'), 
      modalClose = $('#modalClose');
      
let lastFocused = null;

function setBackgroundInert(inert){
  const main = $('main'), head = $('header'), foot = $('footer');
  [main, head, foot].forEach(el=>{
    if(!el) return;
    if('inert' in HTMLElement.prototype) el.inert = inert;
    else inert ? el.setAttribute('aria-hidden','true') : el.removeAttribute('aria-hidden');
  });
}

function getModalFocusables() {
  return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => el.offsetParent !== null && el.getClientRects().length);
}

function trapFocus(e){
  if(e.key !== 'Tab') return;
  const focusables = getModalFocusables();
  if (focusables.length === 0) { e.preventDefault(); return; }
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

function onModalKey(e){ 
  if(e.key === 'Escape'){ closeModal(); return; } 
  trapFocus(e); 
}

function openModal(src, title, desc){
  if(!modal) return;
  lastFocused = document.activeElement;
  if(modalImage) modalImage.src = src || '';
  if(modalTitle) modalTitle.textContent = title || 'Invitación';
  if(modalDesc) modalDesc.textContent = desc || 'Vista previa del diseño.';
  modal.classList.add('show'); 
  modal.setAttribute('aria-hidden','false'); 
  document.body.style.overflow='hidden';
  setBackgroundInert(true);
  setTimeout(()=>{ if(modalClose) modalClose.focus(); }, 40);
  document.addEventListener('keydown', onModalKey);
}

function closeModal(){
  if(!modal) return;
  modal.classList.remove('show'); 
  modal.setAttribute('aria-hidden','true'); 
  if(modalImage) modalImage.src = '';
  document.body.style.overflow=''; 
  setBackgroundInert(false);
  if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  document.removeEventListener('keydown', onModalKey);
}

if (modal) { 
  modal.addEventListener('click', (e) => { 
    if (e.target === modal) closeModal(); 
  }); 
}

if(modalClose) modalClose.addEventListener('click', closeModal);

// ---------- WhatsApp y muestra rápida ----------
function wireWhatsAppAndQuickSample(){
  const whatsappBtn = document.getElementById('whatsappBtn');
  if(whatsappBtn){
    whatsappBtn.addEventListener('click', ()=>{
      const attrPhone = whatsappBtn.dataset.phone;
      const PHONE_IN_E164 = (typeof attrPhone === 'string' && attrPhone.trim() !== '') ? attrPhone.replace(/\D/g,'') : '5215512345678';
      const validPhone = /^[0-9]{7,15}$/.test(PHONE_IN_E164);
      if(!validPhone){ showToast('WhatsApp no configurado'); return; }
      const text = encodeURIComponent('Hola, quiero información sobre una invitación digital. ¿Podrían ayudarme?');
      const url = `https://wa.me/${PHONE_IN_E164}?text=${text}`;
      const win = window.open(url, '_blank', 'noopener');
      if(win) try { win.opener = null; } catch(e){ }
      else { window.location.href = url; }
    });
  }
}

// ---------- Manejo del formulario de contacto ----------
(function wireContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) { console.warn('Contacto: no se encontró #contactForm'); return; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    clearInvalids(form);

    const submitBtn = document.getElementById('submitBtn');
    const name = (form.name?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const phoneRaw = (form.phone?.value || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g,'');
    const phoneOk = phoneDigits.length >= 7;
    const type = (form.type?.value || '').trim();
    const message = (form.message?.value || '').trim();
    const dateVal = (form.date?.value || '').trim();
    const selectedPlan = (form.selectedPlan && form.selectedPlan.value) ? form.selectedPlan.value : null;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

    // Validación de fecha (dd/mm/aaaa)
    const dateMatch = dateVal.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let dateOk = false;
    if(dateMatch){
      const d = parseInt(dateMatch[1],10), m = parseInt(dateMatch[2],10), y = parseInt(dateMatch[3],10);
      const candidate = new Date(y, m - 1, d);
      if(candidate && candidate.getFullYear() === y && (candidate.getMonth() + 1) === m && candidate.getDate() === d){
        dateOk = true;
      }
    }

    // Validación de campos
    if(!name || !emailOk || !phoneOk || !type || !message || !dateOk){
      if(!name) markInvalid(form.name);
      if(!emailOk) markInvalid(form.email, 'Ingresa un correo válido');
      if(!phoneOk) markInvalid(form.phone, 'Ingresa un teléfono válido (mín. 7 dígitos)');
      if(!type) markInvalid(form.type);
      if(!message) markInvalid(form.message);
      if(!dateOk) markInvalid(form.date, 'Fecha inválida. Usa dd/mm/aaaa');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if(firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
      showToast('Completa todos los campos correctamente');
      return;
    }

    // Estado de envío
    const prevBtnText = submitBtn ? submitBtn.textContent : null;
    if(submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
    form.setAttribute('aria-busy','true');
    setFormStatus('');

    // Envío por email (solución para GitHub Pages)
    const emailBody = `
Nombre: ${name}
Email: ${email}
Teléfono: ${phoneRaw}
Tipo de evento: ${type}
Fecha del evento: ${dateVal}
Plan seleccionado: ${selectedPlan || 'No especificado'}

Mensaje:
${message}
    `.trim();

    const mailtoLink = `mailto:invitea.design@gmail.com?subject=Solicitud de invitación digital - ${name}&body=${encodeURIComponent(emailBody)}`;
    
    // Abrir cliente de email
    window.location.href = mailtoLink;
    showToast('Redirigiendo a tu cliente de email...');
    
    // Reset después de un tiempo
    setTimeout(() => {
      form.reset();
      setFormStatus('¡Gracias! Revisa tu cliente de email para completar el envío.');
    }, 3000);

    // Restaurar estado del botón
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = prevBtnText || 'Enviar solicitud'; }
    form.removeAttribute('aria-busy');
  });
})();

// ---------- Inicialización Optimizada de la Aplicación ----------
(function init(){
  // Precarga de imágenes críticas
  const criticalImages = [
    'https://i.ibb.co/1Qf3kqZ/invitea-logo.png',
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=720&auto=format&fit=crop'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Inicializar componentes básicos
  initDatepicker();
  wireWhatsAppAndQuickSample();
  wirePhoneMask();

  // Carga diferida de secciones pesadas
  initLazyLoading();

  // Año actual en footer
  const yearEl = $('#year'); 
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const btnMobile = $('#btnMobile'), mobileMenu = $('#mobileMenu');
  let mobileOpen = false;
  
  function toggleMobile(open){
    if(!mobileMenu || !btnMobile) return;
    mobileOpen = !!open;
    mobileMenu.style.display = mobileOpen ? 'block' : 'none';
    mobileMenu.setAttribute('aria-hidden', String(!mobileOpen));
    btnMobile.setAttribute('aria-expanded', String(mobileOpen));
    const main = document.querySelector('main');
    if(main){
      if('inert' in HTMLElement.prototype){ main.inert = mobileOpen; }
      else { if(mobileOpen) main.setAttribute('aria-hidden', 'true'); else main.removeAttribute('aria-hidden'); }
    }
  }
  
  if(btnMobile){ 
    btnMobile.addEventListener('click', ()=> toggleMobile(!mobileOpen)); 
  }

  // Navegación suave
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = a.getAttribute('href');
      if(target === '#') return;
      const el = document.querySelector(target);
      if(el){ 
        e.preventDefault(); 
        el.scrollIntoView({behavior:'smooth', block:'start'}); 
        if(mobileOpen && mobileMenu){ toggleMobile(false); } 
      }
    });
  });

  // Animaciones de entrada básicas
  window.addEventListener('load', ()=>{
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => 
      setTimeout(() => el.classList.add('in'), 100 + i * 80)
    );
  });
})();