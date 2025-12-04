const CACHE_KEYS = {
  GALLERY: 'invitea_gallery_data',
  PLANS: 'invitea_plans_data',
  FUNCIONES: 'invitea_funciones_data',
  WHY_DIGITAL: 'invitea_why_digital_data'
};

function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    return true;
  } catch (e) { return false; }
}

function getFromCache(key, maxAge = 86400000) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) { return null; }
}

// --- DATA (idéntico al original) ---
const DATA = {
  GALLERY: [
    { id: 1, title: "Basico (Cumpleaños)", description: "Diseño festivo y colorido para celebrar.", image: "https://i.ibb.co/wFVHyPtL/04476d50-b059-4919-b8dc-81ac6d097f40.jpg", demoUrl: "https://invitea.github.io/EjemploCumpleanios/", type: "cumple" },
    { id: 2, title: "Estándar (Primera Comunión)", description: "Diseño festivo y elegante para celebrar.", image: "https://i.ibb.co/MyswS4v6/image.jpg", demoUrl: "https://invitea.github.io/EjemploPrimeraComunion/", confirmUrl: "https://invitea.github.io/EjemploPrimeraComunion_Confirmaciones/", type: "comunion" },
    { id: 3, title: "Premium (Boda)", description: "Diseño elegante para celebrar.", image: "https://i.ibb.co/fzTcNfzT/Maria-YJose.png", demoUrl: "https://invitea.github.io/NuestraBoda_Jose_Y_Maria/", confirmUrl: "https://invitea.github.io/Confirmaciones_Boda_Maria_Y_Jose/", type: "boda" }
  ],
  WHY_DIGITAL: [
    { id: 1, title: "Envío en 48h", description: "Tu invitación lista en máximo 48 horas después de aprobar el diseño", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>` },
    { id: 2, title: "Ahorra hasta $3,000 MXN", description: "Comparado con invitaciones físicas de similar calidad", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` },
    { id: 3, title: "Impacto ecológico cero", description: "Sin papel, sin impresión, sin huella de carbono por envíos", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>` },
    { id: 4, title: "Compartir ilimitado", description: "Envía por WhatsApp, Instagram, email... sin límite de invitados", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>` }
  ],
  FUNCIONES: [
    { id: 1, title: "Portada", description: "Diseño elegante y personalizado que presenta tu evento de manera impactante.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>` },
    { id: 2, title: "Ubicaciones", description: "Mapas interactivos para la ceremonia y recepción con direcciones precisas.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>` },
    { id: 3, title: "Mesa de Regalos", description: "Integración con tus tiendas preferidas para facilitar los regalos a tus invitados.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,12 20,22 4,22 4,12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>` },
    { id: 4, title: "Cuenta Regresiva", description: "Agrega emoción con un contador que muestra el tiempo restante para tu evento.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>` },
    { id: 5, title: "Galería Multimedia", description: "Comparte fotos y videos especiales de la pareja con tus invitados.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>` },
    { id: 6, title: "Itinerario", description: "Programa detallado del evento con horarios y actividades planificadas.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
    { id: 7, title: "Código de Vestimenta", description: "Indica el estilo de vestuario apropiado para que todos luzcan perfectos.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>` },
    { id: 8, title: "RSVP", description: "Sistema de confirmación de asistencia con panel de control en tiempo real.", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17,11 19,13 23,9"></polyline></svg>` }
  ],
  PLANS: [
    { id: "basic", title: "Básico", subtitle: "Perfecto para eventos pequeños", price: "$499 MXN", features: ["Portada (texto y tipografía personalizable)", "2 funciones a elegir", "2 actualizaciones"], recommended: false },
    { id: "standard", title: "Estándar", subtitle: "Nuestro paquete más elegido", price: "$899 MXN", features: ["Portada (texto y tipografía personalizable)", "3 funciones o las que elijas usar", "Confirmación de asistencia", "Panel de confirmaciones en tiempo real", "Actualizaciones ilimitadas"], recommended: true },
    { id: "premium", title: "Premium", subtitle: "Para eventos con máxima personalización", price: "$1,199 MXN", features: ["Portada (texto y tipografía personalizable)", "8 funciones o las que elijas usar", "Confirmación de asistencia", "Panel de confirmaciones en tiempo real", "Actualizaciones ilimitadas"], recommended: false }
  ]
};

// Exponer un objeto global ligero (útil para debugging)
window.inviteaApp = {
  DATA,
  saveToCache,
  getFromCache,
  CACHE_KEYS
};

// --- Render functions (igual que antes, con cache) ---
function animateItems(selector, initialDelay = 100, stepDelay = 80) {
  const nodes = Array.from(document.querySelectorAll(selector));
  nodes.forEach((item, index) => {
    setTimeout(() => item.classList.add('in'), initialDelay + index * stepDelay);
  });
}

function renderGallery() {
  const galleryContainer = document.getElementById('catalog');
  if (!galleryContainer) return;

  const cachedHTML = getFromCache(CACHE_KEYS.GALLERY);
  if (cachedHTML) {
    galleryContainer.innerHTML = cachedHTML;
    animateItems('#catalog .fade-up');
    return;
  }

  const galleryHTML = DATA.GALLERY.map(item => `
    <article class="card elev-1 fade-up" data-title="${item.title}" data-type="${item.type}">
      <div class="thumb" role="img" aria-label="${item.title}">
        <img loading="lazy" decoding="async" alt="Invitación ${item.title}" 
             src="${item.image}" 
             width="800" height="500"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDgwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjhGOUZBIi8+Cjwvc3ZnPgo='">
      </div>
      <div style="margin-top:10px">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="meta">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a class="btn btn-secondary" href="${item.demoUrl}" target="_blank" rel="noopener noreferrer">Demo</a>
            ${item.confirmUrl ? `<a class="btn btn-secondary" href="${item.confirmUrl}" target="_blank" rel="noopener noreferrer">Demo Panel Confirmaciones</a>` : ''}
          </div>
        </div>
      </div>
    </article>
  `).join('');

  galleryContainer.innerHTML = galleryHTML;
  saveToCache(CACHE_KEYS.GALLERY, galleryHTML);
  animateItems('#catalog .fade-up');
}

function renderWhyDigital() {
  const whyContainer = document.querySelector('.why-grid');
  if (!whyContainer) return;

  const cachedHTML = getFromCache(CACHE_KEYS.WHY_DIGITAL);
  if (cachedHTML) {
    whyContainer.innerHTML = cachedHTML;
    animateItems('.why-grid .fade-up');
    return;
  }

  const whyHTML = DATA.WHY_DIGITAL.map(item => `
    <div class="why-card fade-up">
      <div class="why-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');

  whyContainer.innerHTML = whyHTML;
  saveToCache(CACHE_KEYS.WHY_DIGITAL, whyHTML);
  animateItems('.why-grid .fade-up');
}

function renderFunciones() {
  const funcionesContainer = document.getElementById('funcionesContainer');
  if (!funcionesContainer) return;

  const cachedHTML = getFromCache(CACHE_KEYS.FUNCIONES);
  if (cachedHTML) {
    funcionesContainer.innerHTML = cachedHTML;
    animateItems('#funcionesContainer .fade-up');
    return;
  }

  const funcionesHTML = DATA.FUNCIONES.map(funcion => `
    <div class="funcion-card fade-up">
      <div class="funcion-icon">${funcion.icon}</div>
      <h3>${funcion.title}</h3>
      <p>${funcion.description}</p>
    </div>
  `).join('');

  funcionesContainer.innerHTML = funcionesHTML;
  saveToCache(CACHE_KEYS.FUNCIONES, funcionesHTML);
  animateItems('#funcionesContainer .fade-up');
}

function renderPlans() {
  const plansContainer = document.querySelector('.plans-grid');
  if (!plansContainer) return;

  const cachedHTML = getFromCache(CACHE_KEYS.PLANS);
  if (cachedHTML) {
    plansContainer.innerHTML = cachedHTML;
    initPlanInteractions();
    animateItems('.plans-grid .plan-card', 220, 110);
    return;
  }

  const plansHTML = DATA.PLANS.map(plan => `
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
  animateItems('.plans-grid .plan-card', 220, 110);
}

// --- Lazy section loader ---
function initLazyLoading() {
  const sections = [
    { id: 'galeria', loader: renderGallery },
    { id: 'why-digital', loader: renderWhyDigital },
    { id: 'funciones', loader: renderFunciones },
    { id: 'precios', loader: renderPlans }
  ];

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
    }, { rootMargin: '100px', threshold: 0.1 });
    observer.observe(section);
  });
}

// Datepicker init (flatpickr)
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

// Phone formatting helpers
function formatPhoneDigits(digits){
  if(!digits) return '';
  let prefix = '', core = digits;
  if(core.startsWith('52') && core.length > 2){ prefix = '+52 '; core = core.slice(2); } 
  else if(core.startsWith('521') && core.length > 3){ prefix = '+52 '; core = core.slice(3); }
  if(core.length <= 2) return prefix + core;
  if(core.length <= 6) return prefix + core.slice(0,2) + ' ' + core.slice(2);
  const a = core.slice(0,2), b = core.slice(2,6), c = core.slice(6,10);
  return prefix + (c ? `${a} ${b} ${c}` : `${a} ${b}`);
}

function wirePhoneMask(){
  const phoneEl = document.getElementById('phone');
  if(!phoneEl) return;
  phoneEl.addEventListener('input', (e) => {
    const digits = phoneEl.value.replace(/\D/g,'');
    phoneEl.value = formatPhoneDigits(digits);
  });
  phoneEl.addEventListener('paste', (ev) => {
    ev.preventDefault();
    const text = (ev.clipboardData || window.clipboardData).getData('text') || '';
    phoneEl.value = formatPhoneDigits(text.replace(/\D/g,''));
  });
}

function wirePlanCTAs(){
  const planBtns = Array.from(document.querySelectorAll('.plan-cta'));
  const nameField = document.getElementById('name');
  const messageField = document.getElementById('message');
  const selectedPlanField = document.getElementById('selectedPlan');
  const planSelect = document.getElementById('plan');
  const contacto = document.getElementById('contacto');

  const planPrices = {
      'Básico': '$499 MXN',
      'Estándar': '$899 MXN',
      'Premium': '$1,199 MXN'
  };

  if(planSelect){
    planSelect.addEventListener('change', () => {
      const val = planSelect.value;
      const price = planPrices[val];
      if (val && price && messageField) {
          messageField.value = `Estoy interesad@ en el plan "${val}" (pago único ${price}).`;
          if(selectedPlanField) selectedPlanField.value = `${val} — paquete seleccionado (${price})`;
      }
    });
  }

  // Reattach handlers
  planBtns.forEach(b => {
    b.addEventListener('click', ()=> {
      const plan = b.dataset.plan || '';
      const price = b.dataset.price || '';

      if (selectedPlanField) selectedPlanField.value = `${plan} — paquete seleccionado (${price})`;
      if (messageField) messageField.value = `Estoy interesad@ en el plan "${plan}" (pago único ${price}).`;

      if(planSelect) {
        Array.from(planSelect.options).forEach(option => {
           if(option.value === plan) {
              planSelect.value = option.value;
           }
        });
      }

      if (contacto) contacto.scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(()=>{ if(nameField) nameField.focus(); }, 600);
    });
  });
}

function wireWhatsAppAndQuickSample(){
  const whatsappBtn = document.getElementById('whatsappBtn');
  const whatsappFloat = document.getElementById('whatsappFloat');

  function openWhatsApp() {
    const PHONE_IN_E164 = '5215612676844';
    const text = encodeURIComponent('Hola, quiero información sobre una invitación digital. ¿Podrían ayudarme?');
    const url = `https://wa.me/${PHONE_IN_E164}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if(whatsappBtn){
    whatsappBtn.addEventListener('click', openWhatsApp);
  }

  if(whatsappFloat){
    whatsappFloat.addEventListener('click', openWhatsApp);
  }
}

// Modal functionality
function initModal() {
  const modal = document.getElementById('mockupModal');
  const mockupTrigger = document.getElementById('mockupTrigger');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal || !mockupTrigger) return;

  function openModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mockupTrigger.addEventListener('click', openModal);
  mockupTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}

// -------------------------
// Contact form: lazy init Firestore on submit
// -------------------------
(function wireContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Validation helpers (same as original)
    function setFormStatus(msg){
      const s = document.getElementById('formStatus');
      if(s) s.textContent = msg;
    }
    function showToast(msg){
      const toastEl = document.getElementById('contactToast') || document.getElementById('toast');
      if(!toastEl) { console.log('[toast]', msg); return; }
      toastEl.textContent = msg;
      toastEl.style.display = 'block';
      setTimeout(()=> { toastEl.style.display = 'none'; }, 2600);
    }
    function markInvalid(el, msg){
      if(!el) return;
      el.setAttribute('aria-invalid','true');
      if(msg) setFormStatus(msg);
    }
    function clearInvalids(){
      ['name','email','phone','type','date','message'].forEach(id=>{
        const el = form[id];
        if(el) el.removeAttribute('aria-invalid');
      });
      setFormStatus('');
    }

    clearInvalids();

    const submitBtn = document.getElementById('submitBtn');
    const name = (form.name?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const phoneDigits = (form.phone?.value || '').replace(/\D/g,'');
    const type = (form.type?.value || '').trim();
    const planVal = (form.plan?.value || '').trim();
    const message = (form.message?.value || '').trim();
    const dateVal = (form.date?.value || '').trim();
    const selectedPlan = (form.selectedPlan?.value) || '';

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = phoneDigits.length >= 7;

    const dateMatch = dateVal.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let dateOk = false, dateISO = null;
    if(dateMatch){
      const d = parseInt(dateMatch[1],10), m = parseInt(dateMatch[2],10), y = parseInt(dateMatch[3],10);
      const candidate = new Date(y, m - 1, d);
      if(candidate.getFullYear() === y && (candidate.getMonth() + 1) === m && candidate.getDate() === d){
        dateOk = true;
        dateISO = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      }
    }

    if(!name || !emailOk || !phoneOk || !type || !planVal || !message || !dateOk){
      if(!name) markInvalid(form.name);
      if(!emailOk) markInvalid(form.email, 'Ingresa un correo válido');
      if(!phoneOk) markInvalid(form.phone, 'Ingresa un teléfono válido (mín. 7 dígitos)');
      if(!type) markInvalid(form.type);
      if(!planVal) markInvalid(form.plan);
      if(!message) markInvalid(form.message);
      if(!dateOk) markInvalid(form.date, 'Fecha inválida. Usa dd/mm/aaaa');
      showToast('Completa todos los campos correctamente');
      return;
    }

    const payloadForServer = { name, email, phone: phoneDigits, type, plan: planVal, message, date_ddmmyyyy: dateVal, date_iso: dateISO, selectedPlan, ts: new Date().toISOString() };
    const prevBtnText = submitBtn ? submitBtn.textContent : null;
    if(submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
    form.setAttribute('aria-busy','true');
    setFormStatus('');

    // Intentamos enviar a Firestore solo ahora (lazy import)
    let firestoreOk = false;
    try {
      // Import ES module runtime for firestore only when needed
      const firebaseAppModule = await import("https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js");
      const firestoreModule = await import("https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js");

      const firebaseConfig = {
        apiKey: "AIzaSyCTh8kPdvu-6Z5_cckNts22VrhdUTLVspM",
        authDomain: "invitea-f7331.firebaseapp.com",
        projectId: "invitea-f7331",
        storageBucket: "invitea-f7331.firebasestorage.app",
        messagingSenderId: "145115727672",
        appId: "1:145115727672:web:d1d89c20bf946b9e2663cd",
        measurementId: "G-8JS1MDZVGQ"
      };
      const app = firebaseAppModule.initializeApp(firebaseConfig);
      const db = firestoreModule.getFirestore(app);

      // Write doc
      await firestoreModule.addDoc(firestoreModule.collection(db, 'contact_requests'), { ...payloadForServer, createdAt: firestoreModule.serverTimestamp(), userAgent: navigator.userAgent || null });
      firestoreOk = true;
      form.reset();
      showToast('¡Solicitud enviada!');
      setFormStatus('¡Gracias! Recibimos tu solicitud. Te contactamos pronto.');
    } catch (err) {
      console.warn('Error escribiendo en Firestore o Firestore no disponible:', err);
    }

    if(!firestoreOk){
      showToast('Error de conexión. Intenta por WhatsApp.');
      setFormStatus('Error al enviar. Por favor contáctanos por WhatsApp o Email.');
    }

    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = prevBtnText || 'Enviar solicitud'; }
    form.removeAttribute('aria-busy');
  });
})();

// Init UI + interactions
(function init(){
  const criticalImages = ['https://i.ibb.co/1Qf3kqZ/invitea-logo.png', 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=720&auto=format&fit=crop'];
  criticalImages.forEach(src => { (new Image()).src = src; });

  initModal();
  initDatepicker();
  wireWhatsAppAndQuickSample();
  wirePhoneMask();
  initLazyLoading();

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const btnMobile = document.getElementById('btnMobile'), mobileMenu = document.getElementById('mobileMenu');
  let mobileOpen = false;

  function toggleMobile(open){
    if(!mobileMenu || !btnMobile) return;
    mobileOpen = !!open;
    mobileMenu.style.display = mobileOpen ? 'block' : 'none';
    mobileMenu.setAttribute('aria-hidden', String(!mobileOpen));
    btnMobile.setAttribute('aria-expanded', String(mobileOpen));
    const main = document.querySelector('main');
    if(main){
      if('inert' in HTMLElement.prototype) main.inert = mobileOpen;
      else main.setAttribute('aria-hidden', mobileOpen ? 'true' : 'false');
    }
  }

  if(btnMobile) btnMobile.addEventListener('click', ()=> toggleMobile(!mobileOpen));

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = a.getAttribute('href');
      if(target === '#') return;
      const el = document.querySelector(target);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
        if(mobileOpen && mobileMenu) toggleMobile(false);
      }
    });
  });

  window.addEventListener('load', ()=>{
    animateItems('.hero .fade-up');
  });
})();
