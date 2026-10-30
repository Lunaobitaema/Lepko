// Данные прототипа: категории, готовые решения, стили, материалы, листы.
// Фото — Unsplash (временно, до собственных фото готовых работ).

const PHOTO = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const CREDITS = {
  "1786398018341-9987018dcdcc": ["Cabri Caldwell", "minimizethenorganize"],
  "1617510711388-6f88e078d698": ["Tamara Malaniy", "tamarushphotos"],
  "1645567454567-901dc409551b": ["Steven Ungermann", "steveungermann"],
  "1786398018370-079064d79d84": ["Cabri Caldwell", "minimizethenorganize"],
  "1786413568427-d65dec4e215b": ["Cabri Caldwell", "minimizethenorganize"],
  "1580116270858-8a0d62b15426": ["Heather McKean", "hjmckean"],
  "1640348784724-93f7b14d8047": ["Ray Shrewsberry", "ray12119"],
  "1576020301507-5d5a00982053": ["Brooke Lark", "brookelark"],
  "1645871306587-bebaa2f1dfc0": ["Rob Wicks", "robwicks"],
  "1531346878377-a5be20888e57": ["Marissa Grootes", "marissacristina"],
  "1615988938302-bd2a5a7023bc": ["Nic Rosenau", "nicreates"],
  "1687946803051-51da173a9f55": ["ASR Design Studio", "asrdesignstudio"],
  "1758790015863-4f9798bb818f": ["Roman Kravtsov", "r_kravtsov"],
  "1599651971621-7c42aaa20cd2": ["Julia", "beazy"],
  "1761074342668-c38fc2e62e67": ["Marine Le Gac", "plustrenn"],
  "1576446470246-499c738d1c8e": ["Mark Kats", "bulava92"],
  "1730154838368-c37b1fdebcf6": ["Dina Badamshina", "dinaamazing"],
  "1650229068182-6931ccb389c2": ["Jaclyn Baxter", "a_jackie_of_all_trades"],
  "1757087824089-bdb33ecc3439": ["American Cleaning Institute", "brg_communications"],
  "1522708323590-d24dbb6b0267": ["deborah cortelazzi", "deborah_cortelazzi"],
  "1665249934445-1de680641f50": ["Danilo Rios", "danrop"],
};

const SHEETS = {
  A6: { w: 105, h: 148, price: 3, label: "A6", hint: "как открытка" },
  A5: { w: 148, h: 210, price: 5, label: "A5", hint: "половина тетрадного листа" },
  A4: { w: 210, h: 297, price: 8, label: "A4", hint: "как лист бумаги" },
};

// Пока один материал: белая плёнка с ламинатом. Выбор условий (кухня, морозилка, улица)
// вернём после тестов материалов.
const MATERIALS = {
  standard: { name: "Плёнка с ламинатом", text: "Белая виниловая плёнка, сверху защитный ламинат.", extra: 0, icon: "box" },
};

const STYLES = {
  minimal: { name: "Минимализм", bg: "#FFFFFF", fg: "#1C2340", font: "Onest", weight: 600 },
  kraft: { name: "Крафт", bg: "#CDAA7D", fg: "#3B2A17", font: "PT Serif", weight: 700 },
  chalk: { name: "Меловая доска", bg: "#2D3331", fg: "#F3F1E8", font: "Caveat", weight: 700 },
  kids: { name: "Детский", bg: "#FFD9CF", fg: "#1C2340", font: "Comfortaa", weight: 700, cycle: ["#FFD9CF", "#CDE8FF", "#D8F2D0", "#FFF1B8", "#E9DDFF"] },
  bright: { name: "Яркий рабочий", bg: "#FFD447", fg: "#1C2340", font: "Unbounded", weight: 600 },
};

const FONTS = ["Onest", "Unbounded", "Comfortaa", "Caveat", "PT Serif"];

const SWATCHES = ["#FFFFFF", "#F3F1E8", "#CDAA7D", "#FFD447", "#FFD9CF", "#CDE8FF", "#D8F2D0", "#E9DDFF", "#2F5BD3", "#2D3331", "#1C2340", "#C8433A"];

// Шаблон наклейки: [текст, вторая строка?, иконка?]
const t = (list, base) => list.map(([text, sub = "", icon = null]) => ({ ...base, text, sub, icon }));

