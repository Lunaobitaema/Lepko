// Этикетки для мастеров и малого бизнеса: индивидуальный дизайн, малые тиражи.
// Отдельно от конструктора: описание, примеры и заявка.

const BRAND_CREDITS = {
  "1669384536024-d091ddc00f4c": ["Sticker it", "stickerit_co"],
  "1668510468038-3607aae3f03c": ["Sticker it", "stickerit_co"],
  "1546552768-9e3a94b38a59": ["Heather Ford", "the_modern_life_mrs"],
  "1602607203588-d6d0eda790e3": ["Luma Candles", "candlesbyluma"],
  "1559180786-c6f26acc1111": ["Jon Koop", "jon_koop"],
  "1611930021559-4a5cb5c38da3": ["Alex Lvrs", "sud_studio"],
  "1454873019514-eae2f086587a": ["Kristina Balić", "daisyk9"],
};
Object.assign(CREDITS, BRAND_CREDITS);

const BRAND_EXAMPLES = [
  ["1669384536024-d091ddc00f4c", "Мёд и варенье", "Этикетка с логотипом пасеки, сортом мёда и контактами. Круглая наклейка на крышку в пару."],
  ["1546552768-9e3a94b38a59", "Мыло ручной работы", "Узкая лента вокруг бруска или наклейка на крафт-упаковку: название, состав, вес."],
  ["1602607203588-d6d0eda790e3", "Свечи", "Аромат, время горения и предупреждения. На стекло, металл и картонную коробку."],
  ["1611930021559-4a5cb5c38da3", "Косметика", "Флаконы и баночки: название, объём, состав, срок годности и партия."],
  ["1559180786-c6f26acc1111", "Крафтовые напитки", "Бутылки домашнего вина, ракии, сидра, лимонада. Серия этикеток в одном стиле."],
  ["1454873019514-eae2f086587a", "Упаковка и подарки", "Наклейки-пломбы, «спасибо за покупку», логотип на пакеты и коробки."],
];

function viewBrand() {
  const examples = BRAND_EXAMPLES.map(([id, name, text]) => `
    <article class="br-ex">
      <div class="br-ex-photo">${photoImg(id, name, 700)}</div>
      <h3>${esc(name)}</h3>
      <p>${esc(text)}</p>
    </article>`).join("");

  app.innerHTML = `${header()}
  <main class="brand">
    <section class="br-hero">
      <div class="br-hero-text">
        <p class="br-kicker">Для мастеров и небольшого бизнеса</p>
        <h1>Этикетки для вашего товара</h1>
        <p class="br-lead">Нарисуем этикетку под ваш мёд, мыло, свечи или косметику и напечатаем столько, сколько нужно сейчас. Без миллионных тиражей типографии и без шаблонов из интернета.</p>
        <a class="btn btn-primary" href="#/labels?to=br-form">Обсудить этикетку</a>
      </div>
      <div class="br-hero-photo">${photoImg("1668510468038-3607aae3f03c", "Прозрачная этикетка на банке мёда", 1000)}</div>
    </section>

    <section class="page br-section">
      <div class="br-points">
        <div><h2>Дизайн под вас</h2><p>Работаем лично с вами: логотип, цвета, шрифты, обязательная информация о товаре. Показываем макет и правим, пока не понравится.</p></div>
        <div><h2>Малые тиражи</h2><p>Можно начать с одного листа и допечатывать партиями по мере продаж. Повторный тираж по готовому макету — только печать.</p></div>
        <div><h2>Любая форма</h2><p>Круг, овал, лента, фигурная этикетка по контуру логотипа. Плёнка с ламинатом не боится воды и рук.</p></div>
      </div>
    </section>

    <section class="page br-section" aria-labelledby="br-ex-title">
      <h2 id="br-ex-title" class="section-title">Что делаем</h2>
      <div class="br-examples">${examples}</div>
    </section>

    <section class="page br-section" aria-labelledby="br-how-title">
      <h2 id="br-how-title" class="section-title">Как работаем</h2>
      <ol class="steps br-steps">
        <li><b>Заявка</b><span>Оставьте контакт и пару слов о товаре.</span></li>
        <li><b>Разговор</b><span>Обсуждаем размер, количество, стиль и что должно быть на этикетке.</span></li>
        <li><b>Макет</b><span>Готовим варианты дизайна и вносим правки.</span></li>
        <li><b>Пробный лист</b><span>При желании печатаем пробу, чтобы примерить на свою упаковку.</span></li>
        <li><b>Тираж</b><span>Печатаем, режем по контуру и отправляем Econt или Speedy.</span></li>
      </ol>
      <p class="br-note">Стоимость считаем после разговора: дизайн оплачивается один раз, дальше платите только за печать.</p>
    </section>

    <section class="page br-section" id="br-form" aria-labelledby="br-form-title">
      <div class="br-form-wrap">
        <div>
          <h2 id="br-form-title" class="section-title">Расскажите о своём товаре</h2>
          <p class="page-lead">Свяжемся с вами в течение рабочего дня, удобным для вас способом.</p>
        </div>
        <form class="co-form br-form" id="brForm" novalidate>
          <label class="field">Как к вам обращаться<input name="name" autocomplete="name" required></label>
          <label class="field">Как с вами связаться <span class="muted">телефон, Viber, Telegram или e-mail</span>
            <input name="contact" required placeholder="+359 … или @ник">
          </label>
          <label class="field">Что за товар<input name="product" placeholder="Например, мёд в банках 250 и 500 г"></label>
          <fieldset class="field"><legend>Сколько этикеток нужно на первый раз</legend>
            <div class="chips br-qty">
              ${["до 50", "50–200", "200–500", "больше 500", "пока не знаю"].map((q, i) => `<label class="chip-radio"><input type="radio" name="qty" value="${q}" ${i === 4 ? "checked" : ""}><span>${q}</span></label>`).join("")}
            </div>
          </fieldset>
          <label class="field">Идея, пожелания, ссылки на примеры
            <textarea name="idea" rows="5" placeholder="Какой стиль нравится, есть ли логотип, что обязательно должно быть на этикетке"></textarea>
          </label>
          <button class="btn btn-primary btn-wide" type="submit">Отправить заявку</button>
          <p class="muted" id="brMsg" role="status"></p>
        </form>
      </div>
    </section>
  </main>
  ${footer()}`;

  $("#brForm").onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.name.value.trim() || !f.contact.value.trim()) {
      $("#brMsg").textContent = "Заполните имя и контакт, чтобы мы могли с вами связаться.";
      (f.name.value.trim() ? f.contact : f.name).focus();
      return;
    }
    $("#brMsg").textContent = "Это прототип: заявка пока никуда не отправляется. Здесь она будет приходить вам на почту или в Telegram.";
  };
}
