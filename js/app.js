// Лепко — прототип витрины и конструктора наклеек. Без сборки, без сервера.

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");
const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- состояние заказа ----------
const EMPTY = { cat: null, sol: null, style: "minimal", material: "standard", sheet: "A6", stickers: [] };
let order = load();
let selected = null;
let editing = true; // открыто ли окно редактирования выбранной наклейки

function load() {
  let o;
  try { o = { ...EMPTY, ...JSON.parse(localStorage.getItem("lepko-order") || "{}") }; }
  catch { o = { ...EMPTY }; }
  // старые заказы хранили каждую копию отдельно — объединяем в строки с количеством
  o.stickers = mergeDuplicates(o.stickers || []);
  return o;
}
function save() {
  try { localStorage.setItem("lepko-order", JSON.stringify(order)); } catch {}
  updateCartBadge();
}

function styled(base, styleKey, i = 0) {
  const st = STYLES[styleKey];
  const bg = st.cycle ? st.cycle[i % st.cycle.length] : st.bg;
  return { ...base, bg, fg: st.fg, font: st.font, weight: st.weight };
}
function applyStyle(styleKey) {
  order.style = styleKey;
  order.stickers = order.stickers.map((s, i) => styled(s, styleKey, i));
}
function startFromSolution(cat, sol) {
  order = {
    cat: cat.id, sol: sol.id, style: sol.style, material: sol.material, sheet: sol.sheet,
    stickers: mergeDuplicates(sol.stickers).map((s, i) => styled({ ...s, id: uid() }, sol.style, i)),
  };
  save();
}
function startCustom() {
  order = { ...EMPTY, stickers: [styled({ id: uid(), shape: "round", w: 50, h: 24, text: "Моя наклейка", sub: "", icon: "star" }, "minimal")] };
  save();
}

const findCat = (id) => CATEGORIES.find((c) => c.id === id);
const findSol = (cat, id) => cat?.solutions.find((s) => s.id === id);

// ---------- общие куски ----------
function header() {
  return `<header class="top">
    <a href="#/" class="logo" aria-label="Лепко, на главную"><span>лепко</span></a>
    <nav class="top-nav" aria-label="Основное меню">
      <a href="#/?to=catalog">Каталог</a>
      <a href="#/?to=how">Как это работает</a>
      <a href="#/custom">Своя наклейка</a>
      <a href="#/editor" class="cart-link" ${order.stickers.length ? "" : "hidden"}>Мой лист <b class="cart-count">${totalQty(order.stickers)}</b></a>
    </nav>
  </header>`;
}
function updateCartBadge() {
  const a = $(".cart-link");
  if (!a) return;
  a.hidden = !order.stickers.length;
  const b = $(".cart-count", a);
  if (b) b.textContent = totalQty(order.stickers);
}

function footer() {
  const used = new Set();
  const credits = Object.entries(CREDITS).filter(([, [n]]) => !used.has(n) && used.add(n))
    .map(([, [name, user]]) => `<a href="https://unsplash.com/@${user}?utm_source=lepko&utm_medium=referral" target="_blank" rel="noopener">${esc(name)}</a>`).join(", ");
  return `<footer class="foot">
    <div class="foot-row">
      <span class="logo logo-sm"><span>лепко</span></span>
      <p>Наклейки для порядка дома. Варна, доставка по всей Болгарии.</p>
    </div>
    <p class="foot-note">Прототип. Фото временные, с <a href="https://unsplash.com/?utm_source=lepko&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>: ${credits}.</p>
  </footer>`;
}

function photoImg(id, alt, w = 900, cls = "") {
  return `<img class="${cls}" src="${PHOTO(id, w)}" srcset="${PHOTO(id, Math.round(w / 2))} ${Math.round(w / 2)}w, ${PHOTO(id, w)} ${w}w" sizes="(max-width: 700px) 92vw, ${Math.round(w / 2)}px" alt="${esc(alt)}" loading="lazy">`;
}

function label(text, extra = "") {
  return `<span class="label ${extra}">${esc(text)}</span>`;
}

