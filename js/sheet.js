// Движок листа: раскладка наклеек, отрисовка в SVG (единицы — миллиметры), цена.
// Тот же код рисует превью на главной, в шагах выбора и в конструкторе.

const SHEET_MARGIN = 9; // поле под метки плоттера, мм
const GAP = 3;          // зазор между наклейками, мм

const _ctx = document.createElement("canvas").getContext("2d");
function textWidth(text, font, weight) {
  _ctx.font = `${weight} 100px "${font}"`;
  return _ctx.measureText(text).width / 100; // ширина при кегле 1
}

// Подбор кегля (в мм), чтобы строка влезла в ширину и высоту
function fitSize(text, font, weight, maxW, maxH) {
  if (!text) return 0;
  const k = textWidth(text, font, weight) || 0.5;
  return Math.max(1.2, Math.min(maxH, maxW / k));
}

const FALLBACK = { "PT Serif": "Georgia, serif", "Roboto Slab": "Georgia, serif", Caveat: "cursive", Neucha: "cursive", "Marck Script": "cursive", Lobster: "cursive" };
const fontStack = (f) => `'${f}', ${FALLBACK[f] || "sans-serif"}`;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Контур наклейки (линия реза)
function shapePath(s, x, y) {
  const { w, h } = s;
  switch (s.shape) {
    case "circle":
    case "oval":
      return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}"/>`;
    case "round": {
      const r = Math.min(w, h) * 0.28;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
    }
    case "tag": {
      const n = Math.min(h * 0.32, w * 0.2);
      return `<path d="M${x + n} ${y}H${x + w}V${y + h}H${x + n}L${x} ${y + h - n}V${y + n}Z"/>`;
    }
    case "banner": {
      const n = h * 0.32;
      return `<path d="M${x} ${y}H${x + w}L${x + w - n} ${y + h / 2}L${x + w} ${y + h}H${x}L${x + n} ${y + h / 2}Z"/>`;
    }
    default:
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0.8"/>`;
  }
}

// Внутренняя рабочая зона, куда помещаются картинка и текст
function innerBox(s) {
  const { w, h } = s;
  if (s.shape === "circle" || s.shape === "oval") {
    const k = 0.7071; // вписанный прямоугольник
    return { x: (w * (1 - k)) / 2, y: (h * (1 - k)) / 2, w: w * k, h: h * k };
  }
  const pad = Math.min(w, h) * 0.14;
  let left = pad, right = pad;
  if (s.shape === "tag") left += Math.min(h * 0.32, w * 0.2) * 0.9;
  if (s.shape === "banner") { left += h * 0.3; right += h * 0.3; }
  if (s.shape === "round") { left += Math.min(w, h) * 0.08; right += Math.min(w, h) * 0.08; }
  return { x: left, y: pad, w: w - left - right, h: h - pad * 2 };
}

// Раскладка содержимого наклейки: где картинка, где текст и какой кегль
// auto — подобранный размер, max — самый крупный, который ещё влезает
const FONT_MIN = 1.2; // мм, меньше плоттер и глаз не различат

function stickerLayout(s) {
  const box = innerBox(s);
  const font = s.font, weight = s.weight || 600;
  const lines = [s.text, s.sub].filter(Boolean);
  const hasIcon = !!ICONS[s.icon];
  const horizontal = box.w / box.h >= 1.6;
  let icon = null, tx = box.x, ty = box.y, tw = box.w, th = box.h;

  if (hasIcon) {
    if (horizontal) {
      const is = Math.min(box.h, box.w * 0.3);
      icon = { x: box.x, y: box.y + (box.h - is) / 2, size: is };
      tx = box.x + is + box.h * 0.18; tw = box.w - is - box.h * 0.18;
    } else {
      const is = Math.min(box.w * 0.6, box.h * (lines.length ? 0.55 : 0.9));
      icon = { x: box.x + (box.w - is) / 2, y: box.y, size: is };
      ty = box.y + is + box.h * 0.06; th = box.h - is - box.h * 0.06;
    }
  }

  const res = { lines, icon, tx, ty, tw, th, horizontal: hasIcon && horizontal, auto: 0, max: 0, main: 0, sub: 0 };
  if (!lines.length || th <= 1) return res;

  const two = lines.length === 2;
  const mainShare = two ? 0.62 : 1;
  const maxMain = fitSize(lines[0], font, weight, tw, th * mainShare * 0.92);
  // если вторая строка длинная, основной кегль ограничиваем, чтобы она тоже поместилась
  const subMax = two ? fitSize(lines[1], font, 400, tw, th * (1 - mainShare) * 0.92) / 0.62 : Infinity;
  const max = Math.max(FONT_MIN, Math.min(maxMain, two ? Math.max(subMax, maxMain * 0.5) : maxMain));
  // по умолчанию — не крупнее доли высоты, чтобы короткие слова не раздувались
  const auto = Math.min(max, s.h * (two ? 0.3 : 0.38));
  const main = s.fs ? Math.max(FONT_MIN, Math.min(s.fs, max)) : auto;
  const sub = two ? Math.min(main * 0.62, fitSize(lines[1], font, 400, tw, th * 0.92)) : 0;
  return Object.assign(res, { auto, max, main, sub });
}

