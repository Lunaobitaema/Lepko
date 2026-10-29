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

const FALLBACK = { "PT Serif": "Georgia, serif", Caveat: "cursive", Comfortaa: "sans-serif", Unbounded: "sans-serif", Onest: "sans-serif" };
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

function stickerContent(s, x, y) {
  const box = innerBox(s);
  const bx = x + box.x, by = y + box.y;
  const fg = s.fg, font = s.font, weight = s.weight || 600;
  const lines = [s.text, s.sub].filter(Boolean);
  let out = "";

  const hasIcon = !!ICONS[s.icon];
  const horizontal = box.w / box.h >= 1.6;
  let tx = bx, ty = by, tw = box.w, th = box.h, anchor = "middle";

  if (hasIcon) {
    if (horizontal) {
      const is = Math.min(box.h, box.w * 0.3);
      out += `<g transform="translate(${bx} ${by + (box.h - is) / 2}) scale(${is / 24})" fill="none" stroke="${fg}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[s.icon]}"/></g>`;
      tx = bx + is + box.h * 0.18; tw = box.w - is - box.h * 0.18;
    } else {
      const is = Math.min(box.w * 0.6, box.h * (lines.length ? 0.55 : 0.9));
      out += `<g transform="translate(${bx + (box.w - is) / 2} ${by}) scale(${is / 24})" fill="none" stroke="${fg}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[s.icon]}"/></g>`;
      ty = by + is + box.h * 0.06; th = box.h - is - box.h * 0.06;
    }
  }

  if (lines.length && th > 1) {
    const mainShare = lines.length === 2 ? 0.62 : 1;
    // потолок кегля от высоты наклейки, чтобы короткие слова не раздувались
    const cap = s.h * (lines.length === 2 ? 0.3 : 0.38);
    const mainSize = Math.min(cap, fitSize(lines[0], font, weight, tw, th * mainShare * 0.92));
    const subSize = lines[1] ? Math.min(mainSize * 0.62, fitSize(lines[1], font, 400, tw, th * (1 - mainShare) * 0.92)) : 0;
    const total = mainSize * 0.92 + (subSize ? subSize * 1.15 : 0);
    let cy = ty + (th - total) / 2 + mainSize * 0.78;
    const cx = hasIcon && horizontal ? tx : tx + tw / 2;
    anchor = hasIcon && horizontal ? "start" : "middle";
    out += `<text x="${cx}" y="${cy}" font-family="${esc(fontStack(font))}" font-weight="${weight}" font-size="${mainSize.toFixed(2)}" fill="${fg}" text-anchor="${anchor}">${esc(lines[0])}</text>`;
    if (subSize) {
      cy += subSize * 1.15 + mainSize * 0.08;
      out += `<text x="${cx}" y="${cy}" font-family="${esc(fontStack(font))}" font-weight="400" font-size="${subSize.toFixed(2)}" fill="${fg}" opacity=".82" text-anchor="${anchor}">${esc(lines[1])}</text>`;
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

// Раскладка по полкам, по порядку; когда лист заполнен — следующий лист
function pack(stickers, sheetKey) {
  const sh = SHEETS[sheetKey];
  const W = sh.w - SHEET_MARGIN * 2, H = sh.h - SHEET_MARGIN * 2;
  const sheets = [];
  const tooBig = [];
  let cur = null;
  const newSheet = () => { cur = { shelves: [], items: [], usedH: 0 }; sheets.push(cur); };
  newSheet();

  for (const s of stickers) {
    if (s.w > W || s.h > H) { tooBig.push(s.id); continue; }
    let placed = false;
    for (const shelf of cur.shelves) {
      if (s.h <= shelf.h && shelf.x + s.w <= W) {
        cur.items.push({ s, x: shelf.x, y: shelf.y });
        shelf.x += s.w + GAP; placed = true; break;
      }
    }
    if (placed) continue;
    const y = cur.usedH ? cur.usedH + GAP : 0;
    if (y + s.h > H) { newSheet(); }
    const yy = cur.usedH ? cur.usedH + GAP : 0;
    const shelf = { y: yy, h: s.h, x: s.w + GAP };
    cur.shelves.push(shelf);
    cur.usedH = yy + s.h;
    cur.items.push({ s, x: 0, y: yy });
  }
  if (sheets.length > 1 && !sheets[sheets.length - 1].items.length) sheets.pop();
  return { sheets, tooBig, W, H };
}

// Сколько ещё копий наклейки s влезет на последний лист
function spaceLeftFor(s, stickers, sheetKey) {
  const base = pack(stickers, sheetKey).sheets.length;
  let n = 0;
  const probe = [...stickers];
  while (n < 200) {
    probe.push({ ...s, id: "probe" + n });
    if (pack(probe, sheetKey).sheets.length > base) break;
    n++;
  }
  return n;
}

function sheetSVG(sheet, sheetKey, opts = {}) {
  const sh = SHEETS[sheetKey];
  const liner = "#EEF1F4";
  const m = 3.5, q = 4.5; // метки плоттера
  const marks = `<g fill="#1C2340"><rect x="${m}" y="${m}" width="${q}" height="${q}"/><rect x="${sh.w - m - q}" y="${m}" width="${q}" height="${q}"/><rect x="${m}" y="${sh.h - m - q}" width="${q}" height="${q}"/></g>`;
  const items = sheet.items.map(({ s, x, y }) => stickerSVG(s, SHEET_MARGIN + x, SHEET_MARGIN + y, { selected: opts.selected === s.id, liner })).join("");
  return `<svg class="sheet-svg" viewBox="0 0 ${sh.w} ${sh.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Лист ${sh.label} с наклейками">
    <rect width="${sh.w}" height="${sh.h}" fill="${liner}"/>
    ${marks}${items}
  </svg>`;
}

function priceOf(order) {
  const { sheets } = pack(order.stickers, order.sheet);
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