// ---------- главная ----------
function viewHome(query) {
  const demoSol = CATEGORIES[0].solutions[0];
  const demo = demoSol.stickers.map((s, i) => styled({ ...s, id: "d" + i }, "minimal", i));
  const demoSheet = pack(demo, "A6").sheets[0];

  const gallery = GALLERY.map(([id, cat, name], i) => `
    <a class="g-item ${i % 5 === 0 ? "tall" : ""}" href="#/c/${cat}">
      ${photoImg(id, name, 700)}
      ${label(name, i % 3 === 1 ? "label-tilt-r" : "label-tilt-l")}
    </a>`).join("");

  const cats = CATEGORIES.map((c) => `
    <a class="cat" href="#/c/${c.id}">
      <div class="cat-photo">${photoImg(c.photo, c.name, 600)}</div>
      <div class="cat-body">
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.lead)}</p>
        <span class="cat-count">${c.solutions.length} ${plural(c.solutions.length, "набор", "набора", "наборов")}</span>
      </div>
    </a>`).join("");

  app.innerHTML = `${header()}
  <main>
    <section class="hero">
      <div class="hero-text">
        <h1><span class="h1-sticker">Порядок начинается с&nbsp;подписи</span></h1>
        <p class="hero-sub">Наклейки для банок, тетрадей, ящиков и инструментов. Выберите готовый набор, впишите свои слова. Мы напечатаем, заламинируем и вырежем каждую наклейку по контуру.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#/?to=catalog">Выбрать наклейки</a>
          <a class="btn btn-ghost" href="#/custom">Сделать свою с нуля</a>
        </div>
        <p class="hero-min">Заказ от одного листа A6, от 3 €</p>
      </div>
      <div class="hero-visual">
        <div class="hero-photo">${photoImg("1786398018341-9987018dcdcc", "Подписанные банки в кладовой", 1000)}</div>
        <figure class="hero-sheet" aria-label="Так выглядит лист A6 с наклейками">
          ${sheetSVG(demoSheet, "A6")}
          <figcaption>Лист A6, 8 наклеек</figcaption>
        </figure>
      </div>
    </section>

    <section class="small-order">
      <div class="so-num">5</div>
      <div>
        <h2>Пять наклеек — тоже заказ</h2>
        <p>Типографии такие заказы не берут: мало и невыгодно. А нам подходит. Минимальный заказ — один лист A6 за 3 €, на него поместятся все баночки со специями.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="g-title">
      <h2 id="g-title" class="section-title">Как это выглядит дома</h2>
      <div class="gallery">${gallery}</div>
    </section>

    <section class="section" id="catalog" aria-labelledby="c-title">
      <h2 id="c-title" class="section-title">Что подписываем?</h2>
      <div class="cats">${cats}
        <a class="cat cat-custom" href="#/custom">
          <div class="cat-body">
            <h3>Своя наклейка</h3>
            <p>Форма, размер, текст и картинка — как хотите. Для тех, кто знает, что нужно.</p>
            <span class="btn btn-ghost">Открыть конструктор</span>
          </div>
        </a>
      </div>
    </section>

    <section class="section how" id="how" aria-labelledby="h-title">
      <h2 id="h-title" class="section-title">Как это работает</h2>
      <ol class="steps">
        <li><b>Выберите набор</b><span>Кухня, школа, мастерская или своя наклейка с нуля.</span></li>
        <li><b>Впишите свои слова</b><span>Названия, имена, даты. Лист меняется у вас на глазах.</span></li>
        <li><b>Получите по почте</b><span>Печатаем за 1–2 дня и отправляем Econt или Speedy. Лист плоский, приходит в конверте.</span></li>
      </ol>
    </section>

    <section class="section faq" aria-labelledby="f-title">
      <h2 id="f-title" class="section-title">Частые вопросы</h2>
      <details><summary>Сколько наклеек поместится на лист?</summary><p>Зависит от размера. Например, на A6 помещается 8 наклеек 40×22 мм или 12 круглых по 24 мм. Конструктор сразу показывает раскладку и считает листы.</p></details>
      <details><summary>Наклейки выдержат мытьё?</summary><p>Выберите вариант «Кухня и ванная»: плёнка покрыта ламинатом и не боится воды. Для морозилки и улицы есть свои материалы.</p></details>
      <details><summary>Можно заказать совсем немного?</summary><p>Да. Минимальный заказ — один лист A6. Оставшееся место можно заполнить копиями, это бесплатно.</p></details>
      <details><summary>Как оплатить и получить?</summary><p>Картой на сайте или наложенным платежом. Доставка Econt или Speedy до офиса или курьером до двери.</p></details>
    </section>
  </main>
  ${footer()}`;

  if (query.get("to")) requestAnimationFrame(() => document.getElementById(query.get("to"))?.scrollIntoView({ behavior: "smooth" }));
}

// ---------- категория ----------
function viewCategory(catId) {
  const cat = findCat(catId);
  if (!cat) return notFound();
  const cards = cat.solutions.map((s) => {
    const prev = s.stickers.slice(0, 4).map((x, i) => styled({ ...x, id: "p" + i }, s.style, i));
    return `
    <article class="sol">
      <div class="sol-photo">${photoImg(s.photo, s.name, 800)}${label(s.name, "label-tilt-l")}</div>
      <div class="sol-body">
        <p>${esc(s.text)}</p>
        <div class="sol-mini">${prev.map((x) => miniSticker(x)).join("")}</div>
        <div class="sol-foot">
          <span class="muted">${s.stickers.length} ${plural(s.stickers.length, "наклейка", "наклейки", "наклеек")} в наборе</span>
          <a class="btn btn-primary" href="#/s/${cat.id}/${s.id}/1">Выбрать</a>
        </div>
      </div>
    </article>`;
  }).join("");

  app.innerHTML = `${header()}
  <main class="page">
    <nav class="crumbs" aria-label="Путь"><a href="#/?to=catalog">Каталог</a><span>/</span><span>${esc(cat.name)}</span></nav>
    <h1 class="page-title">${esc(cat.name)}</h1>
    <p class="page-lead">${esc(cat.lead)}</p>
    <div class="sols">${cards}</div>
  </main>
  ${footer()}`;
}

function miniSticker(s) {
  const pad = 1;
  return `<svg class="mini" viewBox="${-pad} ${-pad} ${s.w + pad * 2} ${s.h + pad * 2}" style="aspect-ratio:${s.w + 2}/${s.h + 2}" aria-hidden="true">${stickerSVG(s, 0, 0)}</svg>`;
}

// ---------- шаги выбора ----------
const STEP_NAMES = ["Стиль", "Где будет наклейка", "Размер листа", "Свои слова"];

function stepper(active, base) {
  return `<ol class="stepper" aria-label="Шаги">${STEP_NAMES.map((n, i) => {
    const k = i + 1;
    const state = k < active ? "done" : k === active ? "current" : "";
    const inner = `<span class="st-n">${k}</span><span class="st-t">${n}</span>`;
    const href = k < active ? (k === 4 ? "#/editor" : `${base}/${k}`) : null;
    return `<li class="${state}" ${k === active ? 'aria-current="step"' : ""}>${href ? `<a href="${href}">${inner}</a>` : inner}</li>`;
  }).join("")}</ol>`;
}

