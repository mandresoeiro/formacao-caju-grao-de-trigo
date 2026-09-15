(() => {
  const cfg = window.CAJU_CONFIG || {};
  const clean = value => String(value || '').trim();
  const configured = Boolean(clean(cfg.supabaseUrl) && clean(cfg.supabasePublishableKey));
  let client = null;
  let libraryPromise = null;

  function loadLibrary() {
    if (!configured) return Promise.resolve(null);
    if (window.supabase?.createClient) return Promise.resolve(window.supabase);
    if (libraryPromise) return libraryPromise;

    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => window.supabase?.createClient
        ? resolve(window.supabase)
        : reject(new Error('A biblioteca do Supabase foi carregada, mas não iniciou corretamente.'));
      script.onerror = () => reject(new Error('Não foi possível carregar a biblioteca do Supabase.'));
      document.head.append(script);
    });
    return libraryPromise;
  }

  async function ensureClient() {
    if (!configured) return null;
    if (client) return client;
    const lib = await loadLibrary();
    client = lib.createClient(clean(cfg.supabaseUrl), clean(cfg.supabasePublishableKey), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  function getClient() { return client; }

  async function getSession() {
    const sb = await ensureClient();
    if (!sb) return { session: null, user: null };
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return { session: data.session, user: data.session?.user || null };
  }

  async function getUser() {
    const sb = await ensureClient();
    if (!sb) return null;
    const { data, error } = await sb.auth.getUser();
    if (error) return null;
    return data.user || null;
  }

  async function signUp({ email, password, displayName }) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase ainda não foi configurado.');
    const origin = location.protocol.startsWith('http') ? location.origin + location.pathname.replace(/[^/]*$/, '') : undefined;
    const options = { data: { display_name: displayName || email.split('@')[0] } };
    if (origin) options.emailRedirectTo = origin;
    const { data, error } = await sb.auth.signUp({ email, password, options });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase ainda não foi configurado.');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const sb = await ensureClient();
    if (!sb) return;
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }

  async function ensureProfile(user, displayName = '') {
    const sb = await ensureClient();
    if (!sb || !user) return;
    const name = displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Aluno';
    const { error } = await sb.from('profiles').upsert({
      id: user.id,
      display_name: name,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) throw error;
  }

  async function updateProfileName(userId, displayName) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { error } = await sb.from('profiles').update({
      display_name: displayName,
      updated_at: new Date().toISOString()
    }).eq('id', userId);
    if (error) throw error;
  }

  async function getSnapshot() {
    const sb = await ensureClient();
    if (!sb) return { progress: [], notes: [], suggestions: [], profile: null };
    const [{ data: progress, error: pError }, { data: notes, error: nError }, { data: suggestions, error: sError }, { data: profile, error: prError }] = await Promise.all([
      sb.from('lesson_progress').select('*').order('updated_at', { ascending: false }),
      sb.from('lesson_notes').select('*').order('updated_at', { ascending: false }),
      sb.from('lesson_suggestions').select('*').order('created_at', { ascending: false }).limit(50),
      sb.from('profiles').select('*').maybeSingle()
    ]);
    const error = pError || nError || sError || prError;
    if (error) throw error;
    return { progress: progress || [], notes: notes || [], suggestions: suggestions || [], profile: profile || null };
  }

  async function saveProgress({ lessonNumber, percent, sectionId = null, completed = false }) {
    const sb = await ensureClient();
    const user = await getUser();
    if (!sb || !user) return null;
    const payload = {
      user_id: user.id,
      lesson_number: String(lessonNumber),
      percent: Math.max(0, Math.min(100, Number(percent || 0))),
      section_id: sectionId || null,
      completed: Boolean(completed),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await sb.from('lesson_progress').upsert(payload, {
      onConflict: 'user_id,lesson_number'
    }).select().single();
    if (error) throw error;
    return data;
  }

  async function saveNote({ lessonNumber, sectionId = '', noteType, content }) {
    const sb = await ensureClient();
    const user = await getUser();
    if (!sb || !user) return null;
    const payload = {
      user_id: user.id,
      lesson_number: String(lessonNumber),
      section_id: String(sectionId || ''),
      note_type: String(noteType),
      content: String(content || ''),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await sb.from('lesson_notes').upsert(payload, {
      onConflict: 'user_id,lesson_number,note_type,section_id'
    }).select().single();
    if (error) throw error;
    return data;
  }

  async function submitSuggestion({ lessonNumber, content }) {
    const sb = await ensureClient();
    const user = await getUser();
    if (!sb || !user) throw new Error('Entre na sua conta para enviar uma sugestão.');
    const { data, error } = await sb.from('lesson_suggestions').insert({
      user_id: user.id,
      lesson_number: String(lessonNumber),
      content: String(content || '').trim()
    }).select().single();
    if (error) throw error;
    return data;
  }

  async function onAuthStateChange(callback) {
    const sb = await ensureClient();
    if (!sb) return null;
    return sb.auth.onAuthStateChange((event, session) => callback(event, session));
  }

  window.CAJU_CLOUD = {
    configured,
    getClient,
    getSession,
    getUser,
    signUp,
    signIn,
    signOut,
    ensureProfile,
    updateProfileName,
    getSnapshot,
    saveProgress,
    saveNote,
    submitSuggestion,
    onAuthStateChange
  };
})();