function stickerContent(s, x, y) {
  const L = stickerLayout(s);
  const fg = s.fg, font = s.font, weight = s.weight || 600;
  let out = "";
  if (L.icon) {
    out += `<g transform="translate(${x + L.icon.x} ${y + L.icon.y}) scale(${L.icon.size / 24})" fill="none" stroke="${fg}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[s.icon]}"/></g>`;
  }
  if (L.main) {
    const total = L.main * 0.92 + (L.sub ? L.sub * 1.15 : 0);
    let cy = y + L.ty + (L.th - total) / 2 + L.main * 0.78;
    const cx = x + (L.horizontal ? L.tx : L.tx + L.tw / 2);
    const anchor = L.horizontal ? "start" : "middle";
    out += `<text x="${cx}" y="${cy}" font-family="${esc(fontStack(font))}" font-weight="${weight}" font-size="${L.main.toFixed(2)}" fill="${fg}" text-anchor="${anchor}">${esc(L.lines[0])}</text>`;
    if (L.sub) {
      cy += L.sub * 1.15 + L.main * 0.08;
      out += `<text x="${cx}" y="${cy}" font-family="${esc(fontStack(font))}" font-weight="400" font-size="${L.sub.toFixed(2)}" fill="${fg}" opacity=".82" text-anchor="${anchor}">${esc(L.lines[1])}</text>`;
    }
  }
  return out;
}

function stickerSVG(s, x, y, opts = {}) {
  const sel = opts.selected ? " is-selected" : "";
  const hole = s.shape === "tag"
    ? `<circle cx="${x + Math.min(s.h * 0.32, s.w * 0.2) * 0.72}" cy="${y + s.h / 2}" r="${Math.min(s.h * 0.07, 1.8)}" fill="${opts.liner || "#EEF1F4"}"/>`
    : "";
  return `<g class="stk${sel}" data-id="${s.id}">
    <g class="stk-body" fill="${s.bg}">${shapePath(s, x, y)}</g>
    ${hole}
    ${stickerContent(s, x, y)}
    <g class="stk-cut" fill="none">${shapePath(s, x, y)}</g>
  </g>`;
}

// Количество наклеек одного вида
const qtyOf = (s) => Math.max(1, Math.round(+s.qty || 1));
const totalQty = (stickers) => stickers.reduce((n, s) => n + qtyOf(s), 0);

// Одинаковые наклейки (всё, кроме id и количества) объединяются в одну строку
const stickerKey = ({ id, qty, ...rest }) => JSON.stringify(Object.keys(rest).sort().map((k) => [k, rest[k]]));
function mergeDuplicates(stickers) {
  const out = [], seen = new Map();
  for (const s of stickers) {
    const k = stickerKey(s);
    if (seen.has(k)) seen.get(k).qty = qtyOf(seen.get(k)) + qtyOf(s);
    else { const c = { ...s, qty: qtyOf(s) }; seen.set(k, c); out.push(c); }
  }
  return out;
}

// ---------- Раскладка на листе ----------
// Уровень оптимизации:
//   0   — строго по порядку списка, рядами (как набрано);
//   50  — удобная: одинаковые и близкие по высоте наклейки рядом, ровными рядами;
//   100 — максимальная: каждая наклейка ищет любое свободное место, пробуем несколько
//         стратегий и берём ту, что даёт меньше листов.
const OPT_LEVELS = [0, 50, 100];

function packArea(sheetKey) {
  const sh = SHEETS[sheetKey];
  return { W: sh.w - SHEET_MARGIN * 2, H: sh.h - SHEET_MARGIN * 2 };
}

