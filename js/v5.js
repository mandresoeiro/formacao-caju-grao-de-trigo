(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const cfg = window.CAJU_CONFIG || {};
  const cloud = window.CAJU_CLOUD || { configured: false };
  const PROFILE_STORE = 'caju-profiles-v1';
  const ACTIVE_PROFILE = 'caju-active-profile-v1';
  let cloudUser = null;
  let cloudProfileId = null;
  let cloudProgressTimer = null;

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || '') || fallback; }
    catch (_) { return fallback; }
  };

  const profileKeyFor = (profileId, kind, lessonNumber = '', suffix = '') =>
    `caju:${profileId}:${kind}:${lessonNumber}${suffix ? `:${suffix}` : ''}`;

  const currentLessonNumber = () => new URLSearchParams(location.search).get('id') || '';

  function cloudLocalProfileId(user) {
    return `cloud-${user.id}`;
  }

  function ensureLocalCloudProfile(user, displayName = '') {
    const id = cloudLocalProfileId(user);
    const name = displayName || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Aluno';
    let profiles = readJSON(PROFILE_STORE, []);
    if (!Array.isArray(profiles)) profiles = [];
    const found = profiles.find(p => p.id === id);
    let changed = false;
    if (!found) {
      profiles.push({ id, nome: name });
      changed = true;
    } else if (found.nome !== name) {
      found.nome = name;
      changed = true;
    }
    if (changed) localStorage.setItem(PROFILE_STORE, JSON.stringify(profiles));
    if (localStorage.getItem(ACTIVE_PROFILE) !== id) {
      localStorage.setItem(ACTIVE_PROFILE, id);
      changed = true;
    }
    cloudProfileId = id;
    return changed;
  }

  async function syncSnapshotToLocal(user) {
    if (!cloud.configured || !user) return false;
    let snapshot;
    try { snapshot = await cloud.getSnapshot(); }
    catch (error) {
      console.warn('Não foi possível sincronizar os dados do aluno:', error);
      return false;
    }

    const profileChanged = ensureLocalCloudProfile(user, snapshot.profile?.display_name || '');
    const pid = cloudLocalProfileId(user);
    let changed = profileChanged;

    (snapshot.progress || []).forEach(row => {
      const progressKey = profileKeyFor(pid, 'progress', row.lesson_number);
      const completeKey = profileKeyFor(pid, 'complete', row.lesson_number);
      const localProgress = readJSON(progressKey, null);
      const remoteTs = Date.parse(row.updated_at || '') || 0;
      const localTs = Number(localProgress?.updatedAt || 0);
      const remoteProgress = {
        percent: Number(row.percent || 0),
        sectionId: row.section_id || undefined,
        updatedAt: remoteTs || Date.now()
      };

      // Se o navegador tem uma alteração mais nova ainda não enviada, não a apaga.
      if (!localProgress || remoteTs >= localTs) {
        const same = localProgress &&
          Math.round(Number(localProgress.percent || 0) * 10) === Math.round(Number(remoteProgress.percent || 0) * 10) &&
          (localProgress.sectionId || '') === (remoteProgress.sectionId || '');
        if (!same) {
          localStorage.setItem(progressKey, JSON.stringify(remoteProgress));
          changed = true;
        }
      }
      const completeValue = row.completed ? '1' : '0';
      if (localStorage.getItem(completeKey) !== completeValue) {
        localStorage.setItem(completeKey, completeValue);
        changed = true;
      }
    });

    (snapshot.notes || []).forEach(row => {
      const kind = row.note_type;
      const suffix = kind === 'section' ? (row.section_id || '') : '';
      const key = profileKeyFor(pid, `note-${kind}`, row.lesson_number, suffix);
      if (localStorage.getItem(key) !== (row.content || '')) {
        localStorage.setItem(key, row.content || '');
        changed = true;
      }
    });

    return changed;
  }

  function authPanelHTML(user) {
    if (!cloud.configured) return '';
    if (!user) {
      return `<section class="cloud-account-card" aria-label="Conta do aluno">
        <div class="cloud-account-head"><span class="cloud-orb" aria-hidden="true"></span><div><strong>Conta do aluno</strong><small>Sincronize entre celular e computador</small></div></div>
        <button class="btn compact" type="button" data-auth-open aria-haspopup="dialog" aria-controls="auth-dialog" aria-expanded="false">Entrar ou criar conta</button>
        <p class="cloud-privacy">Suas anotações pessoais continuam privadas.</p>
      </section>`;
    }
    const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Aluno';
    return `<section class="cloud-account-card is-online" aria-label="Conta do aluno conectada">
      <div class="cloud-account-head"><span class="cloud-orb" aria-hidden="true"></span><div><strong>${escapeHTML(name)}</strong><small>Sincronização online ativa</small></div></div>
      <p class="cloud-email">${escapeHTML(user.email || '')}</p>
      <button class="btn compact secondary" type="button" data-auth-signout>Sair da conta</button>
    </section>`;
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[ch]));
  }

  function ensureAuthDialog() {
    let dialog = $('#auth-dialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'auth-dialog';
    dialog.className = 'auth-dialog';
    dialog.setAttribute('aria-labelledby', 'auth-dialog-title');
    dialog.innerHTML = `
      <div class="auth-dialog-shell">
        <div class="auth-dialog-head">
          <div><p class="eyebrow">CAJU - Grão de Trigo</p><h2 id="auth-dialog-title">Conta do aluno</h2></div>
          <button class="icon-btn" type="button" data-auth-close aria-label="Fechar">Fechar</button>
        </div>
        <p class="auth-intro">Entre para levar seu progresso e suas anotações privadas para outros aparelhos.</p>
        <form class="auth-form" data-auth-form>
          <label>Nome <span>(necessário apenas ao criar a conta)</span>
            <input type="text" name="displayName" maxlength="60" autocomplete="name" placeholder="Seu nome ou apelido">
          </label>
          <label>E-mail
            <input type="email" name="email" required autocomplete="email" placeholder="voce@exemplo.com">
          </label>
          <label>Senha
            <input type="password" name="password" required minlength="6" autocomplete="current-password" placeholder="Mínimo de 6 caracteres">
          </label>
          <div class="auth-actions">
            <button class="btn" type="button" data-auth-signin>Entrar</button>
            ${cfg.allowSignUp === false ? '' : '<button class="btn secondary" type="button" data-auth-signup>Criar conta</button>'}
          </div>
          <p class="auth-status" data-auth-status aria-live="polite"></p>
        </form>
        <div class="auth-privacy"><strong>Privacidade:</strong> notas e reflexões são privadas. Uma sugestão só é compartilhada quando você toca em <em>Enviar sugestão</em>.</div>
      </div>`;
    document.body.append(dialog);
    $('[data-auth-close]', dialog)?.addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });

    const form = $('[data-auth-form]', dialog);
    const status = $('[data-auth-status]', dialog);
    const values = () => {
      const fd = new FormData(form);
      return {
        displayName: String(fd.get('displayName') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        password: String(fd.get('password') || '')
      };
    };

    $('[data-auth-signin]', dialog)?.addEventListener('click', async () => {
      const input = values();
      if (!input.email || !input.password) { status.textContent = 'Preencha e-mail e senha.'; return; }
      status.textContent = 'Entrando…';
      try {
        const data = await cloud.signIn(input);
        cloudUser = data.user;
        await cloud.ensureProfile(cloudUser);
        ensureLocalCloudProfile(cloudUser);
        await syncSnapshotToLocal(cloudUser);
        status.textContent = 'Conta conectada. Abrindo seu espaço…';
        location.reload();
      } catch (error) {
        status.textContent = `Não foi possível entrar: ${humanAuthError(error)}`;
      }
    });

    $('[data-auth-signup]', dialog)?.addEventListener('click', async () => {
      const input = values();
      if (!input.displayName || !input.email || !input.password) { status.textContent = 'Para criar a conta, preencha nome, e-mail e senha.'; return; }
      status.textContent = 'Criando sua conta…';
      try {
        const data = await cloud.signUp(input);
        if (data.session && data.user) {
          cloudUser = data.user;
          await cloud.ensureProfile(cloudUser, input.displayName);
          ensureLocalCloudProfile(cloudUser, input.displayName);
          status.textContent = 'Conta criada. Abrindo seu espaço…';
          location.reload();
        } else {
          status.textContent = 'Conta criada. Confira seu e-mail e confirme o cadastro; depois volte aqui para entrar.';
        }
      } catch (error) {
        status.textContent = `Não foi possível criar a conta: ${humanAuthError(error)}`;
      }
    });
    return dialog;
  }

  function humanAuthError(error) {
    const msg = String(error?.message || error || 'erro desconhecido');
    if (/invalid login credentials/i.test(msg)) return 'e-mail ou senha incorretos.';
    if (/email not confirmed/i.test(msg)) return 'confirme o e-mail enviado pelo Supabase.';
    if (/already registered|already exists/i.test(msg)) return 'este e-mail já possui uma conta.';
    return msg;
  }

  function openDialog(dialog, trigger = null) {
    if (!dialog) return;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog, trigger = null) {
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus({ preventScroll: true });
    }
  }

  function hydrateAccountUI(user) {
    $$('.sidebar-content').forEach(sidebar => {
      let slot = $('.cloud-account-slot', sidebar);
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'cloud-account-slot';
        const localPanel = $('.student-panel', sidebar);
        if (localPanel) localPanel.before(slot); else sidebar.prepend(slot);
      }
      slot.innerHTML = authPanelHTML(user);
      if (cloud.configured) {
        const localPanel = $('.student-panel', sidebar);
        if (localPanel) localPanel.hidden = true;
      }
    });

    const header = $('#header-account-slot');
    if (header && cloud.configured) {
      const name = user ? (user.user_metadata?.display_name || user.email?.split('@')[0] || 'Aluno') : '';
      header.innerHTML = user
        ? `<button class="header-account" type="button" data-auth-account-title title="${escapeHTML(user.email || '')}" aria-haspopup="dialog" aria-controls="auth-dialog" aria-expanded="false"><span aria-hidden="true">●</span>${escapeHTML(name)}</button>`
        : `<button class="header-account" type="button" data-auth-open aria-haspopup="dialog" aria-controls="auth-dialog" aria-expanded="false">Entrar</button>`;
    }

    $$('[data-auth-open], [data-auth-account-title]').forEach(button => button.addEventListener('click', () => {
      const dialog = ensureAuthDialog();
      openDialog(dialog, button);
      dialog.addEventListener('close', () => button.setAttribute('aria-expanded', 'false'), { once: true });
    }));
    $$('[data-auth-signout]').forEach(button => button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await cloud.signOut();
        localStorage.setItem(ACTIVE_PROFILE, 'meu-perfil');
        location.reload();
      } catch (error) {
        button.disabled = false;
        alert(`Não foi possível sair: ${humanAuthError(error)}`);
      }
    }));
  }

  async function initCloud() {
    if (!cloud.configured) {
      const header = $('#header-account-slot');
      if (header) header.innerHTML = '';
      return;
    }
    try {
      const { user } = await cloud.getSession();
      cloudUser = user;
      if (user) {
        const activeChanged = ensureLocalCloudProfile(user);
        await cloud.ensureProfile(user);
        const dataChanged = await syncSnapshotToLocal(user);
        if (activeChanged || dataChanged) {
          const guard = `caju-cloud-reloaded:${user.id}:${location.pathname}:${currentLessonNumber()}`;
          if (sessionStorage.getItem(guard) !== '1') {
            sessionStorage.setItem(guard, '1');
            location.reload();
            return;
          }
        }
      }
      hydrateAccountUI(user);
      bindCloudDataSync();
    } catch (error) {
      console.warn('Supabase indisponível; mantendo modo local.', error);
      hydrateAccountUI(null);
    }
  }

  function bindCloudDataSync() {
    if (!cloud.configured || !cloudUser) return;
    const lessonNumber = currentLessonNumber();
    if (!lessonNumber) return;

    $$('[data-note-field]').forEach(field => {
      const kind = field.dataset.noteKind;
      if (kind === 'sugestao') return; // rascunho privado; só envia no botão.
      const sectionId = field.dataset.sectionId || '';
      let timer;
      field.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          const status = field.parentElement?.querySelector('[data-note-status]');
          try {
            await cloud.saveNote({ lessonNumber, sectionId, noteType: kind, content: field.value });
            if (status) status.textContent = 'Salvo e sincronizado com sua conta.';
          } catch (error) {
            if (status) status.textContent = 'Salvo neste aparelho; sincronização pendente.';
            console.warn(error);
          }
        }, 850);
      });
    });

    const notebookActions = $('.notebook-actions');
    if (notebookActions && !notebookActions.querySelector('[data-send-suggestion]')) {
      const send = document.createElement('button');
      send.type = 'button';
      send.className = 'btn suggestion-send';
      send.dataset.sendSuggestion = '';
      send.textContent = 'Enviar sugestão à equipe';
      notebookActions.prepend(send);
      const feedback = document.createElement('p');
      feedback.className = 'suggestion-feedback';
      feedback.dataset.suggestionFeedback = '';
      feedback.setAttribute('aria-live', 'polite');
      notebookActions.after(feedback);
      send.addEventListener('click', async () => {
        const field = $('[data-note-kind="sugestao"]');
        const text = field?.value.trim() || '';
        if (text.length < 3) { feedback.textContent = 'Escreva sua sugestão antes de enviar.'; return; }
        send.disabled = true;
        feedback.textContent = 'Enviando…';
        try {
          await cloud.submitSuggestion({ lessonNumber, content: text });
          feedback.textContent = 'Sugestão enviada. Obrigado por ajudar a melhorar a formação.';
          send.textContent = 'Sugestão enviada ✓';
        } catch (error) {
          feedback.textContent = humanAuthError(error);
          send.disabled = false;
        }
      });
    }

    const syncProgress = async () => {
      const progress = readJSON(profileKeyFor(cloudProfileId || cloudLocalProfileId(cloudUser), 'progress', lessonNumber), {});
      const completed = localStorage.getItem(profileKeyFor(cloudProfileId || cloudLocalProfileId(cloudUser), 'complete', lessonNumber)) === '1';
      try {
        await cloud.saveProgress({
          lessonNumber,
          percent: completed ? 100 : Number(progress.percent || 0),
          sectionId: progress.sectionId || null,
          completed
        });
      } catch (error) { console.warn('Progresso salvo localmente; sincronização pendente.', error); }
    };

    $('#complete-button')?.addEventListener('click', () => setTimeout(syncProgress, 80));
    addEventListener('scroll', () => {
      clearTimeout(cloudProgressTimer);
      cloudProgressTimer = setTimeout(syncProgress, 2200);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') syncProgress(); });
    addEventListener('pagehide', syncProgress);
  }

  function spotifyPlaylistId(url) {
    const value = String(url || '').trim();
    const uri = value.match(/^spotify:playlist:([A-Za-z0-9]+)$/i);
    if (uri) return uri[1];
    try {
      const parsed = new URL(value);
      const match = parsed.pathname.match(/\/playlist\/([A-Za-z0-9]+)/i);
      return match ? match[1] : '';
    } catch (_) { return ''; }
  }

  function spotifyPlaylistUrl(id) {
    return `https://open.spotify.com/playlist/${encodeURIComponent(id)}`;
  }

  function initSpotify() {
    const slot = $('#spotify-widget');
    if (!slot) return;
    const title = cfg.spotifyTitle || 'Playlist Católica';
    const subtitle = cfg.spotifySubtitle || 'Música para acompanhar a formação.';
    $('#spotify-title').textContent = title;
    $('#spotify-subtitle').textContent = subtitle;
    const id = spotifyPlaylistId(cfg.spotifyPlaylistUrl);
    if (!id) {
      slot.innerHTML = `<div class="spotify-awaiting"><span aria-hidden="true">♫</span><div><strong>Playlist pronta para conectar</strong><small>Cole o link da sua playlist em <code>js/config.js</code>.</small></div></div>`;
      return;
    }
    const openUrl = spotifyPlaylistUrl(id);
    slot.innerHTML = `<div class="spotify-actions"><button class="btn spotify-load" type="button" data-load-spotify>Carregar playlist no site</button><a class="btn secondary" href="${escapeHTML(openUrl)}" target="_blank" rel="noopener">Abrir playlist completa no Spotify</a></div><p class="spotify-hint">O player do site mostra a playlist em uma janela rolável. Para tocar músicas completas, abra no Spotify e entre na sua conta.</p>`;
    $('[data-load-spotify]', slot)?.addEventListener('click', event => {
      const iframe = document.createElement('iframe');
      iframe.className = 'spotify-frame';
      iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
      iframe.title = `${title} — Spotify`;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      event.currentTarget.replaceWith(iframe);
      $('.spotify-hint', slot)?.remove();
    });
  }

  function enhanceNotebookPrivacy() {
    $$('.section-notebook summary').forEach(summary => {
      if (!summary.querySelector('.privacy-chip')) summary.insertAdjacentHTML('beforeend', '<span class="privacy-chip">privada</span>');
    });
    $$('.notebook-field').forEach(field => {
      const textarea = $('textarea', field);
      const label = $('label', field);
      if (!textarea || !label) return;
      const kind = textarea.dataset.noteKind;
      if (label.querySelector('.privacy-chip')) return;
      if (kind === 'sugestao') label.insertAdjacentHTML('beforeend', '<span class="share-chip">compartilha só ao enviar</span>');
      else label.insertAdjacentHTML('beforeend', '<span class="privacy-chip">privada</span>');
    });
  }

  function enhanceHomeSidebarMusicLink() {
    const navs = $$('.home-primary-nav');
    navs.forEach(nav => {
      if (nav.querySelector('a[href="#musica"], a[href="#comecar"], a[href="#acessibilidade"], a[href="#contato"], a[href="#feedback"]')) return;
      const link = document.createElement('a');
      link.className = 'home-nav-link';
      link.href = '#musica';
      link.innerHTML = '<span aria-hidden="true">♫</span> Playlist Católica';
      nav.append(link);
    });
  }

  function contactDraftText() {
    const name = $('#contact-name')?.value.trim() || 'Não informado';
    const kind = $('#contact-kind')?.value || 'Contato';
    const message = $('#contact-message')?.value.trim() || 'Mensagem ainda não preenchida.';
    return [
      `Tipo: ${kind}`,
      `Nome: ${name}`,
      '',
      'Mensagem:',
      message,
      '',
      `Origem: ${cfg.siteName || 'Formação CAJU - Grão de Trigo'}`
    ].join('\n');
  }

  function updateContactMailto() {
    const mailto = $('[data-contact-mailto]');
    const emailLink = $('[data-contact-email-link]');
    if (!mailto || !emailLink) return;
    if (!cfg.contactEmail) {
      mailto.hidden = true;
      emailLink.hidden = true;
      return;
    }
    const subject = encodeURIComponent('Contato pela Formação CAJU');
    const body = encodeURIComponent(contactDraftText());
    const href = `mailto:${String(cfg.contactEmail).trim()}?subject=${subject}&body=${body}`;
    mailto.href = href;
    mailto.hidden = false;
    emailLink.href = href;
    emailLink.hidden = false;
  }

  function updateContactWhatsapp() {
    const whatsapp = $('[data-whatsapp-link]');
    if (!whatsapp || !cfg.whatsappUrl) return;
    const separator = String(cfg.whatsappUrl).includes('?') ? '&' : '?';
    whatsapp.href = `${cfg.whatsappUrl}${separator}text=${encodeURIComponent(contactDraftText())}`;
    whatsapp.hidden = false;
  }


  function initStudentSignupTools() {
    const form = $('[data-student-form]');
    if (!form) return;
    const status = $('[data-student-status]');
    const submitButton = $('[type="submit"]', form);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: String(fd.get('name') || '').trim(),
        contact: String(fd.get('contact') || '').trim(),
        group: String(fd.get('group') || '').trim(),
        interest: String(fd.get('interest') || '').trim(),
        note: String(fd.get('note') || '').trim()
      };
      if (!data.name || !data.contact) {
        if (status) status.textContent = 'Preencha pelo menos nome e WhatsApp ou e-mail.';
        return;
      }
      if (window.CAJU_FIREBASE?.whenReady) await window.CAJU_FIREBASE.whenReady;
      if (!window.CAJU_FIREBASE?.ready) {
        if (status) status.textContent = 'Cadastro ainda não pôde ser enviado. Confira se o Firestore foi criado e as regras foram publicadas.';
        return;
      }
      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = 'Enviando cadastro…';
      try {
        await window.CAJU_FIREBASE.saveStudent(data);
        if (status) status.textContent = 'Cadastro enviado com sucesso. A coordenação já pode ver no Firebase.';
        form.reset();
      } catch (error) {
        if (status) status.textContent = 'Não foi possível enviar o cadastro agora. Confira as regras do Firestore e tente novamente.';
        console.warn(error);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  function initContactTools() {
    const form = $('[data-contact-form]');
    if (!form) return;

    const status = $('[data-contact-status]');
    const copyButton = $('[data-contact-copy]');
    const fields = $$('input, select, textarea', form);
    const draftKey = 'caju-contact-draft-v1';
    const stored = readJSON(draftKey, {});

    fields.forEach(field => {
      if (stored[field.name]) field.value = stored[field.name];
      field.addEventListener('input', () => {
        const draft = Object.fromEntries(fields.map(input => [input.name, input.value]));
        localStorage.setItem(draftKey, JSON.stringify(draft));
        updateContactMailto();
        updateContactWhatsapp();
        if (status) status.textContent = 'Rascunho salvo neste aparelho.';
      });
    });

    updateContactWhatsapp();

    const calendar = $('[data-calendar-link]');
    if (calendar && cfg.calendarUrl) {
      calendar.href = cfg.calendarUrl;
      calendar.hidden = false;
    }

    const credit = $('[data-credit-link]');
    if (credit && cfg.creditUrl) {
      credit.href = cfg.creditUrl;
      credit.textContent = `Site da ${cfg.creditName || 'SoeiroTech'}`;
      credit.hidden = false;
    }

    updateContactMailto();

    copyButton?.addEventListener('click', async () => {
      const text = contactDraftText();
      try {
        await navigator.clipboard.writeText(text);
        if (status) status.textContent = 'Mensagem copiada. Agora é só colar no WhatsApp, e-mail ou conversa com a coordenação.';
      } catch (_) {
        const message = $('#contact-message');
        message?.focus();
        message?.select();
        document.execCommand('copy');
        if (status) status.textContent = 'Texto selecionado para copiar.';
      }
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: String(fd.get('name') || '').trim(),
        kind: String(fd.get('kind') || '').trim(),
        message: String(fd.get('message') || '').trim()
      };
      if (!data.message) {
        if (status) status.textContent = 'Escreva a mensagem antes de enviar.';
        return;
      }
      if (window.CAJU_FIREBASE?.whenReady) await window.CAJU_FIREBASE.whenReady;
      if (!window.CAJU_FIREBASE?.ready) {
        const reason = window.CAJU_FIREBASE?.error ? ` Detalhe: ${window.CAJU_FIREBASE.error}` : '';
        if (status) status.textContent = `A mensagem ainda não pôde ser enviada. Confira se o Firestore foi criado e publicado.${reason}`;
        return;
      }
      const submitButton = $('[type="submit"]', form);
      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = 'Enviando sua mensagem…';
      try {
        await window.CAJU_FIREBASE.saveContact(data);
        localStorage.removeItem(draftKey);
        if (status) status.textContent = 'Mensagem enviada com sucesso. Obrigado pela contribuição!';
        form.reset();
        updateContactMailto();
        updateContactWhatsapp();
      } catch (error) {
        if (status) status.textContent = 'Não foi possível enviar agora. Confira as regras do Firestore e tente novamente.';
        console.warn(error);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  function initFeedbackTools() {
    const form = $('[data-feedback-form]');
    if (!form) return;
    const status = $('[data-feedback-status]');
    const key = 'caju-feedback-v1';
    const stored = readJSON(key, null);

    if (stored) {
      $$('input[name="rating"]', form).forEach(input => { input.checked = input.value === stored.rating; });
      $$('input[name="tags"]', form).forEach(input => { input.checked = Array.isArray(stored.tags) && stored.tags.includes(input.value); });
      const note = $('#feedback-note');
      if (note) note.value = stored.note || '';
      if (status && (stored.rating || stored.note || stored.tags?.length)) status.textContent = `Feedback salvo: ${stored.rating || 'comentário registrado'}.`;
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const fd = new FormData(form);
      const rating = String(fd.get('rating') || '').trim();
      const tags = fd.getAll('tags').map(value => String(value).trim()).filter(Boolean);
      const note = String(fd.get('note') || '').trim();
      if (!rating && !tags.length && !note) {
        if (status) status.textContent = 'Escolha uma opção, marque um ponto rápido ou escreva um comentário.';
        return;
      }
      localStorage.setItem(key, JSON.stringify({ rating, tags, note, updatedAt: Date.now() }));
      const tagText = tags.length ? ` Pontos: ${tags.join(', ')}.` : '';
      if (status) status.textContent = rating ? `Feedback salvo: ${rating}.${tagText}` : `Feedback salvo.${tagText}`;
      if (window.CAJU_FIREBASE?.whenReady) await window.CAJU_FIREBASE.whenReady;
      if (!window.CAJU_FIREBASE?.ready) return;
      try {
        await window.CAJU_FIREBASE.saveFeedback({ rating, tags, note });
        if (status) status.textContent = rating ? `Feedback salvo no site: ${rating}.${tagText}` : `Feedback salvo no site.${tagText}`;
      } catch (error) {
        if (status) status.textContent += ' Ficou salvo neste aparelho; confira o Firestore para salvar online.';
        console.warn(error);
      }
    });
  }

  function initNextMeeting() {
    const section = $('#proximo');
    if (!section) return;
    const title = $('[data-next-title]', section);
    const info = $('[data-next-info]', section);
    const location = $('[data-next-location]', section);
    const calendar = $('[data-next-calendar]', section);

    if (title && cfg.nextMeetingTitle) title.textContent = cfg.nextMeetingTitle;
    if (info && cfg.nextMeetingInfo) info.textContent = cfg.nextMeetingInfo;
    if (location && cfg.nextMeetingLocation) location.textContent = cfg.nextMeetingLocation;
    if (calendar && cfg.calendarUrl) {
      calendar.href = cfg.calendarUrl;
      calendar.hidden = false;
    }
  }

  function initFirebaseStatus() {
    const status = $('[data-firebase-status]');
    if (!status) return;
    const update = () => {
      const firebase = window.CAJU_FIREBASE;
      if (!firebase?.configured) {
        status.textContent = 'Envie sua mensagem. Ela será preparada para contato.';
        status.dataset.state = 'off';
        return;
      }
      if (firebase.ready) {
        status.textContent = 'Envie sua mensagem. Ela será recebida com segurança.';
        status.dataset.state = 'ready';
        return;
      }
      if (firebase.loading) {
        status.textContent = 'Preparando envio seguro da mensagem…';
        status.dataset.state = 'loading';
        return;
      }
      status.textContent = 'Envie sua mensagem. Se o envio falhar, confira se o Firestore já foi publicado.';
      status.dataset.state = 'waiting';
    };
    update();
    document.addEventListener('caju:firebase-ready', update);
  }

  function initCredit() {
    const name = String(cfg.creditName || '').trim();
    if (!name) return;
    const url = String(cfg.creditUrl || '').trim();
    $$('.site-footer .footer-row').forEach(footer => {
      if (footer.querySelector('.site-credit')) return;
      const credit = document.createElement(url ? 'a' : 'span');
      credit.className = 'site-credit';
      credit.textContent = `Feito por ${name}`;
      if (url) {
        credit.href = url;
        credit.target = '_blank';
        credit.rel = 'noopener';
      }
      footer.append(credit);
    });
  }

  initSpotify();
  enhanceNotebookPrivacy();
  enhanceHomeSidebarMusicLink();
  initStudentSignupTools();
  initContactTools();
  initFeedbackTools();
  initNextMeeting();
  initFirebaseStatus();
  initCredit();
  initCloud();
})();