function viewStep(catId, solId, step) {
  const cat = findCat(catId), sol = findSol(cat, solId);
  if (!sol) return notFound();
  if (order.sol !== sol.id || order.cat !== cat.id || !order.stickers.length) startFromSolution(cat, sol);
  const base = `#/s/${cat.id}/${sol.id}`;
  step = Math.min(3, Math.max(1, step | 0));

  let title = "", body = "";
  if (step === 1) {
    title = "Какой стиль вам нравится?";
    body = `<div class="choices choices-style">${Object.entries(STYLES).map(([k, st]) => {
      const sample = sol.stickers.slice(0, 2).map((x, i) => styled({ ...x, id: k + i }, k, i));
      return `<button class="choice ${order.style === k ? "is-on" : ""}" data-act="style" data-v="${k}">
        <span class="choice-art">${sample.map(miniSticker).join("")}</span>
        <span class="choice-name">${st.name}</span>
      </button>`;
    }).join("")}</div>`;
  } else if (step === 2) {
    title = "Где будут наклейки?";
    body = `<div class="choices">${Object.entries(MATERIALS).map(([k, m]) => `
      <button class="choice choice-row ${order.material === k ? "is-on" : ""}" data-act="material" data-v="${k}">
        <span class="choice-ico">${iconSVG(m.icon, 26)}</span>
        <span><span class="choice-name">${m.name}</span><span class="choice-text">${m.text}</span></span>
        <span class="choice-price">${m.extra ? "+" + Math.round(m.extra * 100) + "%" : "базовая цена"}</span>
      </button>`).join("")}</div>`;
  } else {
    title = "Какой размер листа?";
    body = `<div class="choices choices-sheet">${Object.entries(SHEETS).map(([k, sh]) => {
      const p = pack(order.stickers, k);
      const n = p.sheets.length;
      const fits = p.tooBig.length ? "наклейки крупнее листа" : n === 1 ? "весь набор на одном листе" : `набор займёт ${n} ${plural(n, "лист", "листа", "листов")}`;
      const price = priceOf({ ...order, sheet: k });
      return `<button class="choice choice-sheet ${order.sheet === k ? "is-on" : ""}" data-act="sheet" data-v="${k}">
        <span class="sheet-thumb" style="--w:${sh.w};--h:${sh.h}">${sheetSVG(p.sheets[0], k)}</span>
        <span class="choice-name">${sh.label} <small>${sh.w}×${sh.h} мм, ${sh.hint}</small></span>
        <span class="choice-text">${fits}</span>
        <span class="choice-price">${money(price.total)}</span>
      </button>`;
    }).join("")}</div>`;
  }

  app.innerHTML = `${header()}
  <main class="page wizard">
    <nav class="crumbs" aria-label="Путь"><a href="#/?to=catalog">Каталог</a><span>/</span><a href="#/c/${cat.id}">${esc(cat.name)}</a><span>/</span><span>${esc(sol.name)}</span></nav>
    ${stepper(step, base)}
    <div class="wiz-head">
      <div class="wiz-photo">${photoImg(sol.photo, sol.name, 500)}</div>
      <div>
        <h1 class="page-title">${title}</h1>
        <p class="page-lead">Набор «${esc(sol.name)}». Всё можно поменять позже в конструкторе.</p>
      </div>
    </div>
    ${body}
    <div class="wiz-nav">
      <a class="btn btn-ghost" href="${step === 1 ? `#/c/${cat.id}` : `${base}/${step - 1}`}">Назад</a>
      <a class="btn btn-primary" href="${step === 3 ? "#/editor" : `${base}/${step + 1}`}">${step === 3 ? "Перейти к своим словам" : "Дальше"}</a>
    </div>
  </main>
  ${footer()}`;

  app.onclick = (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const v = b.dataset.v;
    if (b.dataset.act === "style") applyStyle(v);
    if (b.dataset.act === "material") order.material = v;
    if (b.dataset.act === "sheet") order.sheet = v;
    save();
    location.hash = step === 3 ? "#/editor" : `${base}/${step + 1}`;
  };
}

// ---------- конструктор ----------
function viewEditor() {
  if (!order.stickers.length) startCustom();
  if (!order.stickers.find((s) => s.id === selected)) selected = order.stickers[0]?.id || null;
  const cat = findCat(order.cat), sol = findSol(cat, order.sol);
  const crumbs = sol
    ? `<a href="#/?to=catalog">Каталог</a><span>/</span><a href="#/c/${cat.id}">${esc(cat.name)}</a><span>/</span><a href="#/s/${cat.id}/${sol.id}/1">${esc(sol.name)}</a><span>/</span><span>Конструктор</span>`
    : `<a href="#/?to=catalog">Каталог</a><span>/</span><span>Своя наклейка</span>`;

  app.innerHTML = `${header()}
  <main class="page editor">
    <nav class="crumbs" aria-label="Путь">${crumbs}</nav>
    ${sol ? stepper(4, `#/s/${cat.id}/${sol.id}`) : ""}
    <div class="ed">
      <section class="ed-preview" aria-label="Превью листа">
        <div class="ed-sheet-bar">
          <div class="seg" role="group" aria-label="Размер листа">${Object.keys(SHEETS).map((k) => `<button data-sheet="${k}" class="${order.sheet === k ? "is-on" : ""}">${k}</button>`).join("")}</div>
          <label class="mat-select">Материал
            <select id="material">${Object.entries(MATERIALS).map(([k, m]) => `<option value="${k}" ${order.material === k ? "selected" : ""}>${m.name}</option>`).join("")}</select>
          </label>
        </div>
        <div id="sheets" class="sheets"></div>
        <p class="ed-hint">Нажмите на наклейку, чтобы изменить её. Пунктир — линия реза.</p>
      </section>

      <section class="ed-panel" aria-label="Настройки">
        <div class="panel-block">
          <div class="pb-head"><h2>Наклейки на листе</h2><span id="count" class="muted"></span></div>
          <ul id="list" class="s-list"></ul>
          <div class="add-row">
            <button class="btn btn-ghost btn-sm" data-act="add">Добавить наклейку</button>
            <button class="btn btn-ghost btn-sm" data-act="fill">Заполнить лист копиями</button>
          </div>
          <details class="bulk">
            <summary>Добавить списком</summary>
            <p class="muted">Одна строка — одна наклейка. Картинка подберётся сама, если узнаем слово.</p>
            <textarea id="bulk" rows="5" placeholder="Булгур&#10;Киноа&#10;Нут"></textarea>
            <button class="btn btn-primary btn-sm" data-act="bulk">Добавить</button>
          </details>
        </div>
        <div class="panel-block" id="props"></div>
      </section>
    </div>
  </main>
  <div class="paybar">
    <div id="summary"></div>
    <a class="btn btn-primary" href="#/order">Оформить заказ</a>
  </div>`;

  renderSheets(); renderList(); renderProps(); renderSummary();

  app.onclick = onEditorClick;
  app.oninput = onEditorInput;
  app.onchange = onEditorChange;
}

function renderSheets() {
  const p = pack(order.stickers, order.sheet);
  const sh = SHEETS[order.sheet];
  const warn = p.tooBig.length ? `<p class="warn">${p.tooBig.length} ${plural(p.tooBig.length, "наклейка больше", "наклейки больше", "наклеек больше")} листа ${sh.label}. Уменьшите размер или выберите лист побольше.</p>` : "";
  $("#sheets").innerHTML = warn + p.sheets.map((s, i) => `
    <figure class="sheet" style="--w:${sh.w};--h:${sh.h}">
      ${sheetSVG(s, order.sheet, { selected: editing ? selected : null })}
      <figcaption>Лист ${i + 1} из ${p.sheets.length}, ${sh.label}</figcaption>
    </figure>`).join("");
  renderFocus();
}

// Закреплённое окошко с редактируемой наклейкой: всегда видно под шапкой,
// пока прокручиваешь настройки. Отсюда же — масштаб с линейками и закрытие.
function renderFocus() {
  const box = $("#focus");
  const s = current();
  if (!box || !s) return;
  const pad = 1.2;
  const L = stickerLayout(s);
  box.innerHTML = `
    <div class="focus-art">
      <svg viewBox="${-pad} ${-pad} ${s.w + pad * 2} ${s.h + pad * 2}" style="aspect-ratio:${s.w + pad * 2}/${s.h + pad * 2}" role="img" aria-label="Наклейка «${esc(s.text)}»">${stickerSVG({ ...s, id: "focus" }, 0, 0)}</svg>
    </div>
    <div class="focus-meta">
      <span class="focus-title">${esc(s.text || "Без текста")}</span>
      <span class="muted">${s.w}×${s.h} мм, ${qtyOf(s)} шт.${L.main ? `, текст ${L.main.toFixed(1).replace(".", ",")} мм` : ""}</span>
    </div>
    <div class="focus-actions">
      <button class="vw-btn" data-act="view" title="Натуральная величина с линейками">${iconSVG("ruler", 20)}<span>Масштаб</span></button>
      <button class="vw-btn vw-close" data-act="close-edit" aria-label="Закрыть редактирование" title="Готово, закрыть">${iconSVG("close", 22)}</button>
    </div>`;
}

function setTopHeight() {
  const h = $(".top")?.offsetHeight || 0;
  document.documentElement.style.setProperty("--top-h", h + "px");
}
window.addEventListener("resize", setTopHeight);

const QTY_MAX = 999;
const svgMinus = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>`;
const svgPlus = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;

function renderCount() {
  const n = totalQty(order.stickers), kinds = order.stickers.length;
  $("#count").textContent = `${n} шт.${kinds > 1 ? `, ${kinds} ${plural(kinds, "вид", "вида", "видов")}` : ""}`;
}

function renderList() {
  renderCount();
  $("#list").innerHTML = order.stickers.map((s) => {
    const q = qtyOf(s);
    return `
    <li class="s-row ${s.id === selected ? "is-on" : ""}" data-id="${s.id}">
      <button class="s-pick" data-act="select" data-id="${s.id}" aria-label="Выбрать наклейку">${miniSticker(s)}</button>
      <input class="s-text" data-field="text" data-id="${s.id}" value="${esc(s.text)}" aria-label="Текст наклейки">
      ${qtyControl(s)}
      <button class="icon-btn" data-act="del" data-id="${s.id}" title="Удалить" aria-label="Удалить наклейку"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </li>`;
  }).join("");
}

// Обновить только счётчик в строке, не перерисовывая список (чтобы не терять фокус)
function syncQtyRow(s) {
  const q = qtyOf(s);
  app.querySelectorAll(`.qty-in[data-id="${s.id}"]`).forEach((inp) => { if (document.activeElement !== inp) inp.value = q; });
  app.querySelectorAll(`[data-act="qty-"][data-id="${s.id}"]`).forEach((b) => (b.disabled = q <= 1));
  app.querySelectorAll(`[data-act="qty+"][data-id="${s.id}"]`).forEach((b) => (b.disabled = q >= QTY_MAX));
}

function qtyControl(s, cls = "") {
  const q = qtyOf(s);
  return `<div class="qty ${cls}" role="group" aria-label="Количество">
    <button class="qty-btn" data-act="qty-" data-id="${s.id}" aria-label="Уменьшить количество" ${q <= 1 ? "disabled" : ""}>${svgMinus}</button>
    <input class="qty-in" type="number" inputmode="numeric" min="1" max="${QTY_MAX}" data-field="qty" data-id="${s.id}" value="${q}" aria-label="Количество, шт.">
    <button class="qty-btn" data-act="qty+" data-id="${s.id}" aria-label="Увеличить количество" ${q >= QTY_MAX ? "disabled" : ""}>${svgPlus}</button>
  </div>`;
}

const SHAPES = [["rect", "Прямоугольник"], ["round", "Скруглённая"], ["circle", "Круг"], ["oval", "Овал"], ["tag", "Бирка"], ["banner", "Флажок"]];
const SIZE_PRESETS = [[24, 24, "24×24"], [36, 12, "36×12"], [40, 22, "40×22"], [50, 30, "50×30"], [64, 24, "64×24"], [80, 40, "80×40"]];

function renderProps() {
  const s = order.stickers.find((x) => x.id === selected);
  const box = $("#props");
  box.classList.toggle("is-closed", !s || !editing);
  if (!s || !editing) {
    box.innerHTML = `<p class="props-empty">${iconSVG("pencil", 22)}<span>Нажмите на наклейку на листе или в списке, чтобы изменить её.</span></p>`;
    return;
  }
  const shapeBtn = ([k, n]) => {
    const demo = { ...s, shape: k, w: k === "circle" ? 18 : 26, h: 18, text: "", sub: "", icon: null, id: "sh" };
    return `<button class="shape ${s.shape === k ? "is-on" : ""}" data-act="shape" data-v="${k}" aria-label="${n}" title="${n}"><svg viewBox="-1 -1 ${demo.w + 2} 20" width="40" height="28" aria-hidden="true"><g fill="${s.bg}" stroke="#1C2340" stroke-width=".8">${shapePath(demo, 0, 0)}</g></svg></button>`;
  };
  box.innerHTML = `
    <div class="focus" id="focus"></div>
    <label class="field">Текст<input data-field="text" value="${esc(s.text)}"></label>
    <label class="field">Вторая строка <span class="muted">необязательно</span><input data-field="sub" value="${esc(s.sub)}" placeholder="Дата, имя, класс"></label>

    <div class="field qty-field">
      <span>Сколько штук</span>
      ${qtyControl(s, "qty-lg")}
      <button class="link-btn" data-act="fill">Заполнить лист до конца</button>
    </div>

    <div class="field fs-field">
      <div class="fs-head">
        <label for="fs">Размер текста</label>
        <span id="fsVal" class="fs-val"></span>
        <button class="link-btn" data-act="fs-auto" id="fsAuto">Авто</button>
      </div>
      <input type="range" id="fs" data-field="fs" step="0.1">
      <div class="fs-scale muted"><span>мельче</span><span>крупнее</span></div>
    </div>
    <fieldset class="field"><legend>Форма</legend><div class="shapes">${SHAPES.map(shapeBtn).join("")}</div></fieldset>

    <fieldset class="field"><legend>Размер, мм</legend>
      <div class="chips">${SIZE_PRESETS.map(([w, h, l]) => `<button class="chip ${s.w === w && s.h === h ? "is-on" : ""}" data-act="size" data-w="${w}" data-h="${h}">${l}</button>`).join("")}</div>
      <div class="wh">
        <label>Ширина<input type="number" min="8" max="190" data-field="w" value="${s.w}"></label>
        <label>Высота<input type="number" min="8" max="280" data-field="h" value="${s.h}" ${s.shape === "circle" ? "disabled" : ""}></label>
      </div>
    </fieldset>

    <fieldset class="field"><legend>Картинка</legend>
      <div class="icons">
        <button class="icon-pick ${!s.icon ? "is-on" : ""}" data-act="icon" data-v="" title="Без картинки" aria-label="Без картинки">нет</button>
        ${Object.keys(ICONS).map((k) => `<button class="icon-pick ${s.icon === k ? "is-on" : ""}" data-act="icon" data-v="${k}" title="${ICON_NAMES[k]}" aria-label="${ICON_NAMES[k]}">${iconSVG(k, 20)}</button>`).join("")}
      </div>
    </fieldset>

    <fieldset class="field"><legend>Фон</legend><div class="swatches">${SWATCHES.map((c) => `<button class="sw ${s.bg === c ? "is-on" : ""}" style="--c:${c}" data-act="bg" data-v="${c}" aria-label="Фон ${c}"></button>`).join("")}</div></fieldset>
    <fieldset class="field"><legend>Цвет текста</legend><div class="swatches">${["#1C2340", "#FFFFFF", "#F3F1E8", "#3B2A17", "#2F5BD3", "#C8433A"].map((c) => `<button class="sw ${s.fg === c ? "is-on" : ""}" style="--c:${c}" data-act="fg" data-v="${c}" aria-label="Текст ${c}"></button>`).join("")}</div></fieldset>

    <label class="field">Шрифт
      <select data-field="font">${FONTS.map((f) => `<option ${s.font === f ? "selected" : ""} style="font-family:'${f}'">${f}</option>`).join("")}</select>
    </label>
    <button class="btn btn-ghost btn-sm" data-act="apply-all">Применить форму, размер и цвета ко всем</button>`;
  syncFontSlider();
  renderFocus();
}

// Ползунок кегля: пределы зависят от размера наклейки и длины текста
function syncFontSlider() {
  const s = current();
  const r = $("#fs");
  if (!s || !r) return;
  const L = stickerLayout(s);
  const has = L.max > 0;
  r.disabled = !has;
  r.min = FONT_MIN;
  r.max = Math.max(FONT_MIN + 0.1, L.max).toFixed(1);
  r.value = (has ? L.main : FONT_MIN).toFixed(1);
  const pt = L.main / 0.3528;
  $("#fsVal").textContent = has ? `${L.main.toFixed(1).replace(".", ",")} мм · ${Math.round(pt)} pt` : "нет текста";
  $("#fsAuto").hidden = !s.fs;
}

function renderSummary() {
  const p = priceOf(order);
  const m = MATERIALS[order.material];
  const n = totalQty(order.stickers);
  $("#summary").innerHTML = `<b>${money(p.total)}</b><span>${p.sheets} ${plural(p.sheets, "лист", "листа", "листов")} ${order.sheet}, ${n} ${plural(n, "наклейка", "наклейки", "наклеек")}, ${m.name.toLowerCase()}</span>`;
}

function refresh({ list = false, props = false } = {}) {
  save();
  renderSheets(); renderSummary();
  if (list) renderList();
  if (props) renderProps();
  if (viewerOpen()) renderViewer();
}

// ---------- натуральная величина ----------
// Браузер не знает физический размер экрана, поэтому масштаб оценивается
// по типу устройства, а точно задаётся диагональю экрана или по банковской карте.
const CARD_W = 85.6, CARD_H = 53.98; // мм, стандарт ISO/IEC 7810 ID-1
let viewerZoom = 1;

function readPpm() {
  try { const v = +localStorage.getItem("lepko-ppm"); if (v > 1 && v < 40) return { ppm: v, calibrated: true }; } catch {}
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // CSS-пиксель: на телефонах ≈ 1/160 дюйма, на компьютерах ≈ 1/96 дюйма
  return { ppm: (coarse ? 160 : 96) / 25.4, calibrated: false };
}
function writePpm(v) { try { localStorage.setItem("lepko-ppm", String(v)); } catch {} }
function clearPpm() { try { localStorage.removeItem("lepko-ppm"); } catch {} }

function viewerOpen() { const d = $("#viewer"); return !!(d && d.open); }

function openViewer() {
  if (!current()) return;
  let d = $("#viewer");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "viewer";
    d.className = "viewer";
    d.setAttribute("aria-labelledby", "vwTitle");
    document.body.append(d);
    d.addEventListener("click", onViewerClick);
    d.addEventListener("input", onViewerInput);
    d.addEventListener("close", () => document.body.classList.remove("no-scroll"));
    window.addEventListener("resize", () => viewerOpen() && renderViewer());
  }
  d.innerHTML = `
    <div class="vw-head">
      <div>
        <h2 id="vwTitle">Натуральная величина</h2>
        <p id="vwSize" class="muted"></p>
      </div>
      <div class="vw-tools">
        <button class="vw-btn" data-vw="zoom" id="vwZoom" aria-pressed="false"></button>
        <button class="vw-btn vw-close" data-vw="close" aria-label="Закрыть">${iconSVG("close", 22)}</button>
      </div>
    </div>
    <div class="vw-scroll" id="vwScroll"><div class="vw-grid" id="vwGrid"></div></div>
    <details class="vw-cal" id="vwCal">
      <summary id="vwCalSum"></summary>
      <div class="vw-cal-body">
        <p class="muted">Сайт не знает физический размер вашего экрана. Укажите диагональ или подгоните прямоугольник под банковскую карту, и линейки станут точными.</p>
        <div class="vw-cal-row">
          <label class="field">Диагональ экрана, дюймы
            <input type="number" id="vwDiag" min="4" max="40" step="0.1" placeholder="например, 6.1">
          </label>
          <button class="btn btn-primary btn-sm" data-vw="diag">Применить</button>
        </div>
        <p class="vw-or muted">или приложите банковскую карту к экрану и подгоните рамку под её размер</p>
        <div class="vw-card-wrap"><div class="vw-card" id="vwCard"><span>85,6 × 54 мм</span></div></div>
        <div class="vw-cal-row">
          <button class="btn btn-ghost btn-sm" data-vw="card-" aria-label="Уменьшить рамку">−</button>
          <input type="range" id="vwCardRange" min="2" max="12" step="0.01" aria-label="Размер рамки">
          <button class="btn btn-ghost btn-sm" data-vw="card+" aria-label="Увеличить рамку">+</button>
        </div>
        <button class="link-btn" data-vw="reset">Сбросить настройку масштаба</button>
      </div>
    </details>`;
  document.body.classList.add("no-scroll");
  d.showModal();
  renderViewer();
}

