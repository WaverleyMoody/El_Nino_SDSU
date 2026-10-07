// Mobile nav
document.querySelector('.nav-toggle')?.addEventListener('click', e => {
  const nav = document.querySelector('.site-nav');
  const open = nav.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});

// Copy citation
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copied ✓'; }
    catch { btn.textContent = 'Select text to copy'; }
    setTimeout(() => (btn.textContent = 'Copy citation'), 2000);
  });
});

// Library filtering
const results = document.getElementById('results');
if (results) {
  const cards = [...results.querySelectorAll('.card')];
  const boxes = [...document.querySelectorAll('.filters input[type=checkbox]')];
  const search = document.getElementById('search');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty');

  // Pre-select filters from the URL, e.g. /library/?type=Animation&topic=Impacts
  const params = new URLSearchParams(location.search);
  boxes.forEach(b => { if (params.getAll(b.name).includes(b.value)) b.checked = true; });
  if (params.get('q')) search.value = params.get('q');

  function apply() {
    const sel = {};
    boxes.filter(b => b.checked).forEach(b => (sel[b.name] ??= []).push(b.value));
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(c => {
      const ok =
        (!sel.type || sel.type.includes(c.dataset.type)) &&
        (!sel.topic || sel.topic.includes(c.dataset.topic)) &&
        (!sel.audience || c.dataset.audience.split('|').some(a => sel.audience.includes(a))) &&
        (!q || c.dataset.search.includes(q));
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = `${shown} resource${shown === 1 ? '' : 's'}`;
    empty.hidden = shown > 0;
  }

  function clearAll() { boxes.forEach(b => (b.checked = false)); search.value = ''; apply(); }

  boxes.forEach(b => b.addEventListener('change', apply));
  search.addEventListener('input', apply);
  document.getElementById('clear-filters').addEventListener('click', clearAll);
  document.getElementById('clear-filters-2').addEventListener('click', clearAll);
  document.querySelector('.filters-toggle').addEventListener('click', () =>
    document.querySelector('.filters').classList.toggle('open'));
  apply();
}