// Ряды (полки): каждая наклейка встаёт в первый ряд, куда влезает, иначе открывает новый
function shelfPack(copies, W, H) {
  const sheets = [];
  let cur = null;
  const newSheet = () => { cur = { shelves: [], items: [], usedH: 0 }; sheets.push(cur); };
  newSheet();
  for (const s of copies) {
    let placed = false;
    for (const shelf of cur.shelves) {
      if (s.h <= shelf.h && shelf.x + s.w <= W) {
        cur.items.push({ s, x: shelf.x, y: shelf.y });
        shelf.x += s.w + GAP; placed = true; break;
      }
    }
    if (placed) continue;
    if ((cur.usedH ? cur.usedH + GAP : 0) + s.h > H) newSheet();
    const y = cur.usedH ? cur.usedH + GAP : 0;
    cur.shelves.push({ y, h: s.h, x: s.w + GAP });
    cur.usedH = y + s.h;
    cur.items.push({ s, x: 0, y });
  }
  return sheets;
}

// Свободные прямоугольники (MaxRects). Зазор учитываем, увеличивая каждую наклейку и лист на GAP.
function maxRectsPack(copies, W, H, rule, allowRotate = false) {
  const BW = W + GAP, BH = H + GAP;
  const sheets = [];
  let left = copies.slice();
  while (left.length) {
    let free = [{ x: 0, y: 0, w: BW, h: BH }];
    const items = [], rest = [];
    for (const s of left) {
      // варианты ориентации: как есть и, если разрешено, повёрнутая на 90°
      const orients = [[s.w + GAP, s.h + GAP, false]];
      if (allowRotate && s.w !== s.h) orients.push([s.h + GAP, s.w + GAP, true]);
      let best = null, bs1 = Infinity, bs2 = Infinity;
      for (const f of free) for (const [w, h, rot] of orients) {
        if (w > f.w + 1e-6 || h > f.h + 1e-6) continue;
        let a, b;
        if (rule === "bl") { a = f.y + h; b = f.x; }                              // снизу-слева: плотнее к верху листа
        else { const dw = f.w - w, dh = f.h - h; a = Math.min(dw, dh); b = Math.max(dw, dh); } // лучшая короткая сторона
        if (a < bs1 - 1e-6 || (Math.abs(a - bs1) < 1e-6 && b < bs2)) { bs1 = a; bs2 = b; best = { x: f.x, y: f.y, w, h, rot }; }
      }
      if (!best) { rest.push(s); continue; }
      const r = { x: best.x, y: best.y, w: best.w, h: best.h };
      items.push({ s, x: r.x, y: r.y, rot: best.rot, ph: best.h - GAP });
      // разрезать все свободные области, которые пересекает новая наклейка
      const next = [];
      for (const f of free) {
        if (r.x >= f.x + f.w || r.x + r.w <= f.x || r.y >= f.y + f.h || r.y + r.h <= f.y) { next.push(f); continue; }
        if (r.x > f.x) next.push({ x: f.x, y: f.y, w: r.x - f.x, h: f.h });
        if (r.x + r.w < f.x + f.w) next.push({ x: r.x + r.w, y: f.y, w: f.x + f.w - r.x - r.w, h: f.h });
        if (r.y > f.y) next.push({ x: f.x, y: f.y, w: f.w, h: r.y - f.y });
        if (r.y + r.h < f.y + f.h) next.push({ x: f.x, y: r.y + r.h, w: f.w, h: f.y + f.h - r.y - r.h });
      }
      // убрать области, целиком лежащие внутри других
      free = next.filter((a, i) => !next.some((b, j) => j !== i &&
        a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h && (j < i || a.w !== b.w || a.h !== b.h || a.x !== b.x || a.y !== b.y)));
    }
    if (!items.length) break; // защита: ничего не влезло
    sheets.push({ items });
    left = rest;
  }
  return sheets;
}

const usedHeight = (sheet) => sheet.items.reduce((m, it) => Math.max(m, it.y + (it.ph ?? it.s.h)), 0);

