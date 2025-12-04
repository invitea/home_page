const CACHE_KEYS = {
  GALLERY: 'invitea_gallery_data',
  PLANS: 'invitea_plans_data',
  FUNCIONES: 'invitea_funciones_data',
  WHY_DIGITAL: 'invitea_why_digital_data'
};

function saveToCache(key, data){
  try{ localStorage.setItem(key, JSON.stringify({data,timestamp:Date.now()})); return true }catch(e){return false}
}
function getFromCache(key, maxAge=86400000){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return null;
    const {data,timestamp} = JSON.parse(raw);
    if(Date.now()-timestamp>maxAge){ localStorage.removeItem(key); return null }
    return data;
  }catch(e){ return null; }
}

// --- DATA (basado en tu app original)
const DATA = {
  GALLERY: [
    { id: 1, title: "Básico (Cumpleaños)", description: "Diseño festivo y colorido para celebrar.", image: "https://i.ibb.co/wFVHyPtL/04476d50-b059-4919-b8dc-81ac6d097f40.jpg", demoUrl: "https://invitea.github.io/EjemploCumpleanios/", type: "cumple" },
    { id: 2, title: "Estándar (Primera Comunión)", description: "Diseño festivo y elegante para celebrar.", image: "https://i.ibb.co/MyswS4v6/image.jpg", demoUrl: "https://invitea.github.io/EjemploPrimeraComunion/", confirmUrl: "https://invitea.github.io/EjemploPrimeraComunion_Confirmaciones/", type: "comunion" },
    { id: 3, title: "Premium (Boda)", description: "Diseño elegante para celebrar.", image: "https://i.ibb.co/fzTcNfzT/Maria-YJose.png", demoUrl: "https://invitea.github.io/NuestraBoda_Jose_Y_Maria/", confirmUrl: "https://invitea.github.io/Confirmaciones_Boda_Maria_Y_Jose/", type: "boda" }
  ],
  WHY_DIGITAL: [
    { id: 1, title: "Envío en 48h", description: "Tu invitación lista en máximo 48 horas después de aprobar el diseño", icon: "" },
    { id: 2, title: "Ahorra hasta $3,000 MXN", description: "Comparado con invitaciones físicas de similar calidad", icon: "" },
    { id: 3, title: "Impacto ecológico cero", description: "Sin papel, sin impresión, sin huella de carbono por envíos", icon: "" }
  ],
  FUNCIONES: [
    { id: 1, title: "Portada", description: "Diseño elegante y personalizado que presenta tu evento." },
    { id: 2, title: "Ubicaciones", description: "Mapas interactivos para la ceremonia y recepción." },
    { id: 3, title: "RSVP", description: "Confirmaciones con panel en tiempo real." }
  ],
  PLANS: [
    { id: "basic", title: "Básico", subtitle: "Perfecto para eventos pequeños", price: "$499 MXN", features: ["Portada", "2 funciones"], recommended: false },
    { id: "standard", title: "Estándar", subtitle: "Nuestro paquete más elegido", price: "$899 MXN", features: ["Portada", "3 funciones", "Confirmación de asistencia"], recommended: true },
    { id: "premium", title: "Premium", subtitle: "Para eventos con máxima personalización", price: "$1,199 MXN", features: ["8 funciones", "Panel de confirmaciones", "Actualizaciones ilimitadas"], recommended: false }
  ]
};

// Exponer DATA (debug)
window.inviteaApp = { DATA };

// Animaciones pequeñas
function animateItems(selector, initialDelay = 80, step = 80){
  const nodes = Array.from(document.querySelectorAll(selector));
  nodes.forEach((n,i)=> setTimeout(()=> n.classList.add('in'), initialDelay + i*step));
}

// Renders
function renderGallery(){
  const el = document.getElementById('catalog'); if(!el) return;
  const cached = getFromCache(CACHE_KEYS.GALLERY);
  if(cached){ el.innerHTML = cached; animateItems('#catalog .fade-up'); return; }
  const html = DATA.GALLERY.map(item => `
    <article class="card elev-1 fade-up">
      <div class="thumb"><img loading="lazy" decoding="async" alt="Invitación ${item.title}" src="${item.image}"></div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="meta"><a class="btn btn-secondary" href="${item.demoUrl}" target="_blank" rel="noopener">Demo</a></div>
    </article>
  `).join('');
  el.innerHTML = html; saveToCache(CACHE_KEYS.GALLERY, html); animateItems('#catalog .fade-up');
}

