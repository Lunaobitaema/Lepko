// Лаборатория: тестовые листы для проверки материалов в посудомойке.
// Коды Т01–Т20 совпадают с таблицей «Лепко_тест_посудомойка.xlsx».

const LAB_COMBOS = [
  // [плёнка, ламинат, форма, короткая подпись]
  ["Orajet 3164 белая", "Oraguard 210 глянец", "round", "3164 · 210 гл"],
  ["Orajet 3164 белая", "Oraguard 210 мат", "round", "3164 · 210 мат"],
  ["Orajet 3164 белая", "Oraguard 215", "round", "3164 · 215"],
  ["Orajet 3164 белая", "Без ламината", "round", "3164 · без лам."],
  ["Orajet 3164 прозрачная", "Oraguard 210 глянец", "round", "3164 прозр · 210 гл"],
  ["Avery MPI 3001 снимаемая", "Oraguard 210 глянец", "round", "MPI 3001 · 210 гл"],
  ["Orajet 3164HT", "Oraguard 210 глянец", "round", "3164HT · 210 гл"],
  ["Avery MPI 3000 белая", "Oraguard 210 глянец", "round", "MPI 3000 · 210 гл"],
  ["Orajet 3164 белая", "Oraguard 210 глянец", "rect", "3164 · 210 гл · углы"],
  ["Orajet 3164 белая", "Oraguard 215", "rect", "3164 · 215 · углы"],
];
const LAB_SUBS = [["Стекло", "стекло"], ["Пластик PP", "пластик"]];

// Образцы в том же порядке, что в таблице: каждое сочетание на стекле и на пластике
const LAB_SAMPLES = LAB_COMBOS.flatMap(([film, lam, shape, short], i) =>
  LAB_SUBS.map(([sub, subShort], k) => ({
    code: "Т" + String(i * 2 + k + 1).padStart(2, "0"),
    film, lam, shape, short, sub, subShort,
  })));

// Печатаем по материалу: одна плёнка + один ламинат = один лист
function labGroups() {
  const map = new Map();
  for (const s of LAB_SAMPLES) {
    const key = s.film + "|" + s.lam;
    if (!map.has(key)) map.set(key, { film: s.film, lam: s.lam, items: [] });
    map.get(key).items.push(s);
  }
  return [...map.values()];
}

const LAB_W = 40, LAB_H = 22, LAB_GAP = 4, LAB_M = 9, LAB_HEAD = 7;
const LAB_FONT = "Arial, Helvetica, sans-serif";

function labStickerSVG(s, x, y, clear) {
  const r = s.shape === "round" ? 4 : 0;
  const ink = "#1C2340";
  const bg = clear ? "none" : "#FFFFFF";
  const matt = s.lam.includes("мат");
  const sq = 3.2, sx = x + LAB_W - 3 - sq * 4, sy = y + LAB_H - 3 - sq;
  const cmyk = ["#00AEEF", "#EC008C", "#FFF200", "#000000"]
    .map((c, i) => `<rect x="${sx + i * sq}" y="${sy}" width="${sq}" height="${sq}" fill="${c}"/>`).join("");
  const dateBox = matt
    ? `<rect x="${x + 22}" y="${y + 3}" width="15" height="7.5" rx="1" fill="none" stroke="${ink}" stroke-width="0.2" stroke-dasharray="0.8 0.6"/><text x="${x + 29.5}" y="${y + 12.6}" font-size="1.6" text-anchor="middle" fill="${ink}" font-family="${LAB_FONT}">дата маркером</text>`
    : "";
  return `<g>
    <rect x="${x}" y="${y}" width="${LAB_W}" height="${LAB_H}" rx="${r}" fill="${bg}"/>
    <text x="${x + 3}" y="${y + 8.2}" font-size="6.4" font-weight="700" fill="${ink}" font-family="${LAB_FONT}">${s.code}</text>
    <text x="${x + 3}" y="${y + 11.6}" font-size="2.2" fill="${ink}" font-family="${LAB_FONT}">${esc(s.subShort)}</text>
    <text x="${x + 3}" y="${y + 15}" font-size="2.12" fill="${ink}" font-family="${LAB_FONT}">${esc(s.short)}</text>
    <text x="${x + 3}" y="${y + 19}" font-size="2.12" fill="${ink}" font-family="${LAB_FONT}">Мелкий текст 6 pt</text>
    ${dateBox}
    ${cmyk}
  </g>`;
}

function labCutPath(s, x, y) {
  const r = s.shape === "round" ? 4 : 0;
  return `<rect x="${x}" y="${y}" width="${LAB_W}" height="${LAB_H}" rx="${r}"/>`;
}