const CATEGORIES = [
  {
    id: "kitchen",
    name: "Кухня и кладовая",
    lead: "Крупы, специи, морозилка, корзины. Всё на своих местах и подписано.",
    photo: "1617510711388-6f88e078d698",
    solutions: [
      {
        id: "pantry", name: "Кладовая", photo: "1617510711388-6f88e078d698",
        text: "Подписи для банок с крупами, мукой и сахаром.",
        style: "minimal", material: "wet", sheet: "A6",
        stickers: t([["Рис", "", "wheat"], ["Гречка", "", "wheat"], ["Овсянка", "", "wheat"], ["Мука", "", "wheat"], ["Сахар", "", "jar"], ["Соль", "", "jar"], ["Макароны", "", "wheat"], ["Чечевица", "", "leaf"]], { shape: "round", w: 40, h: 22 }),
      },
      {
        id: "spices", name: "Специи", photo: "1580116270858-8a0d62b15426",
        text: "Круглые наклейки на крышки и баночки со специями.",
        style: "chalk", material: "wet", sheet: "A6",
        stickers: t([["Паприка"], ["Куркума"], ["Корица"], ["Орегано"], ["Базилик"], ["Перец"], ["Чубрица"], ["Чеснок"], ["Тмин"], ["Кориандр"], ["Лавр"], ["Розмарин"]], { shape: "circle", w: 24, h: 24 }),
      },
      {
        id: "freezer", name: "Морозилка", photo: "1645567454567-901dc409551b",
        text: "Что внутри и с какого числа. Место для даты маркером.",
        style: "minimal", material: "freezer", sheet: "A6",
        stickers: t([["Фарш", "Дата: ______", "snow"], ["Ягоды", "Дата: ______", "snow"], ["Овощи", "Дата: ______", "snow"], ["Суп", "Дата: ______", "snow"], ["Перец", "Дата: ______", "pepper"], ["Хлеб", "Дата: ______", "wheat"]], { shape: "rect", w: 40, h: 24 }),
      },
      {
        id: "baskets", name: "Корзины и полки", photo: "1786398018370-079064d79d84",
        text: "Крупные таблички на корзины и полки кладовой.",
        style: "kraft", material: "standard", sheet: "A5",
        stickers: t([["Снеки"], ["Завтраки"], ["Выпечка"], ["Консервы"], ["Напитки"], ["Чай и кофе", "", "cup"]], { shape: "tag", w: 60, h: 26 }),
      },
    ],
  },
  {
    id: "preserves",
    name: "Зимнина",
    lead: "Лютеница, компоты, варенье. Название и год на каждой банке.",
    photo: "1640348784724-93f7b14d8047",
    solutions: [
      {
        id: "jars", name: "Банки с датой", photo: "1640348784724-93f7b14d8047",
        text: "Название и год, чтобы сначала съедать старые запасы.",
        style: "kraft", material: "wet", sheet: "A6",
        stickers: t([["Лютеница", "2026"], ["Кьопоолу", "2026"], ["Айвар", "2026"], ["Туршия", "2026"], ["Компот", "2026", "apple"], ["Огурцы", "2026", "leaf"]], { shape: "oval", w: 42, h: 26 }),
      },
      {
        id: "lids", name: "На крышки", photo: "1645871306587-bebaa2f1dfc0",
        text: "Круглые наклейки на крышки: видно сверху, когда банки в ящике.",
        style: "kids", material: "wet", sheet: "A6",
        stickers: t([["Вишня", "2026"], ["Абрикос", "2026"], ["Слива", "2026"], ["Инжир", "2026"], ["Клубника", "2026"], ["Айва", "2026"]], { shape: "circle", w: 36, h: 36 }),
      },
      {
        id: "gift", name: "Варенье в подарок", photo: "1576020301507-5d5a00982053",
        text: "Банка из сада выглядит как фирменный подарок.",
        style: "minimal", material: "wet", sheet: "A6",
        stickers: t([["Варенье из инжира", "С любовью, Мария", "heart"], ["Абрикосовый джем", "С любовью, Мария", "heart"], ["Сливовое варенье", "С любовью, Мария", "heart"]], { shape: "banner", w: 80, h: 26 }),
      },
    ],
  },
  {
    id: "school",
    name: "Школа",
    lead: "Тетради, учебники, пеналы. Ничего не теряется и не путается.",
    photo: "1531346878377-a5be20888e57",
    solutions: [
      {
        id: "notebooks", name: "Тетради и учебники", photo: "1531346878377-a5be20888e57",
        text: "Имя, предмет и класс на каждой обложке.",
        style: "minimal", material: "standard", sheet: "A5",
        stickers: t([["Математика", "Мария Петрова, 3 Б", "pencil"], ["Български език", "Мария Петрова, 3 Б", "book"], ["Английский", "Мария Петрова, 3 Б", "book"], ["Природа", "Мария Петрова, 3 Б", "leaf"], ["Рисование", "Мария Петрова, 3 Б", "pencil"], ["Музыка", "Мария Петрова, 3 Б", "star"]], { shape: "round", w: 64, h: 24 }),
      },
      {
        id: "mini", name: "Именные мини", photo: "1615988938302-bd2a5a7023bc",
        text: "Узкие полоски на ручки, линейки и карандаши.",
        style: "kids", material: "wet", sheet: "A6",
        stickers: t(Array.from({ length: 16 }, () => ["Мария П."]), { shape: "round", w: 36, h: 9 }),
      },
    ],
  },
  {
    id: "kids",
    name: "Детская",
    lead: "Картинки для тех, кто ещё не читает. Ребёнок убирает сам.",
    photo: "1758790015863-4f9798bb818f",
    solutions: [
      {
        id: "toys", name: "Где мои игрушки", photo: "1758790015863-4f9798bb818f",
        text: "Большая картинка и подпись на каждый ящик с игрушками.",
        style: "kids", material: "standard", sheet: "A5",
        stickers: t([["Машинки", "", "car"], ["Мячи", "", "ball"], ["Книжки", "", "book"], ["Мягкие", "", "heart"], ["Рисование", "", "pencil"], ["Кубики", "", "box"]], { shape: "round", w: 44, h: 44 }),
      },
      {
        id: "dresser", name: "Комод малыша", photo: "1687946803051-51da173a9f55",
        text: "Носки, футболки, пижамы по своим ящикам.",
        style: "kids", material: "standard", sheet: "A6",
        stickers: t([["Футболки", "", "shirt"], ["Пижамы", "", "moon"], ["Носки", "", "star"], ["Штаны", "", "shirt"], ["Кофты", "", "shirt"]], { shape: "round", w: 40, h: 20 }),
      },
    ],
  },
  {
    id: "workshop",
    name: "Мастерская",
    lead: "Метизы, инструмент, стеллажи. Видно размер и хозяина.",
    photo: "1761074342668-c38fc2e62e67",
    solutions: [
      {
        id: "fasteners", name: "Метизы", photo: "1761074342668-c38fc2e62e67",
        text: "Размер болта, винта и дюбеля на каждой ячейке кассетницы.",
        style: "bright", material: "standard", sheet: "A6",
        stickers: t([["M4×20", "", "bolt"], ["M5×30", "", "bolt"], ["M6×40", "", "bolt"], ["M8×50", "", "bolt"], ["Шурупы 3,5×35", "", "bolt"], ["Дюбели 6 мм", "", "bolt"], ["Гайки M6", "", "bolt"], ["Шайбы M8", "", "bolt"]], { shape: "rect", w: 40, h: 14 }),
      },
      {
        id: "mytools", name: "Мой инструмент", photo: "1599651971621-7c42aaa20cd2",
        text: "Имя и телефон: инструмент возвращается с объекта.",
        style: "bright", material: "outdoor", sheet: "A6",
        stickers: t(Array.from({ length: 8 }, () => ["Иван", "088 123 4567", "wrench"]), { shape: "round", w: 40, h: 16 }),
      },
    ],
  },
  {
    id: "electric",
    name: "Электрика",
    lead: "Щиток, кабели, зарядки. Понятно, что за что отвечает.",
    photo: "1576446470246-499c738d1c8e",
    solutions: [
      {
        id: "panel", name: "Электрощиток", photo: "1576446470246-499c738d1c8e",
        text: "Подписи под автоматы: кухня, бойлер, свет, розетки.",
        style: "minimal", material: "standard", sheet: "A6",
        stickers: t([["Кухня"], ["Бойлер"], ["Свет"], ["Розетки"], ["Кондиционер"], ["Ванная"], ["Спальня"], ["Духовка"], ["Стиральная"], ["Детская"]], { shape: "rect", w: 34, h: 10 }),
      },
      {
        id: "cables", name: "Кабели и зарядки", photo: "1576446470246-499c738d1c8e",
        text: "Флажки на провода: больше не путаем блоки питания.",
        style: "bright", material: "standard", sheet: "A6",
        stickers: t([["Телефон", "", "plug"], ["Ноутбук", "", "plug"], ["Телевизор", "", "plug"], ["Роутер", "", "wifi"], ["Колонка", "", "plug"], ["Лампа", "", "lightning"]], { shape: "banner", w: 40, h: 14 }),
      },
    ],
  },
  {
    id: "home",
    name: "Дом и переезд",
    lead: "Ящики, бытовая химия, коробки при переезде.",
    photo: "1650229068182-6931ccb389c2",
    solutions: [
      {
        id: "drawers", name: "Ящики и мелочи", photo: "1650229068182-6931ccb389c2",
        text: "Порядок в ящике, где лежит всё сразу.",
        style: "minimal", material: "standard", sheet: "A6",
        stickers: t([["Батарейки", "", "lightning"], ["Лампочки", "", "sun"], ["Зарядки", "", "plug"], ["Аптечка", "", "heart"], ["Документы", "", "book"], ["Ключи", "", "key"]], { shape: "rect", w: 40, h: 16 }),
      },
      {
        id: "laundry", name: "Бытовая химия", photo: "1757087824089-bdb33ecc3439",
        text: "Для одинаковых бутылок и дозаторов.",
        style: "minimal", material: "wet", sheet: "A6",
        stickers: t([["Порошок", "", "drop"], ["Кондиционер", "", "drop"], ["Для посуды", "", "drop"], ["Для пола", "", "drop"], ["Пятновыводитель", "", "drop"]], { shape: "round", w: 46, h: 16 }),
      },
      {
        id: "moving", name: "Переезд", photo: "1730154838368-c37b1fdebcf6",
        text: "Комната и номер на каждой коробке.",
        style: "bright", material: "standard", sheet: "A5",
        stickers: t([["Кухня", "Коробка №1, хрупкое", "home"], ["Спальня", "Коробка №2", "home"], ["Детская", "Коробка №3", "home"], ["Ванная", "Коробка №4", "home"], ["Гостиная", "Коробка №5", "home"], ["Книги", "Коробка №6, тяжёлая", "book"]], { shape: "rect", w: 64, h: 30 }),
      },
    ],
  },
  {
    id: "rental",
    name: "Апартаменты",
    lead: "Wi-Fi, правила, номера дверей. Меньше вопросов от гостей.",
    photo: "1665249934445-1de680641f50",
    solutions: [
      {
        id: "wifi", name: "Wi-Fi и правила", photo: "1665249934445-1de680641f50",
        text: "Пароль и важные правила на виду у гостей.",
        style: "minimal", material: "standard", sheet: "A5",
        stickers: t([["Wi-Fi: SeaView_12", "Пароль: varna2026", "wifi"], ["Check-out до 11:00", "Ключ оставьте на столе", "key"], ["Не курить", "No smoking", "home"]], { shape: "round", w: 80, h: 30 }),
      },
      {
        id: "doors", name: "Номера дверей", photo: "1522708323590-d24dbb6b0267",
        text: "Номера апартаментов и указатели на этажах.",
        style: "minimal", material: "outdoor", sheet: "A6",
        stickers: t([["1"], ["2"], ["3"], ["4"], ["5"], ["6"]], { shape: "circle", w: 36, h: 36 }),
      },
    ],
  },
];