function renderWhy(){
  const el = document.querySelector('.why-grid'); if(!el) return;
  const cached = getFromCache(CACHE_KEYS.WHY_DIGITAL);
  if(cached){ el.innerHTML = cached; animateItems('.why-grid .fade-up'); return; }
  const html = DATA.WHY_DIGITAL.map(w => `<div class="why-card fade-up"><h3>${w.title}</h3><p>${w.description}</p></div>`).join('');
  el.innerHTML = html; saveToCache(CACHE_KEYS.WHY_DIGITAL, html); animateItems('.why-grid .fade-up');
}

function renderFunciones(){
  const el = document.getElementById('funcionesContainer'); if(!el) return;
  const cached = getFromCache(CACHE_KEYS.FUNCIONES);
  if(cached){ el.innerHTML = cached; animateItems('#funcionesContainer .fade-up'); return; }
  const html = DATA.FUNCIONES.map(f => `<div class="funcion-card fade-up"><h3>${f.title}</h3><p>${f.description}</p></div>`).join('');
  el.innerHTML = html; saveToCache(CACHE_KEYS.FUNCIONES, html); animateItems('#funcionesContainer .fade-up');
}

function renderPlans(){
  const el = document.querySelector('.plans-grid'); if(!el) return;
  const cached = getFromCache(CACHE_KEYS.PLANS);
  if(cached){ el.innerHTML = cached; attachPlanListeners(); animateItems('.plans-grid .plan-card', 120, 120); return; }
  const html = DATA.PLANS.map(p => `
    <article class="plan-card fade-up ${p.recommended ? 'recommended' : ''}" data-plan="${p.title}">
      ${p.recommended?'<div class="plan-badge">Recomendado</div>':''}
      <h3 class="plan-title">${p.title}</h3>
      <p class="plan-sub">${p.subtitle}</p>
      <div class="plan-price">${p.price}</div>
      <ul class="plan-features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
      <div class="plan-cta-row">
        <button class="plan-cta btn" type="button" aria-label="Seleccionar plan ${p.title}" data-plan="${p.title}" data-price="${p.price}">Comprar</button>
      </div>
    </article>
  `).join('');
  el.innerHTML = html;
  saveToCache(CACHE_KEYS.PLANS, html);
  attachPlanListeners();
  animateItems('.plans-grid .plan-card', 120, 120);
}

// Attach listeners to plan buttons and plan select
function attachPlanListeners(){
  // Delegate clicks from .plans-grid (works even after re-render)
  const plansGrid = document.querySelector('.plans-grid');
  if(plansGrid && !plansGrid._hasDelegate){
    plansGrid.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.plan-cta');
      if(!btn) return;
      const plan = btn.dataset.plan || btn.closest('[data-plan]')?.dataset.plan || '';
      const price = btn.dataset.price || btn.closest('[data-plan]')?.querySelector('.plan-price')?.textContent || '';
      if(plan) applyPlanToForm(plan, price);
    });
    plansGrid._hasDelegate = true;
  }

  // Ensure plan select also fills message
  const planSelect = document.getElementById('plan');
  if(planSelect && !planSelect._bound){
    planSelect.addEventListener('change', ()=>{
      const val = planSelect.value;
      const planObj = DATA.PLANS.find(p => p.title === val);
      const price = planObj ? planObj.price : '';
      applyPlanToForm(val, price);
    });
    planSelect._bound = true;
  }
}

function applyPlanToForm(plan, price){
  const select = document.getElementById('plan');
  const message = document.getElementById('message');
  const selectedPlan = document.getElementById('selectedPlan');

  // Set select if matches
  if(select){
    const opt = Array.from(select.options).find(o => o.value === plan);
    if(opt) select.value = opt.value;
  }
  // Fill message and hidden selectedPlan
  const msg = `Estoy interesad@ en el plan "${plan}" ${price ? `(${price})` : ''}.`;
  if(message && !message.dataset.userEdited){
    // Only overwrite if user hasn't typed manually (respect user input)
    message.value = msg;
  } else if(message && message.dataset.userEdited){
    // If user edited, we append
    message.value = message.value + `\n\nInteresado en: ${plan} ${price || ''}`;
  }
  if(selectedPlan) selectedPlan.value = `${plan} ${price || ''}`;
  // focus message
  if(message) message.focus();
}