function renderViewer() {
  const s = current();
  const d = $("#viewer");
  if (!s || !d) return;
  const { ppm, calibrated } = readPpm();
  const z = viewerZoom;
  const k = ppm * z;              // экранных px на 1 мм
  const R = 26;                   // толщина линейки, px
  const P = 5;                    // поле вокруг наклейки, мм
  const scroll = $("#vwScroll");
  const availW = Math.max(0, scroll.clientWidth - R), availH = Math.max(0, scroll.clientHeight - R);
  const lenX = Math.max(s.w + P * 2, availW / k);
  const lenY = Math.max(s.h + P * 2, availH / k);

  $("#vwSize").textContent = `${s.w} × ${s.h} мм${z === 2 ? ", увеличено в 2 раза" : ""}`;
  const zb = $("#vwZoom");
  zb.innerHTML = `${iconSVG(z === 2 ? "zoomOut" : "zoomIn", 20)}<span>${z === 2 ? "1:1" : "×2"}</span>`;
  zb.setAttribute("aria-pressed", String(z === 2));
  zb.setAttribute("aria-label", z === 2 ? "Вернуть натуральный размер" : "Увеличить в 2 раза");

  const grid = $("#vwGrid");
  grid.style.setProperty("--r", R + "px");
  grid.style.setProperty("--mm", k + "px");
  grid.style.setProperty("--off", (P * k) + "px");
  grid.innerHTML = `
    <div class="vw-corner">мм</div>
    <div class="vw-ruler vw-ruler-x">${rulerSVG(lenX, k, R, P, "x")}</div>
    <div class="vw-ruler vw-ruler-y">${rulerSVG(lenY, k, R, P, "y")}</div>
    <div class="vw-stage" style="width:${lenX * k}px;height:${lenY * k}px">
      <svg class="vw-sticker" style="left:${P * k}px;top:${P * k}px;width:${s.w * k}px;height:${s.h * k}px" viewBox="-0.5 -0.5 ${s.w + 1} ${s.h + 1}" aria-label="Наклейка ${esc(s.text)}">
        ${stickerSVG({ ...s, id: "vw" }, 0, 0)}
      </svg>
    </div>`;

  $("#vwCalSum").innerHTML = calibrated
    ? `${iconSVG("ruler", 18)} Масштаб настроен под ваш экран`
    : `${iconSVG("ruler", 18)} Масштаб примерный. Настроить точно`;
  const card = $("#vwCard");
  // на узком экране карта не влезает горизонтально — показываем её вертикально
  const portrait = CARD_W * ppm > $("#vwCal").clientWidth - 40;
  card.style.width = (portrait ? CARD_H : CARD_W) * ppm + "px";
  card.style.height = (portrait ? CARD_W : CARD_H) * ppm + "px";
  card.querySelector("span").textContent = portrait ? "54 × 85,6 мм" : "85,6 × 54 мм";
  card.style.borderRadius = 3.18 * ppm + "px";
  $("#vwCardRange").value = ppm.toFixed(2);
}