// Галерея главной: вперемешку, ведёт в категории
const GALLERY = [
  ["1617510711388-6f88e078d698", "kitchen", "Кладовая"],
  ["1640348784724-93f7b14d8047", "preserves", "Зимнина"],
  ["1531346878377-a5be20888e57", "school", "Тетради"],
  ["1761074342668-c38fc2e62e67", "workshop", "Мастерская"],
  ["1580116270858-8a0d62b15426", "kitchen", "Специи"],
  ["1758790015863-4f9798bb818f", "kids", "Игрушки"],
  ["1576446470246-499c738d1c8e", "electric", "Щиток"],
  ["1786398018370-079064d79d84", "kitchen", "Корзины"],
  ["1650229068182-6931ccb389c2", "home", "Ящики"],
  ["1645871306587-bebaa2f1dfc0", "preserves", "Варенье"],
  ["1665249934445-1de680641f50", "rental", "Апартаменты"],
  ["1730154838368-c37b1fdebcf6", "home", "Переезд"],
];

// Автоподбор картинки по слову в режиме списка
const ICON_WORDS = [
  [/рис|греч|овс|мук|круп|макарон|булгур|пшен|хлеб|ориз|леща/i, "wheat"],
  [/сахар|соль|сол|сода|крахмал/i, "jar"],
  [/чай|кофе|какао/i, "cup"],
  [/перец|паприк|чили|специ|куркум|корица/i, "pepper"],
  [/яблок|компот|варен|джем|фрукт|ягод|вишн|слив|абрикос/i, "apple"],
  [/масл|уксус|соус|вода|порош|мыло|шампун/i, "drop"],
  [/замороз|морозил|лёд|лед/i, "snow"],
  [/зелен|трав|базил|петруш|укроп|огур|чечев|фасол|горох/i, "leaf"],
  [/книг|учебн|документ|тетрад/i, "book"],
  [/болт|винт|шуруп|гайк|шайб|дюбел|метиз/i, "bolt"],
  [/ключ|инструмент/i, "wrench"],
  [/кабел|заряд|провод/i, "plug"],
  [/wi-?fi|роутер|интернет/i, "wifi"],
  [/игруш|мяч/i, "ball"],
  [/машин/i, "car"],
  [/одежд|футбол|кофт|штан|носк/i, "shirt"],
];
