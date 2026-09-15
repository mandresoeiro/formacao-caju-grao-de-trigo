(() => {
  const STORE_KEY = 'caju-student-registration-v1';
  const readRegistration = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  };
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value || '—';
  };

  const data = readRegistration();
  const name = data.name || '';
  const message = document.querySelector('[data-student-area-message]');

  if (name) {
    if (message) message.textContent = `${name}, seu cadastro foi recebido. Você pode continuar as aulas e acompanhar seu progresso neste aparelho.`;
    setText('[data-student-name]', data.name);
    setText('[data-student-contact]', data.contact);
    setText('[data-student-group]', data.group || 'Não informado');
    return;
  }

  if (message) message.textContent = 'Ainda não encontrei um cadastro salvo neste aparelho. Faça o cadastro para abrir sua área do aluno.';
  setText('[data-student-name]', 'Não cadastrado neste aparelho');
  setText('[data-student-contact]', '—');
  setText('[data-student-group]', '—');
})();