// Линейка: деления каждый мм, средние каждые 5 мм, длинные с подписью каждые 10 мм.
// Ноль совпадает с краем наклейки.
function rulerSVG(lenMm, k, R, P, axis) {
  const total = lenMm * k;
  let ticks = "", labels = "";
  const step = k < 2.5 ? 2 : 1; // на очень мелком масштабе — через 2 мм
  for (let mm = -P; mm <= lenMm - P + 0.001; mm += step) {
    const pos = (mm + P) * k;
    const r = Math.round(mm);
    const long = r % 10 === 0, mid = r % 5 === 0;
    const t = long ? R * 0.62 : mid ? R * 0.42 : R * 0.24;
    if (axis === "x") {
      ticks += `M${pos} ${R}V${R - t}`;
      if (long && r >= 0) labels += `<text x="${pos + 2}" y="${R * 0.42}">${r}</text>`;
    } else {
      ticks += `M${R} ${pos}H${R - t}`;
      if (long && r >= 0) labels += `<text x="${R * 0.4}" y="${pos + 2}" transform="rotate(-90 ${R * 0.4} ${pos + 2})" text-anchor="end">${r}</text>`;
    }
  }
  const w = axis === "x" ? total : R, h = axis === "x" ? R : total;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <path d="${ticks}" stroke="currentColor" stroke-width="1" shape-rendering="crispEdges"/>
    <g class="vw-num">${labels}</g>
  </svg>`;
}

function onViewerClick(e) {
  const d = $("#viewer");
  if (e.target === d) { d.close(); return; } // клик по затемнению
  const b = e.target.closest("[data-vw]");
  if (!b) return;
  const { ppm } = readPpm();
  switch (b.dataset.vw) {
    case "close": d.close(); break;
    case "zoom": viewerZoom = viewerZoom === 1 ? 2 : 1; renderViewer(); break;
    case "diag": {
      const inch = parseFloat(String($("#vwDiag").value).replace(",", "."));
      if (!(inch >= 4 && inch <= 40)) { toast("Введите диагональ от 4 до 40 дюймов"); break; }
      const diagPx = Math.hypot(screen.width, screen.height); // в CSS-пикселях
      writePpm(diagPx / (inch * 25.4));
      toast("Масштаб настроен"); renderViewer(); break;
    }
    case "card-": writePpm(ppm * 0.99); renderViewer(); break;
    case "card+": writePpm(ppm * 1.01); renderViewer(); break;
    case "reset": clearPpm(); toast("Масштаб снова примерный"); renderViewer(); break;
  }
}

function onViewerInput(e) {
  if (e.target.id === "vwCardRange") { writePpm(+e.target.value); renderViewer(); }
}

function current() { return order.stickers.find((x) => x.id === selected); }

function onEditorClick(e) {
  const stk = e.target.closest(".sheets .stk");
  if (stk) { startEditing(stk.dataset.id); return; }

  const sb = e.target.closest("[data-sheet]");
  if (sb) { order.sheet = sb.dataset.sheet; app.querySelectorAll("[data-sheet]").forEach((b) => b.classList.toggle("is-on", b === sb)); refresh(); return; }

  const b = e.target.closest("[data-act]");
  if (!b) return;
  const s = current();
  const id = b.dataset.id;
  switch (b.dataset.act) {
    case "select": startEditing(id); break;
    case "view": openViewer(); break;
    case "close-edit": {
      editing = false;
      refresh({ list: true, props: true });
      // вернуть взгляд к листу, чтобы увидеть результат
      const top = $("#sheets").getBoundingClientRect().top + window.scrollY - (($(".top")?.offsetHeight) || 0) - 60;
      if ($("#sheets").getBoundingClientRect().top < 0) window.scrollTo({ top, behavior: "smooth" });
      break;
    }
    case "fs-auto": delete s.fs; refresh({ props: true }); break;
    case "qty+":
    case "qty-": {
      const t = order.stickers.find((x) => x.id === id);
      if (!t) break;
      t.qty = Math.min(QTY_MAX, Math.max(1, qtyOf(t) + (b.dataset.act === "qty+" ? 1 : -1)));
      save(); renderSheets(); renderSummary(); renderCount(); syncQtyRow(t);
      break;
    }
    case "del": {
      order.stickers = order.stickers.filter((x) => x.id !== id);
      if (!order.stickers.length) { startCustom(); }
      if (selected === id) selected = order.stickers[0].id;
      refresh({ list: true, props: true }); break;
    }
    case "add": {
      const base = s || order.stickers[order.stickers.length - 1];
      const n = { ...base, id: uid(), text: "Новая", sub: "", qty: 1 };
      order.stickers.push(n); selected = n.id; editing = true;
      refresh({ list: true, props: true });
      requestAnimationFrame(() => $(`#list [data-id="${n.id}"].s-text`)?.select());
      break;
    }
    case "fill": {
      const base = s || order.stickers[0];
      const k = spaceLeftFor(base, order.stickers, order.sheet);
      base.qty = qtyOf(base) + k;
      toast(k ? `«${base.text}»: +${k} шт., теперь ${base.qty}` : "На последнем листе нет места для этой наклейки");
      refresh({ list: true, props: true }); break;
    }
    case "bulk": {
      const lines = $("#bulk").value.split("\n").map((x) => x.trim()).filter(Boolean);
      if (!lines.length) { toast("Впишите хотя бы одну строку"); break; }
      const base = s || order.stickers[0];
      lines.forEach((text) => {
        const hit = ICON_WORDS.find(([re]) => re.test(text));
        order.stickers.push({ ...base, id: uid(), text, sub: "", qty: 1, icon: hit ? hit[1] : base.icon });
      });
      order.stickers = mergeDuplicates(order.stickers);
      $("#bulk").value = "";
      toast(`Добавлено: ${lines.length}`);
      refresh({ list: true }); break;
    }
    case "shape":
      s.shape = b.dataset.v;
      if (s.shape === "circle") s.h = s.w = Math.min(s.w, s.h) < 16 ? Math.max(s.w, s.h) : Math.min(s.w, s.h);
      refresh({ list: true, props: true }); break;
    case "size":
      s.w = +b.dataset.w; s.h = +b.dataset.h;
      if (s.shape === "circle") s.h = s.w;
      refresh({ list: true, props: true }); break;
    case "icon": s.icon = b.dataset.v || null; refresh({ list: true, props: true }); break;
    case "bg": s.bg = b.dataset.v; refresh({ list: true, props: true }); break;
    case "fg": s.fg = b.dataset.v; refresh({ list: true, props: true }); break;
    case "apply-all":
      order.stickers = mergeDuplicates(order.stickers.map((x) => ({ ...x, shape: s.shape, w: s.w, h: s.h, bg: s.bg, fg: s.fg, font: s.font, weight: s.weight })));
      if (!current()) selected = order.stickers[0].id;
      toast("Готово: все наклейки одинаковые по форме и цвету");
      refresh({ list: true }); break;
  }
}