// Лист одной группы. forPrint — без подложки и пунктира, с отдельным слоем CutContour
function labSheetSVG(g, forPrint = false) {
  const cols = 2;
  const rows = Math.ceil(g.items.length / cols);
  const W = LAB_M * 2 + cols * LAB_W + (cols - 1) * LAB_GAP;
  const H = LAB_M * 2 + LAB_HEAD + rows * LAB_H + (rows - 1) * LAB_GAP;
  const clear = g.film.includes("прозрачная");
  const pos = g.items.map((s, i) => ({ s, x: LAB_M + (i % cols) * (LAB_W + LAB_GAP), y: LAB_M + LAB_HEAD + Math.floor(i / cols) * (LAB_H + LAB_GAP) }));
  const m = 3.5, q = 4.5;
  const marks = `<g id="Marks" fill="#000000"><rect x="${m}" y="${m}" width="${q}" height="${q}"/><rect x="${W - m - q}" y="${m}" width="${q}" height="${q}"/><rect x="${m}" y="${H - m - q}" width="${q}" height="${q}"/></g>`;
  const head = `<text x="${LAB_M + 2}" y="${LAB_M + 2.5}" font-size="2.6" font-weight="700" fill="#1C2340" font-family="${LAB_FONT}">${esc(g.film)} + ${esc(g.lam)}</text>
    <text x="${LAB_M + 2}" y="${LAB_M + 5.6}" font-size="2" fill="#505872" font-family="${LAB_FONT}">Лепко · тест посудомойки · ${g.items.map((s) => s.code).join(", ")}</text>`;
  const art = pos.map(({ s, x, y }) => labStickerSVG(s, x, y, clear)).join("");
  const cut = pos.map(({ s, x, y }) => labCutPath(s, x, y)).join("");
  const dims = `width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}"`;
  if (forPrint) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" ${dims}>
  <title>Лепко тест: ${esc(g.film)} + ${esc(g.lam)}</title>
  <g id="Print">${marks}${head}${art}</g>
  <g id="CutContour" fill="none" stroke="#EC008C" stroke-width="0.25">${cut}</g>
</svg>`;
  }
  return `<svg class="sheet-svg" xmlns="http://www.w3.org/2000/svg" ${dims} role="img" aria-label="Тестовый лист ${esc(g.film)} + ${esc(g.lam)}">
    <rect width="${W}" height="${H}" fill="${clear ? "#DDE3EA" : "#EEF1F4"}"/>
    ${marks}${head}${art}
    <g fill="none" stroke="#8A93A8" stroke-width="0.25" stroke-dasharray="0.9 0.7">${cut}</g>
  </svg>`;
}

function labFileName(g) {
  const slug = (t) => t.replace(/Orajet |Oraguard |Avery /g, "").replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "");
  return `lepko-test_${slug(g.film)}_${slug(g.lam)}.svg`;
}

function labDownload(i) {
  const g = labGroups()[i];
  const blob = new Blob([labSheetSVG(g, true)], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = labFileName(g);
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function viewLab() {
  const groups = labGroups();
  const cards = groups.map((g, i) => `
    <article class="lab-card">
      <div class="lab-sheet">${labSheetSVG(g)}</div>
      <div class="lab-info">
        <h2>${esc(g.film)}<br><span>+ ${esc(g.lam)}</span></h2>
        <p class="muted">${g.items.length} ${plural(g.items.length, "образец", "образца", "образцов")}: ${g.items.map((s) => `<b>${s.code}</b> ${esc(s.subShort)}${s.shape === "rect" ? ", острые углы" : ""}`).join("; ")}</p>
        <button class="btn btn-primary btn-sm" data-lab="${i}">Скачать для печати (SVG)</button>
      </div>
    </article>`).join("");

  app.innerHTML = `${header()}
  <main class="page lab">
    <nav class="crumbs" aria-label="Путь"><a href="#/">Главная</a><span>/</span><span>Лаборатория</span></nav>
    <h1 class="page-title">Лаборатория: тест посудомойки</h1>
    <p class="page-lead">Служебная страница для проверки материалов. 20 образцов из таблицы «Лепко_тест_посудомойка», разложены по 8 листам: каждый лист печатается на своей плёнке и ламинируется своим ламинатом.</p>

    <ol class="lab-steps">
      <li><b>Скачайте листы</b> кнопкой под каждым. Файл SVG в натуральную величину, в миллиметрах. Слой <code>Print</code> — печать, слой <code>CutContour</code> — линия реза плашечным цветом. Откройте в Illustrator или CorelDRAW и отправьте в RIP как обычно.</li>
      <li><b>Печать и сушка.</b> Печать на указанной плёнке, сутки сушки, затем ламинат из подписи листа. Лист «без ламината» не ламинировать.</li>
      <li><b>Порезка</b> по меткам, надсечкой, не прорезая подложку.</li>
      <li><b>Наклейка.</b> На каждом образце написано, куда его клеить: «стекло» или «пластик». На матовых наклейках впишите дату маркером в пунктирную рамку.</li>
      <li><b>Дальше по таблице:</b> сутки выдержки, фото, ежедневная мойка и оценка.</li>
    </ol>

    <div class="lab-legend">
      <span><b>Т01</b> — код в таблице</span>
      <span>мелкий текст 6 pt — видно, когда начнёт стираться</span>
      <span>квадраты C, M, Y, K — видно выцветание каждого цвета</span>
    </div>

    <div class="lab-grid">${cards}</div>
  </main>
  ${footer()}`;

  app.onclick = (e) => {
    const b = e.target.closest("[data-lab]");
    if (b) labDownload(+b.dataset.lab);
  };
}