// Respect user typed message (don't overwrite)
function watchMessageUserEdit(){
  const message = document.getElementById('message');
  if(!message) return;
  message.addEventListener('input', ()=> { message.dataset.userEdited = '1'; });
}

// Lazy loader for non-critical sections
function initLazySections(){
  const lazy = [
    {id:'galeria', loader: renderGallery},
    {id:'why-digital', loader: renderWhy},
    {id:'funciones', loader: renderFunciones}
    // NOT including 'precios' here: plans are critical and rendered on load
  ];
  lazy.forEach(item=>{
    const el = document.getElementById(item.id);
    if(!el) return;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          try{ item.loader(); }catch(e){}
          obs.unobserve(entry.target);
        }
      });
    }, {rootMargin:'120px', threshold:0.1});
    obs.observe(el);
  });
}

// Modal behavior (keeps design)
function initModal(){
  const modal = document.getElementById('mockupModal');
  const trigger = document.getElementById('mockupTrigger');
  const closeBtn = modal?.querySelector('.modal-close');
  const modalImage = document.getElementById('modalImage');

  if(!modal || !trigger) return;
  trigger.addEventListener('click', ()=>{
    const src = trigger.querySelector('img')?.src;
    if(modalImage && src) modalImage.src = src;
    modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  });
  if(closeBtn) closeBtn.addEventListener('click', ()=> { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; });
  modal.addEventListener('click', (e)=> { if(e.target === modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }});
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape' && modal.classList.contains('show')) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }});
}

// WhatsApp quick open
function wireWhatsApp(){
  const btn = document.getElementById('whatsappBtn');
  if(!btn) return;
  btn.addEventListener('click', ()=> {
    const phone = btn.dataset.phone || '5215612676844';
    const text = encodeURIComponent('Hola, quiero información sobre una invitación digital.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener');
  });
}

// Contact form submit (keeps lazy Firestore init, but doesn't change UX)
function wireContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (form.name?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const phone = (form.phone?.value || '').trim();
    const plan = (form.plan?.value || '').trim();
    const message = (form.message?.value || '').trim();
    const date = (form.date?.value || '').trim();

    // simple validation
    if(!name || !email || !phone || !plan || !message){
      const status = document.getElementById('formStatus');
      if(status) status.textContent = 'Verifica los campos requeridos.';
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }

    const payload = { name, email, phone, plan, message, date, ts: new Date().toISOString() };

    // Lazy send to Firestore (best-effort). If fails, just restore UI and show message.
    let sent = false;
    try {
      const firebaseApp = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js');
      const firestore = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js');
      const config = {
        apiKey: "AIzaSyCTh8kPdvu-6Z5_cckNts22VrhdUTLVspM",
        authDomain: "invitea-f7331.firebaseapp.com",
        projectId: "invitea-f7331",
      };
      const app = firebaseApp.initializeApp(config);
      const db = firestore.getFirestore(app);
      await firestore.addDoc(firestore.collection(db, 'contact_requests'), {...payload, createdAt:firestore.serverTimestamp()});
      sent = true;
    } catch(err){
      console.warn('Firestore send failed (ok fallback):', err);
    }

    const status = document.getElementById('formStatus');
    if(sent){
      if(status) status.textContent = '¡Gracias! Recibimos tu solicitud.';
      form.reset();
    } else {
      if(status) status.textContent = 'No fue posible enviar (usa WhatsApp o correo).';
    }

    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Enviar solicitud'; }
  });
}

// Init
document.addEventListener('DOMContentLoaded', ()=> {
  // Render plans immediately (fix: was only lazy before and sometimes didn't show)
  renderPlans();
  // Attach listeners and initial behaviors
  attachPlanListeners();
  watchMessageUserEdit();
  wireWhatsApp();
  initModal();
  initLazySections();   // gallery, why, funciones will load lazily
  // datepicker and phone mask can be wired here if present (kept minimal)
  animateItems('.hero .fade-up', 80, 80);
});