function onEditorInput(e) {
  const el = e.target;
  const field = el.dataset.field;
  if (!field) return;
  const s = el.dataset.id ? order.stickers.find((x) => x.id === el.dataset.id) : current();
  if (!s) return;
  if (field === "w" || field === "h") {
    const v = Math.round(+el.value);
    if (!v || v < 8) return;
    s[field] = Math.min(v, 280);
    if (s.shape === "circle") s.h = s.w;
  } else if (field === "font") {
    s.font = el.value;
    s.weight = el.value === "Caveat" || el.value === "PT Serif" || el.value === "Comfortaa" ? 700 : 600;
  } else if (field === "fs") {
    s.fs = Math.round(+el.value * 10) / 10;
  } else if (field === "qty") {
    const v = Math.round(+el.value);
    if (!v || v < 1) return; // пустое поле во время ввода — ждём
    s.qty = Math.min(QTY_MAX, v);
    save(); renderSheets(); renderSummary(); renderCount(); syncQtyRow(s);
    return;
  } else {
    s[field] = el.value;
  }
  save(); renderSheets(); renderSummary();
  if (s.id === selected) { syncFontSlider(); if (viewerOpen()) renderViewer(); }
  if (field === "fs") {
    const pick = $(`.s-row[data-id="${s.id}"] .s-pick`);
    if (pick) pick.innerHTML = miniSticker(s);
  }
  // синхронизация второго поля с тем же текстом
  if (field === "text") {
    app.querySelectorAll(`[data-field="text"]`).forEach((inp) => {
      const same = inp.dataset.id ? inp.dataset.id === s.id : s.id === selected;
      if (same && inp !== el) inp.value = s.text;
    });
    const pick = $(`.s-row[data-id="${s.id}"] .s-pick`);
    if (pick) pick.innerHTML = miniSticker(s);
  }
}

