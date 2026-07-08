// ============================================================
// Diego Nessler — Portfólio
// Interações: efeito de digitação no hero, menu mobile,
// aba ativa conforme o scroll, ano dinâmico e envio de formulário.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initMobileNav();
  initActiveTab();
  initFooterYear();
  initContactForm();
});
// Efeito de "digitação" no nome, dentro do hero (apenas se existir)
function initTypingEffect() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;
  const text = el.getAttribute('data-typing');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = text;
    return;
  }
  el.textContent = '';
  let i = 0;
  const speed = 55;
  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}
// Menu mobile (abre/fecha a lista de abas)
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const tabbar = document.querySelector('.tabbar');
  if (!toggle || !tabbar) return;
  toggle.addEventListener('click', () => {
    const isOpen = tabbar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  tabbar.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => tabbar.classList.remove('open'));
  });
}
// Marca a aba ativa de acordo com a seção visível
function initActiveTab() {
  const tabs = document.querySelectorAll('.tab[href^="#"]');
  const sections = Array.from(tabs)
    .map((tab) => document.querySelector(tab.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          tabs.forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('href') === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}
// Atualiza o ano do rodapé automaticamente
function initFooterYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}
// Envia o formulário de contato via fetch (sem sair da página)
function initContactForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  if (!form || !status) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'enviando...';
    status.textContent = '';
    status.className = 'form-status';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        status.textContent = '✓ Mensagem enviada. Obrigado pelo contato!';
        status.classList.add('ok');
        form.reset();
      } else {
        throw new Error('request_failed');
      }
    } catch (err) {
      status.textContent = '✗ Não foi possível enviar agora. Tente novamente ou me chame no LinkedIn.';
      status.classList.add('err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}