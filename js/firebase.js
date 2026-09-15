const cfg = window.CAJU_CONFIG || {};
const firebaseConfig = cfg.firebaseConfig || {};
const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

let db = null;
let firebaseTools = null;

function cleanText(value = '', max = 1200) {
  return String(value || '').trim().slice(0, max);
}

function assertReady() {
  if (!db || !firebaseTools) throw new Error('Firebase ainda não está pronto.');
}

function basePayload(type) {
  assertReady();
  return {
    type,
    siteName: cfg.siteName || 'Formação CAJU - Grão de Trigo',
    pagePath: location.pathname,
    createdAt: firebaseTools.serverTimestamp()
  };
}


async function saveStudent(input = {}) {
  assertReady();
  return firebaseTools.addDoc(firebaseTools.collection(db, 'students'), {
    ...basePayload('student'),
    name: cleanText(input.name, 90) || 'Não informado',
    contact: cleanText(input.contact, 120),
    group: cleanText(input.group, 100),
    interest: cleanText(input.interest, 80) || 'Participar da formação',
    note: cleanText(input.note, 500)
  });
}

async function saveContact(input = {}) {
  assertReady();
  return firebaseTools.addDoc(firebaseTools.collection(db, 'contacts'), {
    ...basePayload('contact'),
    name: cleanText(input.name, 70) || 'Não informado',
    kind: cleanText(input.kind, 80) || 'Contato',
    message: cleanText(input.message, 1200)
  });
}

async function saveFeedback(input = {}) {
  assertReady();
  return firebaseTools.addDoc(firebaseTools.collection(db, 'feedback'), {
    ...basePayload('feedback'),
    rating: cleanText(input.rating, 40),
    tags: Array.isArray(input.tags) ? input.tags.map(tag => cleanText(tag, 60)).filter(Boolean).slice(0, 12) : [],
    note: cleanText(input.note, 500)
  });
}

window.CAJU_FIREBASE = {
  configured,
  ready: false,
  loading: configured,
  error: '',
  whenReady: Promise.resolve(false),
  saveStudent,
  saveContact,
  saveFeedback
};

async function loadFirebase() {
  if (!configured) return false;
  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js')
    ]);
    const app = initializeApp(firebaseConfig);
    db = firestore.getFirestore(app);
    firebaseTools = firestore;
    window.CAJU_FIREBASE.ready = true;
    window.CAJU_FIREBASE.loading = false;
    document.dispatchEvent(new CustomEvent('caju:firebase-ready', { detail: { ready: true } }));
    return true;
  } catch (error) {
    window.CAJU_FIREBASE.error = String(error?.message || error || 'Erro ao carregar Firebase.');
    window.CAJU_FIREBASE.loading = false;
    console.warn('Firebase indisponível; mantendo salvamento local.', error);
    document.dispatchEvent(new CustomEvent('caju:firebase-ready', { detail: { ready: false, error: window.CAJU_FIREBASE.error } }));
    return false;
  }
}

window.CAJU_FIREBASE.whenReady = loadFirebase();