function onEditorChange(e) {
  if (e.target.dataset.field === "qty") {
    const s = order.stickers.find((x) => x.id === e.target.dataset.id);
    if (s) e.target.value = qtyOf(s); // вернуть корректное число, если поле оставили пустым
    return;
  }
  if (e.target.id === "material") { order.material = e.target.value; refresh(); }
  if (e.target.dataset.field === "w" || e.target.dataset.field === "h" || e.target.dataset.field === "font") refresh({ list: true, props: true });
}

// Выбрать наклейку и открыть окошко редактирования
function startEditing(id) {
  const wasOpen = editing && selected === id;
  selected = id; editing = true;
  refresh({ list: true, props: true });
  if (!wasOpen) scrollPropsOnMobile();
}

// На телефоне настройки ниже листа — прокручиваем так, чтобы окошко встало под шапку
function scrollPropsOnMobile() {
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  const box = $("#props");
  if (!box) return;
  const top = box.getBoundingClientRect().top + window.scrollY - (($(".top")?.offsetHeight) || 0) - 8;
  window.scrollTo({ top, behavior: "smooth" });
}

// ---------- оформление ----------
function viewOrder() {
  if (!order.stickers.length) { location.hash = "#/"; return; }
  const p = priceOf(order);
  const { sheets } = pack(order.stickers, order.sheet);
  app.innerHTML = `${header()}
  <main class="page checkout">
    <nav class="crumbs" aria-label="Путь"><a href="#/editor">Конструктор</a><span>/</span><span>Оформление</span></nav>
    <h1 class="page-title">Оформление заказа</h1>
    <div class="co">
      <section class="co-sum" aria-label="Ваш заказ">
        <div class="co-sheets">${sheets.map((s) => `<figure class="sheet sheet-sm" style="--w:${SHEETS[order.sheet].w};--h:${SHEETS[order.sheet].h}">${sheetSVG(s, order.sheet)}</figure>`).join("")}</div>
        <dl class="co-dl">
          <div><dt>Наклейки</dt><dd>${totalQty(order.stickers)} шт.${order.stickers.length > 1 ? `, ${order.stickers.length} ${plural(order.stickers.length, "вид", "вида", "видов")}` : ""}</dd></div>
          <div><dt>Листы</dt><dd>${p.sheets} × ${order.sheet}, по ${money(p.each)}</dd></div>
          <div><dt>Материал</dt><dd>${MATERIALS[order.material].name}</dd></div>
          <div class="co-total"><dt>Итого</dt><dd>${money(p.total)}</dd></div>
        </dl>
        <a class="btn btn-ghost btn-sm" href="#/editor">Вернуться и поправить</a>
      </section>
      <form class="co-form" id="coForm" novalidate>
        <label class="field">Имя и фамилия<input name="name" autocomplete="name" required></label>
        <label class="field">Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+359 …" required></label>
        <fieldset class="field"><legend>Доставка</legend>
          <label class="radio"><input type="radio" name="ship" value="econt" checked> Econt, до офиса</label>
          <label class="radio"><input type="radio" name="ship" value="speedy"> Speedy, до офиса</label>
          <label class="radio"><input type="radio" name="ship" value="courier"> Курьер до двери</label>
        </fieldset>
        <label class="field">Город и офис или адрес<input name="addr" required></label>
        <fieldset class="field"><legend>Оплата</legend>
          <label class="radio"><input type="radio" name="pay" value="cod" checked> Наложенным платежом при получении</label>
          <label class="radio"><input type="radio" name="pay" value="card"> Картой на сайте</label>
        </fieldset>
        <button class="btn btn-primary btn-wide" type="submit">Отправить заказ на ${money(p.total)}</button>
        <p class="muted" id="coMsg" role="status"></p>
      </form>
    </div>
  </main>
  ${footer()}`;
  app.onclick = null; app.oninput = null; app.onchange = null;
  $("#coForm").onsubmit = (e) => {
    e.preventDefault();
    $("#coMsg").textContent = "Это прототип: заказ никуда не отправлен, данные не сохраняются. Здесь будет оплата и приём заказа.";
  };
}

