(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const lessons = window.CAJU_AULAS || [];
  const AXIS_ORDER = ['CRER', 'CELEBRAR', 'VIVER', 'REZAR', 'SANTIDADE'];

  const settings = {
    theme: localStorage.getItem('caju-theme') || 'dark',
    font: Number(localStorage.getItem('caju-font') || '1')
  };

  const PROFILE_STORE = 'caju-profiles-v1';
  const ACTIVE_PROFILE = 'caju-active-profile-v1';

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[ch]));
  }

  function slugify(value = '') {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'aluno';
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }

  function getProfiles() {
    let profiles = readJSON(PROFILE_STORE, []);
    if (!Array.isArray(profiles) || !profiles.length) {
      profiles = [{ id: 'meu-perfil', nome: 'Meu perfil' }];
      localStorage.setItem(PROFILE_STORE, JSON.stringify(profiles));
    }
    return profiles;
  }

  function getActiveProfileId() {
    const profiles = getProfiles();
    const stored = localStorage.getItem(ACTIVE_PROFILE);
    if (stored && profiles.some(p => p.id === stored)) return stored;
    localStorage.setItem(ACTIVE_PROFILE, profiles[0].id);
    return profiles[0].id;
  }

  function getActiveProfile() {
    const id = getActiveProfileId();
    return getProfiles().find(p => p.id === id) || getProfiles()[0];
  }

  function profileKey(kind, lessonNumber = '', suffix = '') {
    return `caju:${getActiveProfileId()}:${kind}:${lessonNumber}${suffix ? `:${suffix}` : ''}`;
  }

  function getCompleted(lesson) {
    const current = localStorage.getItem(profileKey('complete', lesson.numero));
    if (current !== null) return current === '1';
    // Migração suave da versão anterior para o perfil padrão.
    if (getActiveProfileId() === 'meu-perfil') {
      const legacy = localStorage.getItem(`caju-complete-${lesson.numero}`);
      if (legacy !== null) {
        localStorage.setItem(profileKey('complete', lesson.numero), legacy);
        return legacy === '1';
      }
    }
    return false;
  }

  function getProgress(lesson) {
    return readJSON(profileKey('progress', lesson.numero), null);
  }

  function applySettings() {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.style.setProperty('--font-scale', String(settings.font));
    const themeButton = $('[data-action="theme"]');
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', settings.theme === 'light' ? 'true' : 'false');
      themeButton.title = settings.theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';
    }
  }

  function bindGlobalControls() {
    $('[data-action="theme"]')?.addEventListener('click', () => {
      settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('caju-theme', settings.theme);
      applySettings();
    });

    $('[data-action="font-plus"]')?.addEventListener('click', () => {
      settings.font = Math.min(1.3, +(settings.font + .05).toFixed(2));
      localStorage.setItem('caju-font', String(settings.font));
      applySettings();
    });

    $('[data-action="font-minus"]')?.addEventListener('click', () => {
      settings.font = Math.max(.9, +(settings.font - .05).toFixed(2));
      localStorage.setItem('caju-font', String(settings.font));
      applySettings();
    });
  }

  function pictureHTML(media, eager = false) {
    const loading = eager ? 'eager' : 'lazy';
    const fetch = eager ? ' fetchpriority="high"' : '';
    const alt = escapeHTML(media.alt || media.titulo || '');
    return `<picture>
      <source media="(max-width: 700px)" srcset="${escapeHTML(media.src640)}">
      <img src="${escapeHTML(media.src1280)}" alt="${alt}" loading="${loading}" decoding="async"${fetch} width="1280" height="720">
    </picture>`;
  }

  function axisGlyph(lesson) {
    const map = { CRER: '✦', CELEBRAR: '✝', VIVER: '◇', REZAR: '◌', SANTIDADE: '↑' };
    return map[lesson.eixo] || '✦';
  }

  function blockText(block) {
    if (!block) return '';
    if (block.texto) return block.texto;
    if (block.itens) return block.itens.join(' ');
    return '';
  }

  function lessonSearchText(lesson) {
    const sectionText = (lesson.secoes || []).map(s => [
      s.titulo,
      ...(s.blocos || []).map(blockText)
    ].join(' ')).join(' ');
    const mediaText = (lesson.imagens || []).map(m => `${m.titulo || ''} ${m.descricao || ''}`).join(' ');
    return [lesson.numero, lesson.titulo, lesson.subtitulo, lesson.resumo, lesson.eixo, sectionText, mediaText]
      .join(' ').toLocaleLowerCase('pt-BR');
  }

  function lessonWordCount(lesson) {
    const text = lessonSearchText(lesson).replace(/[^\p{L}\p{N}\s-]/gu, ' ');
    return text.split(/\s+/).filter(Boolean).length;
  }

  function readingMinutes(lesson) {
    return Math.max(1, Math.round(lessonWordCount(lesson) / 205));
  }

  function renderProfilePanel() {
    const profiles = getProfiles();
    const active = getActiveProfileId();
    return `<section class="student-panel" aria-label="Cadastro e progresso do aluno">
      <div class="student-panel-title-row">
        <h2 class="sidebar-heading">Aluno</h2>
        <span class="local-badge">cadastro + progresso</span>
      </div>
      <p class="student-help student-help-strong">Se ainda não fez, preencha o cadastro rápido. O envio aparece no Firebase para a coordenação.</p>
      <form class="sidebar-signup" data-student-form data-compact-student-form>
        <label>Nome completo
          <input name="name" type="text" maxlength="90" required autocomplete="name" placeholder="Seu nome">
        </label>
        <label>WhatsApp ou e-mail
          <input name="contact" type="text" maxlength="120" required autocomplete="email" placeholder="Seu contato">
        </label>
        <label>Grupo ou comunidade
          <input name="group" type="text" maxlength="100" placeholder="Opcional">
        </label>
        <input type="hidden" name="interest" value="Participar da formação">
        <input type="hidden" name="note" value="Cadastro rápido pelo painel do aluno">
        <button class="btn compact" type="submit">Fazer cadastro</button>
        <p class="sidebar-signup-status" data-student-status aria-live="polite">Cadastro rápido para novos alunos.</p>
      </form>
      <div class="student-local-box">
        <label class="student-label">Progresso neste aparelho
        <select class="student-select" data-profile-select>
          ${profiles.map(p => `<option value="${escapeHTML(p.id)}"${p.id === active ? ' selected' : ''}>${escapeHTML(p.nome)}</option>`).join('')}
        </select>
        </label>
        <details class="profile-create">
        <summary>Adicionar outro perfil local</summary>
        <form data-profile-form>
          <label>Nome ou apelido
            <input name="name" type="text" maxlength="40" required autocomplete="off" placeholder="Ex.: Ana, João, Grupo A">
          </label>
          <button class="btn compact" type="submit">Criar perfil</button>
        </form>
        </details>
        <p class="student-help">Este perfil guarda progresso e anotações somente neste navegador.</p>
      </div>
      <a class="sidebar-full-signup" href="#cadastro">Ver cadastro completo</a>
    </section>`;
  }

  function bindProfiles() {
    $$('[data-profile-select]').forEach(select => {
      select.addEventListener('change', () => {
        localStorage.setItem(ACTIVE_PROFILE, select.value);
        location.reload();
      });
    });

    $$('[data-profile-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        const fd = new FormData(form);
        const nome = String(fd.get('name') || '').trim();
        if (!nome) return;
        const profiles = getProfiles();
        let base = slugify(nome);
        let id = base;
        let n = 2;
        while (profiles.some(p => p.id === id)) id = `${base}-${n++}`;
        profiles.push({ id, nome });
        localStorage.setItem(PROFILE_STORE, JSON.stringify(profiles));
        localStorage.setItem(ACTIVE_PROFILE, id);
        location.reload();
      });
    });
  }

  function renderGroupedLessons(current = null, options = {}) {
    const groups = AXIS_ORDER.map(axis => [axis, lessons.filter(l => l.eixo === axis)]).filter(([, list]) => list.length);
    const openFirst = options.openFirst !== false;
    return groups.map(([axis, list]) => {
      const hasCurrent = current && list.some(l => l.numero === current.numero);
      const items = list.map(lesson => {
        const completed = getCompleted(lesson);
        if (lesson.status !== 'publicada') {
          return `<li class="sidebar-lesson is-pending">
            <span class="lesson-nav-number">${escapeHTML(lesson.numero)}</span>
            <span><strong>${escapeHTML(lesson.titulo)}</strong><small>Em preparação</small></span>
          </li>`;
        }
        const currentAttr = current && lesson.numero === current.numero ? ' aria-current="page"' : '';
        return `<li class="sidebar-lesson${current && lesson.numero === current.numero ? ' is-current' : ''}">
          <a href="aula.html?id=${encodeURIComponent(lesson.numero)}"${currentAttr}>
            <span class="lesson-nav-number">${escapeHTML(lesson.numero)}</span>
            <span><strong>${escapeHTML(lesson.titulo)}</strong><small>${completed ? '✓ Concluída' : escapeHTML(lesson.eixo)}</small></span>
          </a>
        </li>`;
      }).join('');
      return `<details class="sidebar-group"${hasCurrent || (openFirst && axis === 'CRER') ? ' open' : ''}>
        <summary><span>${escapeHTML(axis)}</span><small>${list.length}</small></summary>
        <ol class="sidebar-lessons">${items}</ol>
      </details>`;
    }).join('');
  }

  function renderHomeSidebar() {
    const published = lessons.filter(lesson => lesson.status === 'publicada').length;
    return `<div class="sidebar-content home-sidebar-inner">
      <div class="sidebar-library-mark" aria-hidden="true"><span class="sidebar-brand-main">CAJU</span><span class="sidebar-brand-sub">Grão de Trigo</span><i></i></div>
      ${renderProfilePanel()}
      <nav class="home-primary-nav" aria-label="Atalhos da página inicial">
        <h2 class="sidebar-heading">Menu</h2>
        <a class="home-nav-link" href="#conteudo" aria-current="page"><span aria-hidden="true">⌂</span> Início</a>
        <a class="home-nav-link" href="#comecar"><span aria-hidden="true">01</span> Começar</a>
        <a class="home-nav-link" href="#aulas"><span aria-hidden="true">▦</span> Aulas</a>
        <a class="home-nav-link" href="#buscar-title"><span aria-hidden="true">⌕</span> Buscar</a>
        <a class="home-nav-link" href="#cadastro"><span aria-hidden="true">✓</span> Cadastro</a>
        <a class="home-nav-link" href="#contato"><span aria-hidden="true">✉</span> Contato</a>
        <details class="sidebar-more">
          <summary>Mais opções</summary>
          <div class="sidebar-more-grid">
            <a class="home-nav-link" href="#musica"><span aria-hidden="true">♫</span> Playlist</a>
            <a class="home-nav-link" href="#acessibilidade"><span aria-hidden="true">A+</span> Acessibilidade</a>
            <a class="home-nav-link" href="#feedback"><span aria-hidden="true">★</span> Feedback</a>
            <a class="home-nav-link" href="#jornada"><span aria-hidden="true">◔</span> Jornada</a>
            <a class="home-nav-link" href="#proximo"><span aria-hidden="true">📅</span> Agenda</a>
            <a class="home-nav-link" href="#experiencias"><span aria-hidden="true">✦</span> Experiências</a>
            <a class="home-nav-link" href="#perguntas"><span aria-hidden="true">?</span> Perguntas</a>
          </div>
        </details>
      </nav>
      <nav class="sidebar-nav home-lessons-nav" aria-label="Aulas da formação">
        <div class="sidebar-title-row"><h2 class="sidebar-heading">Caminho de formação</h2><span class="sidebar-count" aria-label="${published} aulas disponíveis">${published}/${lessons.length}</span></div>
        ${renderGroupedLessons(null, { openFirst: false })}
      </nav>
      <div class="sidebar-growth-note"><span class="growth-dot" aria-hidden="true"></span><div><strong>Biblioteca em crescimento</strong><small>As próximas aulas entram nesta navegação.</small></div></div>
    </div>`;
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

  function bindHomeSidebar() {
    const dialog = $('#home-mobile-sidebar');
    const openButton = $('[data-home-sidebar-open]');
    const closeButton = $('[data-home-sidebar-close]');
    if (!dialog || !openButton || !closeButton) return;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.addEventListener('click', () => openDialog(dialog, openButton));
    closeButton.addEventListener('click', () => closeDialog(dialog, openButton));
    dialog.addEventListener('close', () => openButton.setAttribute('aria-expanded', 'false'));
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog, openButton); });
    $$('a', dialog).forEach(link => link.addEventListener('click', () => closeDialog(dialog, openButton)));
  }

  function latestProgress() {
    return lessons
      .filter(l => l.status === 'publicada')
      .map(l => ({ lesson: l, progress: getProgress(l) }))
      .filter(x => x.progress && Number(x.progress.percent) > 2 && Number(x.progress.percent) < 98)
      .sort((a, b) => (b.progress.updatedAt || 0) - (a.progress.updatedAt || 0))[0] || null;
  }

  function renderDeepSearch(term) {
    const slot = $('#deep-search-results');
    if (!slot) return;
    const q = term.trim().toLocaleLowerCase('pt-BR');
    if (q.length < 3) { slot.innerHTML = ''; slot.hidden = true; return; }

    const matches = [];
    lessons.filter(l => l.status === 'publicada').forEach(lesson => {
      (lesson.secoes || []).forEach(section => {
        const text = [section.titulo, ...(section.blocos || []).map(blockText)].join(' ').toLocaleLowerCase('pt-BR');
        if (text.includes(q)) matches.push({ lesson, section });
      });
    });

    slot.hidden = false;
    slot.innerHTML = matches.length
      ? `<h3>Resultados dentro das aulas</h3><ul>${matches.slice(0, 10).map(({ lesson, section }) => `<li><a href="aula.html?id=${encodeURIComponent(lesson.numero)}#${encodeURIComponent(section.id)}"><strong>Aula ${escapeHTML(lesson.numero)}</strong> · ${escapeHTML(section.titulo)}</a></li>`).join('')}</ul>${matches.length > 10 ? `<p>Mais ${matches.length - 10} resultado(s) não exibido(s).</p>` : ''}`
      : '<p>Nenhum capítulo encontrou esse termo.</p>';
  }

  function renderHome() {
    const grid = $('#lesson-grid');
    if (!grid) return;

    const sidebarHTML = renderHomeSidebar();
    if ($('#home-sidebar-content')) $('#home-sidebar-content').innerHTML = sidebarHTML;
    if ($('#home-mobile-sidebar-content')) $('#home-mobile-sidebar-content').innerHTML = sidebarHTML;
    bindProfiles();

    const featured = lessons.find(lesson => lesson.numero === '04' && lesson.capa) || lessons.find(lesson => lesson.capa);
    if ($('#home-featured-image') && featured?.capa) $('#home-featured-image').innerHTML = pictureHTML(featured.capa, true);

    if ($('#stat-lessons')) $('#stat-lessons').textContent = lessons.length;
    if ($('#stat-published')) $('#stat-published').textContent = lessons.filter(l => l.status === 'publicada').length;
    const publishedLessons = lessons.filter(l => l.status === 'publicada');
    const completedLessons = publishedLessons.filter(getCompleted);
    const journeyPercent = publishedLessons.length ? Math.round((completedLessons.length / publishedLessons.length) * 100) : 0;
    const journeyPercentEl = $('#journey-percent');
    const journeyBar = $('#journey-bar-fill');
    const journeySummary = $('#journey-summary');
    if (journeyPercentEl) journeyPercentEl.textContent = `${journeyPercent}%`;
    if (journeyBar) journeyBar.style.width = `${journeyPercent}%`;
    if (journeySummary) {
      journeySummary.textContent = completedLessons.length
        ? `${completedLessons.length} de ${publishedLessons.length} aulas disponíveis concluídas.`
        : `Você tem ${publishedLessons.length} aulas disponíveis para começar.`;
    }

    const continuation = latestProgress();
    const continueSlot = $('#continue-study-slot');
    if (continueSlot) {
      continueSlot.innerHTML = continuation
        ? `<a class="btn continue-btn" href="aula.html?id=${encodeURIComponent(continuation.lesson.numero)}${continuation.progress.sectionId ? `#${encodeURIComponent(continuation.progress.sectionId)}` : ''}">Continuar Aula ${escapeHTML(continuation.lesson.numero)} · ${Math.round(continuation.progress.percent)}%</a>`
        : '';
    }

    grid.innerHTML = lessons.map(lesson => {
      const completed = getCompleted(lesson);
      const progress = getProgress(lesson);
      const percent = Math.max(0, Math.min(100, Number(progress?.percent || (completed ? 100 : 0))));
      const cover = lesson.capa
        ? `<div class="lesson-card-cover">${pictureHTML(lesson.capa)}</div>`
        : `<div class="lesson-card-cover placeholder" aria-hidden="true"><span class="placeholder-glyph">${axisGlyph(lesson)}</span><span class="placeholder-number">${escapeHTML(lesson.numero)}</span><span class="placeholder-axis">${escapeHTML(lesson.eixo)}</span></div>`;

      const primary = lesson.status === 'publicada'
        ? `<a class="btn" href="aula.html?id=${encodeURIComponent(lesson.numero)}${progress?.sectionId ? `#${encodeURIComponent(progress.sectionId)}` : ''}">${percent > 2 && percent < 98 ? `Continuar · ${Math.round(percent)}%` : 'Ler aula'}</a>`
        : `<span class="btn" aria-disabled="true">Em preparação</span>`;
      const completion = completed ? '<span class="pill completion-pill">✓ Concluída</span>' : '';

      return `<article class="lesson-card" data-search="${escapeHTML(lessonSearchText(lesson))}">
        ${cover}
        <div class="lesson-card-body">
          <div class="lesson-meta"><span class="lesson-number-label">Aula ${escapeHTML(lesson.numero)}</span><span class="pill">${escapeHTML(lesson.eixo)}</span>${completion}</div>
          <h3>${escapeHTML(lesson.titulo)}</h3>
          <p class="lesson-card-subtitle">${escapeHTML(lesson.subtitulo || '')}</p>
          <p>${escapeHTML(lesson.resumo)}</p>
          ${lesson.status === 'publicada' ? `<div class="card-progress" aria-label="Progresso da Aula ${escapeHTML(lesson.numero)}: ${Math.round(percent)}%"><span style="width:${percent}%"></span></div>` : ''}
          <div class="card-actions">${primary}</div>
        </div>
      </article>`;
    }).join('');

    const search = $('#lesson-search');
    const note = $('#search-note');
    const updateNote = shown => { if (note) note.textContent = `${shown} aula${shown === 1 ? '' : 's'} encontrada${shown === 1 ? '' : 's'}.`; };
    updateNote(lessons.length);
    search?.addEventListener('input', () => {
      const term = search.value.trim().toLocaleLowerCase('pt-BR');
      let shown = 0;
      $$('.lesson-card', grid).forEach(card => {
        const match = !term || card.dataset.search.includes(term);
        card.hidden = !match;
        if (match) shown++;
      });
      updateNote(shown);
      renderDeepSearch(term);
    });

    bindHomeSidebar();
  }

  function currentLesson() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || '04';
    return lessons.find(l => l.numero === id || l.slug === id);
  }

  function renderAllLessonsNav(current) {
    return `<nav class="sidebar-nav" aria-label="Todas as aulas"><h2 class="sidebar-heading">Aulas</h2>${renderGroupedLessons(current)}</nav>`;
  }

  function renderTocNav(lesson) {
    const sections = lesson.secoes || [];
    const items = sections.length
      ? sections.map((section, index) => `<li><a data-toc-link href="#${escapeHTML(section.id)}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHTML(section.titulo)}</a></li>`).join('')
      : '<li><span class="toc-empty">A descrição HTML será adicionada quando o material oficial estiver disponível.</span></li>';
    return `<nav class="toc-nav" aria-label="Nesta aula"><h2 class="sidebar-heading">Nesta aula</h2><ol>${items}</ol></nav>`;
  }

  function renderSidebar(lesson) {
    return `<div class="sidebar-content">${renderProfilePanel()}${renderAllLessonsNav(lesson)}${renderTocNav(lesson)}</div>`;
  }

  function renderBlock(block) {
    if (!block) return '';
    if (block.tipo === 'p') return `<p>${escapeHTML(block.texto)}</p>`;
    if (block.tipo === 'ul' || block.tipo === 'ol') {
      const tag = block.tipo;
      const start = tag === 'ol' && block.start ? ` start="${Number(block.start)}"` : '';
      return `<${tag} class="content-list"${start}>${(block.itens || []).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</${tag}>`;
    }
    if (block.tipo === 'quote') return `<blockquote class="content-quote"><p>${escapeHTML(block.texto)}</p>${block.autor ? `<footer>— ${escapeHTML(block.autor)}</footer>` : ''}</blockquote>`;
    if (block.tipo === 'callout') return `<aside class="content-callout" aria-label="${escapeHTML(block.titulo || 'Destaque')}">${block.titulo ? `<h3>${escapeHTML(block.titulo)}</h3>` : ''}<p>${escapeHTML(block.texto)}</p></aside>`;
    return '';
  }

  function renderMediaCard(media, index) {
    return `<figure class="media-card inline-media">
      <button type="button" data-media-index="${index}" aria-label="Ampliar imagem: ${escapeHTML(media.titulo)}">${pictureHTML({ ...media, alt: media.titulo })}</button>
      <figcaption><h3>${escapeHTML(media.titulo)}</h3><p>${escapeHTML(media.descricao)}</p>
        <details class="media-description"><summary>Descrição acessível da imagem</summary><p>${escapeHTML(media.descricao)}</p></details>
      </figcaption>
    </figure>`;
  }

  function renderSectionNotebook(lesson, section) {
    const id = `note-${lesson.numero}-${section.id}`;
    return `<details class="section-notebook">
      <summary>Minha anotação desta seção</summary>
      <div class="notebook-body">
        <label for="${escapeHTML(id)}">Escreva uma ideia, dúvida, oração ou observação pessoal</label>
        <textarea id="${escapeHTML(id)}" rows="5" data-note-field data-note-kind="section" data-section-id="${escapeHTML(section.id)}" placeholder="Esta anotação é privada e fica salva no perfil local deste navegador."></textarea>
        <p class="autosave-status" data-note-status aria-live="polite">Salvo automaticamente neste aparelho.</p>
      </div>
    </details>`;
  }

  function renderLessonSections(lesson) {
    const sections = lesson.secoes || [];
    if (!sections.length) return `<section class="lesson-section" aria-labelledby="conteudo-pendente"><h2 id="conteudo-pendente">Conteúdo em preparação</h2><p>O material descritivo em HTML ainda não foi cadastrado. Quando o documento oficial estiver disponível, a aula poderá ser adicionada sem criar outra página.</p></section>`;
    return sections.map(section => {
      const blocks = section.blocos?.length ? section.blocos.map(renderBlock).join('') : section.texto ? `<p>${escapeHTML(section.texto)}</p>` : '';
      const media = (section.midia || []).map(index => lesson.imagens?.[index] ? renderMediaCard(lesson.imagens[index], index) : '').join('');
      return `<section class="lesson-section" id="${escapeHTML(section.id)}" data-observe-section><h2>${escapeHTML(section.titulo)}</h2><div class="prose">${blocks}</div>${media ? `<div class="section-media">${media}</div>` : ''}${renderSectionNotebook(lesson, section)}</section>`;
    }).join('');
  }

  function renderPdfSupplement(lesson) {
    return '';
  }

  function renderLessonNotebook(lesson) {
    const fields = [
      ['reflexao', 'Minha reflexão', 'O que ficou mais forte para mim nesta aula?'],
      ['duvidas', 'Minhas dúvidas', 'O que quero perguntar, pesquisar ou rever?'],
      ['sugestao', 'Sugestão para a formação', 'O que poderia ser explicado, corrigido ou melhorado?']
    ];
    return `<section class="lesson-notebook lesson-section" id="meu-caderno" aria-labelledby="notebook-title">
      <p class="eyebrow">Espaço pessoal</p><h2 id="notebook-title">Meu caderno da aula</h2>
      <p class="notebook-intro">Tudo aqui é separado pelo perfil <strong>${escapeHTML(getActiveProfile().nome)}</strong> e fica salvo somente neste navegador. A sugestão ainda não é enviada para a equipe automaticamente.</p>
      <div class="notebook-grid">${fields.map(([kind, label, placeholder]) => `<div class="notebook-field"><label for="note-${kind}">${label}</label><textarea id="note-${kind}" rows="6" data-note-field data-note-kind="${kind}" placeholder="${escapeHTML(placeholder)}"></textarea><p class="autosave-status" data-note-status aria-live="polite">Salvo automaticamente.</p></div>`).join('')}</div>
      <div class="notebook-actions"><button class="btn secondary" type="button" data-copy-suggestion>Copiar sugestão</button><button class="btn secondary" type="button" data-export-notes>Exportar minhas anotações (.md)</button></div>
    </section>`;
  }

  function renderLessonPager(lesson) {
    const published = lessons.filter(l => l.status === 'publicada');
    const idx = published.findIndex(l => l.numero === lesson.numero);
    const prev = idx > 0 ? published[idx - 1] : null;
    const next = idx >= 0 && idx < published.length - 1 ? published[idx + 1] : null;
    if (!prev && !next) return '';
    const link = (l, rel, arrow) => l ? `<a class="lesson-pager-link" rel="${rel}" href="aula.html?id=${encodeURIComponent(l.numero)}"><span>${arrow} Aula ${escapeHTML(l.numero)}</span><strong>${escapeHTML(l.titulo)}</strong></a>` : '<span></span>';
    return `<nav class="lesson-pager" aria-label="Aulas anterior e próxima">${link(prev, 'prev', '←')}${link(next, 'next', '→')}</nav>`;
  }

  function renderLessonMeta(lesson) {
    return `<dl class="lesson-facts" aria-label="Informações da aula"><div><dt>Leitura</dt><dd>≈ ${readingMinutes(lesson)} min</dd></div><div><dt>Capítulos</dt><dd>${(lesson.secoes || []).length}</dd></div><div><dt>Recursos visuais</dt><dd>${(lesson.imagens || []).length}</dd></div><div><dt>Formato</dt><dd>Texto HTML</dd></div></dl>`;
  }

  function renderLesson() {
    const root = $('#lesson-root');
    if (!root) return;
    const lesson = currentLesson();
    if (!lesson) {
      root.innerHTML = '<main class="container section"><div class="empty-state"><h1>Aula não encontrada</h1><p>Volte à página inicial e escolha uma formação disponível.</p><a class="btn" href="index.html">Voltar</a></div></main>';
      return;
    }

    document.title = `${lesson.numero} — ${lesson.titulo} | Formação CAJU - Grão de Trigo`;
    if (lesson.tema === 'light' && !localStorage.getItem('caju-theme')) { settings.theme = 'light'; applySettings(); }

    const proposed = lesson.proposta ? '<span class="pill">Estrutura proposta — aguardando material oficial</span>' : '';
    const cover = lesson.capa ? `<figure class="cover-figure">${pictureHTML(lesson.capa, true)}<figcaption>${escapeHTML(lesson.capa.alt)}</figcaption></figure>` : '';
    const savedProgress = getProgress(lesson);
    const continueAction = savedProgress && savedProgress.percent > 2 && savedProgress.percent < 98 && savedProgress.sectionId
      ? `<a class="btn secondary" href="#${escapeHTML(savedProgress.sectionId)}">Continuar de onde parei · ${Math.round(savedProgress.percent)}%</a>` : '';

    const mobileSidebar = `<dialog class="mobile-sidebar-dialog" id="mobile-sidebar" aria-labelledby="mobile-sidebar-title"><div class="mobile-sidebar-toolbar"><h2 id="mobile-sidebar-title">Navegação da formação</h2><button class="icon-btn" type="button" data-sidebar-close aria-label="Fechar navegação">Fechar</button></div><div class="mobile-sidebar-scroll">${renderSidebar(lesson)}</div></dialog>`;

    root.innerHTML = `
      <div class="progress-track" aria-hidden="true"><div class="progress-bar" id="reading-progress"></div></div>
      <header class="lesson-hero"><div class="container"><nav class="breadcrumbs" aria-label="Navegação estrutural"><a href="index.html">Formações</a><span aria-hidden="true">/</span><span>Aula ${escapeHTML(lesson.numero)}</span></nav><p class="eyebrow">Aula ${escapeHTML(lesson.numero)} · ${escapeHTML(lesson.eixo)}</p><h1>${escapeHTML(lesson.titulo)}</h1><p class="lesson-subtitle">${escapeHTML(lesson.subtitulo)}</p><div class="lesson-badges"><span class="pill">${escapeHTML(lesson.statusLabel)}</span>${proposed}</div>${renderLessonMeta(lesson)}<div class="lesson-hero-actions"><button class="btn secondary mobile-nav-button" type="button" data-sidebar-open aria-haspopup="dialog" aria-controls="mobile-sidebar" aria-expanded="false">Menu da aula</button><button class="btn secondary" type="button" data-reading-mode aria-pressed="false">Modo leitura</button>${continueAction}</div></div></header>
      <main class="container lesson-shell" id="conteudo-aula"><aside class="lesson-sidebar" aria-label="Navegação lateral da formação">${renderSidebar(lesson)}</aside><article class="lesson-main" aria-labelledby="lesson-reading-title"><h2 class="sr-only" id="lesson-reading-title">Conteúdo da Aula ${escapeHTML(lesson.numero)}</h2><div class="lead-card"><p>${escapeHTML(lesson.resumo)}</p><p class="accessibility-note"><strong>Leitura acessível:</strong> o conteúdo essencial está em texto HTML. As imagens entram apenas como apoio visual.</p></div>${cover}${renderLessonSections(lesson)}${renderLessonNotebook(lesson)}<section class="completion" id="completion-box" aria-labelledby="progress-title"><h2 id="progress-title">Meu progresso</h2><p>Conclusão, progresso e anotações ficam vinculados ao perfil local <strong>${escapeHTML(getActiveProfile().nome)}</strong>.</p><button class="btn" id="complete-button" type="button">Marcar aula como concluída</button></section>${renderLessonPager(lesson)}</article></main>${mobileSidebar}`;

    bindProfiles();
    bindProgress(lesson);
    bindGallery(lesson);
    bindCompletion(lesson);
    bindMobileSidebar();
    bindActiveSection(lesson);
    bindNotes(lesson);
    bindReadingMode();
    restoreHashTarget();
  }

  function restoreHashTarget() {
    if (!location.hash) return;
    setTimeout(() => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start' });
    }, 60);
  }

  function bindProgress(lesson) {
    const bar = $('#reading-progress');
    if (!bar) return;
    let timer;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const percent = max > 0 ? Math.min(100, (scrollY / max) * 100) : 0;
      bar.style.width = `${percent}%`;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const previous = getProgress(lesson) || {};
        localStorage.setItem(profileKey('progress', lesson.numero), JSON.stringify({ ...previous, percent, updatedAt: Date.now() }));
      }, 180);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
  }

  function bindCompletion(lesson) {
    const button = $('#complete-button');
    const box = $('#completion-box');
    if (!button || !box) return;
    const key = profileKey('complete', lesson.numero);
    const update = () => {
      const complete = localStorage.getItem(key) === '1';
      box.dataset.complete = String(complete);
      button.textContent = complete ? 'Desmarcar conclusão' : 'Marcar aula como concluída';
      button.setAttribute('aria-pressed', complete ? 'true' : 'false');
      if (complete) {
        const previous = getProgress(lesson) || {};
        localStorage.setItem(profileKey('progress', lesson.numero), JSON.stringify({ ...previous, percent: 100, updatedAt: Date.now() }));
      }
    };
    button.addEventListener('click', () => { localStorage.setItem(key, localStorage.getItem(key) === '1' ? '0' : '1'); update(); });
    update();
  }

  function bindGallery(lesson) {
    if (!lesson.imagens?.length) return;
    let dialog = $('#media-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'media-dialog';
      dialog.className = 'dialog-media';
      dialog.setAttribute('aria-labelledby', 'dialog-title');
      dialog.innerHTML = '<div class="dialog-toolbar"><h2 id="dialog-title">Imagem</h2><button class="icon-btn" type="button" data-dialog-close aria-label="Fechar imagem ampliada">Fechar</button></div><div class="dialog-body" id="dialog-body"></div>';
      document.body.append(dialog);
      $('[data-dialog-close]', dialog).addEventListener('click', () => closeDialog(dialog));
      dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
    }
    $$('[data-media-index]').forEach(button => button.addEventListener('click', () => {
      const media = lesson.imagens[Number(button.dataset.mediaIndex)];
      if (!media) return;
      $('#dialog-title').textContent = media.titulo;
      $('#dialog-body').innerHTML = `${pictureHTML({ ...media, alt: media.titulo }, true)}<div class="dialog-description"><h3>Descrição da imagem</h3><p>${escapeHTML(media.descricao)}</p></div>`;
      openDialog(dialog);
    }));
  }

  function bindMobileSidebar() {
    const dialog = $('#mobile-sidebar');
    const openButton = $('[data-sidebar-open]');
    const closeButton = $('[data-sidebar-close]');
    if (!dialog || !openButton || !closeButton) return;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.addEventListener('click', () => openDialog(dialog, openButton));
    closeButton.addEventListener('click', () => closeDialog(dialog, openButton));
    dialog.addEventListener('close', () => openButton.setAttribute('aria-expanded', 'false'));
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog, openButton); });
    $$('a[href^="#"]', dialog).forEach(link => link.addEventListener('click', () => closeDialog(dialog, openButton)));
  }

  function bindActiveSection(lesson) {
    const sections = $$('[data-observe-section]');
    const tocLinks = $$('[data-toc-link]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const setActive = id => {
      tocLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
      const previous = getProgress(lesson) || {};
      localStorage.setItem(profileKey('progress', lesson.numero), JSON.stringify({ ...previous, sectionId: id, updatedAt: Date.now() }));
    };
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .1, .25, .5] });
    sections.forEach(section => observer.observe(section));
  }

  function bindNotes(lesson) {
    $$('[data-note-field]').forEach(field => {
      const kind = field.dataset.noteKind;
      const suffix = field.dataset.sectionId || '';
      const key = profileKey(`note-${kind}`, lesson.numero, suffix);
      field.value = localStorage.getItem(key) || '';
      let timer;
      field.addEventListener('input', () => {
        const status = field.parentElement?.querySelector('[data-note-status]');
        if (status) status.textContent = 'Salvando…';
        clearTimeout(timer);
        timer = setTimeout(() => {
          localStorage.setItem(key, field.value);
          if (status) status.textContent = 'Salvo automaticamente neste aparelho.';
        }, 350);
      });
    });

    $('[data-copy-suggestion]')?.addEventListener('click', async event => {
      const field = $('[data-note-kind="sugestao"]');
      if (!field?.value.trim()) { event.currentTarget.textContent = 'Escreva uma sugestão primeiro'; return; }
      try {
        await navigator.clipboard.writeText(field.value.trim());
        event.currentTarget.textContent = 'Sugestão copiada';
      } catch (_) {
        field.select();
        document.execCommand('copy');
        event.currentTarget.textContent = 'Sugestão copiada';
      }
    });

    $('[data-export-notes]')?.addEventListener('click', () => {
      const profile = getActiveProfile();
      const lines = [`# Aula ${lesson.numero} — ${lesson.titulo}`, '', `Perfil local: ${profile.nome}`, ''];
      (lesson.secoes || []).forEach(section => {
        const value = localStorage.getItem(profileKey('note-section', lesson.numero, section.id)) || '';
        if (value.trim()) lines.push(`## ${section.titulo}`, '', value.trim(), '');
      });
      [['reflexao','Minha reflexão'],['duvidas','Minhas dúvidas'],['sugestao','Sugestão para a formação']].forEach(([kind, title]) => {
        const value = localStorage.getItem(profileKey(`note-${kind}`, lesson.numero)) || '';
        if (value.trim()) lines.push(`## ${title}`, '', value.trim(), '');
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aula-${lesson.numero}-${lesson.slug || 'anotacoes'}-${slugify(profile.nome)}.md`;
      document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });
  }

  function bindReadingMode() {
    const button = $('[data-reading-mode]');
    if (!button) return;
    button.addEventListener('click', () => {
      const active = document.body.classList.toggle('reading-mode');
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.textContent = active ? 'Sair do modo leitura' : 'Modo leitura';
    });
  }

  applySettings();
  bindGlobalControls();
  renderHome();
  renderLesson();
})();