function pack(stickers, sheetKey, opt = 0) {
  const { W, H } = packArea(sheetKey);
  const tooBig = new Set();
  const order = new Map(stickers.map((s, i) => [s.id, i]));
  const copies = [];
  for (const s of stickers) {
    if (s.w > W || s.h > H) { tooBig.add(s.id); continue; }
    for (let k = 0; k < qtyOf(s); k++) copies.push(s);
  }
  let sheets;
  if (opt >= 100) {
    // несколько порядков и два правила — берём лучший результат
    const by = (f) => copies.slice().sort((a, b) => f(b) - f(a) || order.get(a.id) - order.get(b.id));
    const orders = [by((s) => s.w * s.h), by((s) => s.h * 1000 + s.w), by((s) => s.w * 1000 + s.h), by((s) => Math.max(s.w, s.h))];
    let best = null, bestKey = null;
    // на 100% разрешаем поворот на 90°: пробуем и с поворотом, и без
    for (const o of orders) for (const rule of ["bssf", "bl"]) for (const rot of [false, true]) {
      const r = maxRectsPack(o, W, H, rule, rot);
      const key = [r.length, usedHeight(r[r.length - 1] || { items: [] })];
      if (!best || key[0] < bestKey[0] || (key[0] === bestKey[0] && key[1] < bestKey[1])) { best = r; bestKey = key; }
    }
    // ряды с сортировкой иногда не хуже — тогда берём их, они аккуратнее
    const rows = shelfPack(by((s) => s.h * 1000 + s.w), W, H);
    const rowsKey = [rows.length, usedHeight(rows[rows.length - 1])];
    if (!best || rowsKey[0] < bestKey[0] || (rowsKey[0] === bestKey[0] && rowsKey[1] <= bestKey[1])) best = rows;
    sheets = best;
  } else if (opt >= 50) {
    // удобная: по высоте, внутри одинаковые наклейки подряд, ровные ряды
    const sorted = copies.slice().sort((a, b) => b.h - a.h || b.w - a.w || order.get(a.id) - order.get(b.id));
    sheets = shelfPack(sorted, W, H);
  } else {
    sheets = shelfPack(copies, W, H);
  }
  if (!sheets.length) sheets = [{ items: [] }];
  return { sheets, tooBig: [...tooBig], W, H };
}

const workOpt = (w) => (w && OPT_LEVELS.includes(w.opt) ? w.opt : 50);
const packWork = (w) => pack(w.stickers, w.sheet, workOpt(w));

// Сколько ещё копий наклейки s влезет, не добавляя новый лист
function spaceLeftFor(s, stickers, sheetKey, opt = 0) {
  const base = pack(stickers, sheetKey, opt).sheets.length;
  const probe = stickers.map((x) => ({ ...x }));
  let target = probe.find((x) => x.id === s.id);
  if (!target) { target = { ...s, qty: 0 }; probe.push(target); }
  const start = qtyOf(target) - (target.qty === 0 ? 1 : 0);
  let n = 0;
  while (n < 500) {
    target.qty = start + n + 1;
    if (pack(probe, sheetKey, opt).sheets.length > base) break;
    n++;
  }
  return n;
}

function sheetSVG(sheet, sheetKey, opts = {}) {
  const sh = SHEETS[sheetKey];
  const liner = "#EEF1F4";
  const m = 3.5, q = 4.5; // метки плоттера
  const marks = `<g fill="#1C2340"><rect x="${m}" y="${m}" width="${q}" height="${q}"/><rect x="${sh.w - m - q}" y="${m}" width="${q}" height="${q}"/><rect x="${m}" y="${sh.h - m - q}" width="${q}" height="${q}"/></g>`;
  const items = sheet.items.map(({ s, x, y, rot }) => {
    const o = { selected: opts.selected === s.id, liner };
    if (!rot) return stickerSVG(s, SHEET_MARGIN + x, SHEET_MARGIN + y, o);
    // повёрнутая наклейка: рисуем в своих координатах и поворачиваем на 90° по часовой
    return `<g transform="translate(${SHEET_MARGIN + x + s.h} ${SHEET_MARGIN + y}) rotate(90)">${stickerSVG(s, 0, 0, o)}</g>`;
  }).join("");
  return `<svg class="sheet-svg" viewBox="0 0 ${sh.w} ${sh.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Лист ${sh.label} с наклейками">
    <rect width="${sh.w}" height="${sh.h}" fill="${liner}"/>
    ${marks}${items}
  </svg>`;
}

function priceOf(order) {
  const { sheets } = packWork(order);
  const n = Math.max(1, sheets.length);
  const each = SHEETS[order.sheet].price * (1 + (MATERIALS[order.material]?.extra || 0));
  return { sheets: n, each, total: Math.round(n * each * 100) / 100 };
}

const money = (v) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "EUR", minimumFractionDigits: v % 1 ? 2 : 0 }).format(v);

function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}