function notFound() {
  app.innerHTML = `${header()}<main class="page"><h1 class="page-title">Такой страницы нет</h1><p class="page-lead">Возможно, ссылка устарела.</p><a class="btn btn-primary" href="#/?to=catalog">Открыть каталог</a></main>${footer()}`;
}

// ---------- уведомление ----------
let toastTimer;
function toast(text) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
  t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- маршрутизация ----------
function route(keepScroll = false) {
  keepScroll = keepScroll === true;
  const y = window.scrollY;
  const raw = location.hash.slice(1) || "/";
  const [path, qs] = raw.split("?");
  const query = new URLSearchParams(qs || "");
  const parts = path.split("/").filter(Boolean);
  app.onclick = null; app.oninput = null; app.onchange = null;
  if (viewerOpen()) $("#viewer").close();
  document.body.classList.toggle("has-paybar", parts[0] === "editor" || parts[0] === "custom");

  if (keepScroll) query.delete("to");
  if (!parts.length) viewHome(query);
  else if (parts[0] === "c") viewCategory(parts[1]);
  else if (parts[0] === "s") viewStep(parts[1], parts[2], +parts[3] || 1);
  else if (parts[0] === "editor") viewEditor();
  else if (parts[0] === "custom") { startCustom(); location.replace("#/editor"); return; }
  else if (parts[0] === "order") viewOrder();
  else notFound();
  setTopHeight();

  if (keepScroll) window.scrollTo(0, y);
  else if (!query.get("to")) window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
// Перерисовать, когда загрузятся шрифты: от них зависит подбор кегля
if (document.fonts) {
  Promise.all(FONTS.flatMap((f) => [document.fonts.load(`400 20px "${f}"`), document.fonts.load(`700 20px "${f}"`)]))
    .then(() => route(true));
}
