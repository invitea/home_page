// app.js - Funcionalidad de Firebase y lógica principal

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTh8kPdvu-6Z5_cckNts22VrhdUTLVspM",
  authDomain: "invitea-f7331.firebaseapp.com",
  projectId: "invitea-f7331",
  storageBucket: "invitea-f7331.firebasestorage.app",
  messagingSenderId: "145115727672",
  appId: "1:145115727672:web:d1d89c20bf946b9e2663cd",
  measurementId: "G-8JS1MDZVGQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
let db;

// Intentar inicializar Firestore
try {
  db = getFirestore(app);
  // Habilitar persistencia offline (opcional)
  try { 
    enableIndexedDbPersistence(db).catch(e => console.warn('Persistence error:', e?.code || e)); 
  } catch(e){ 
    console.warn('Persistence init error:', e); 
  }
} catch (e) {
  console.warn('Firestore no disponible:', e);
  db = null;
}

// Cache System
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

// Datos optimizados
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

// Funciones de utilidad globales
window.inviteaApp = {
  db,
  DATA,
  saveToCache,
  getFromCache,
  CACHE_KEYS
};
