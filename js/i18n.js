// Языки сайта: русский (исходный), болгарский, английский, исландский.
// Ключ словаря — русская строка. Статичные строки переводятся автоматически после отрисовки
// (см. translateTree), строки с переменными — через t("… {x} …", { x }).

const LANGS = [["ru", "RU", "Русский"], ["bg", "BG", "Български"], ["en", "EN", "English"], ["is", "IS", "Íslenska"]];
const LANG_IDX = { bg: 0, en: 1, is: 2 };
const LOCALES = { ru: "ru-RU", bg: "bg-BG", en: "en-IE", is: "is-IS" };

let LANG = (() => {
  try { const v = localStorage.getItem("lepko-lang"); if (LANGS.some(([c]) => c === v)) return v; } catch {}
  return "ru";
})();

// [болгарский, английский, исландский]
const I18N = {
  // ---------- шапка, подвал ----------
  "лепко": ["лепко", "lepko", "lepko"],
  "Каталог": ["Каталог", "Catalogue", "Vörulisti"],
  "Как это работает": ["Как работи", "How it works", "Hvernig þetta virkar"],
  "Своя наклейка": ["Собствен стикер", "Custom sticker", "Eigin límmiði"],
  "Мой набор": ["Моят комплект", "My set", "Mitt sett"],
  "Язык": ["Език", "Language", "Tungumál"],
  "Лепко, на главную": ["Лепко, към началото", "Lepko, home", "Lepko, forsíða"],
  "Основное меню": ["Основно меню", "Main menu", "Aðalvalmynd"],
  "Наклейки для порядка дома. Варна, доставка по всей Болгарии.": ["Стикери за ред у дома. Варна, доставка в цяла България.", "Labels for a tidy home. Varna, delivery across Bulgaria.", "Límmiðar fyrir snyrtilegt heimili. Varna, sending um allt Búlgaríu."],
  "Этикетки для бизнеса": ["Етикети за бизнеса", "Labels for business", "Merkimiðar fyrir fyrirtæki"],
  "Лаборатория": ["Лаборатория", "Lab", "Tilraunastofa"],
  "Прототип. Фото временные, с": ["Прототип. Снимките са временни, от", "Prototype. Temporary photos from", "Frumgerð. Tímabundnar myndir frá"],

  // ---------- главная ----------
  "Порядок начинается с подписи": ["Редът започва с надпис", "Order starts with a label", "Reglan byrjar á merkingu"],
  "Наклейки для банок, тетрадей, ящиков и инструментов. Выберите готовый набор, впишите свои слова. Мы напечатаем, заламинируем и вырежем каждую наклейку по контуру.": [
    "Стикери за буркани, тетрадки, кутии и инструменти. Изберете готов комплект и впишете своите думи. Ние ще отпечатаме, ламинираме и изрежем всеки стикер по контура.",
    "Labels for jars, notebooks, boxes and tools. Pick a ready-made set and type your own words. We print, laminate and cut every sticker to shape.",
    "Límmiðar á krukkur, stílabækur, kassa og verkfæri. Veldu tilbúið sett og skrifaðu þín eigin orð. Við prentum, plöstum og skerum hvern límmiða eftir útlínum."],
  "Выбрать наклейки": ["Избери стикери", "Choose labels", "Velja límmiða"],
  "Сделать свою с нуля": ["Направи свой от нулата", "Make your own from scratch", "Búa til frá grunni"],
  "Заказ от одного листа A6, от 5 €": ["Поръчка от един лист A6, от 5 €", "Order from one A6 sheet, from €5", "Pöntun frá einni A6 örk, frá 5 €"],
  "Подписанные банки в кладовой": ["Надписани буркани в килера", "Labelled jars in a pantry", "Merktar krukkur í búri"],
  "Так выглядит лист A6 с наклейками": ["Така изглежда лист A6 със стикери", "This is what an A6 sheet of labels looks like", "Svona lítur A6 örk með límmiðum út"],
  "Лист A6, 8 наклеек": ["Лист A6, 8 стикера", "A6 sheet, 8 labels", "A6 örk, 8 límmiðar"],
  "Пять наклеек — тоже заказ": ["Пет стикера — също е поръчка", "Five labels is an order too", "Fimm límmiðar eru líka pöntun"],
  "Типографии такие заказы не берут: мало и невыгодно. А нам подходит. Минимальный заказ — один лист A6 за 5 €, на него поместятся все баночки со специями.": [
    "Печатниците не приемат такива поръчки: малко е и не си струва. А на нас ни върши работа. Минималната поръчка е един лист A6 за 5 €, на него се събират всички бурканчета с подправки.",
    "Print shops turn down orders this small. We don't. The minimum is one A6 sheet for €5 — enough for every spice jar you own.",
    "Prentsmiðjur taka ekki svona litlar pantanir. Við gerum það. Lágmarkið er ein A6 örk á 5 € — nóg fyrir allar kryddkrukkurnar."],
  "Как это выглядит дома": ["Как изглежда у дома", "How it looks at home", "Svona lítur þetta út heima"],
  "Что подписываем?": ["Какво ще надписваме?", "What are we labelling?", "Hvað eigum við að merkja?"],
  "Форма, размер, текст и картинка — как хотите. Для тех, кто знает, что нужно.": ["Форма, размер, текст и картинка — както искате. За тези, които знаят какво им трябва.", "Shape, size, text and picture — your way. For those who know what they need.", "Lögun, stærð, texti og mynd — eins og þú vilt. Fyrir þá sem vita hvað þeir þurfa."],
  "Открыть конструктор": ["Отвори конструктора", "Open the editor", "Opna hönnunartólið"],
  "Для мастеров и небольшого бизнеса": ["За майстори и малък бизнес", "For makers and small businesses", "Fyrir handverksfólk og lítil fyrirtæki"],
  "Этикетки для вашего товара": ["Етикети за вашия продукт", "Labels for your products", "Merkimiðar á vörurnar þínar"],
  "Мёд, мыло, свечи, косметика, домашние напитки. Индивидуальный дизайн и тираж от одного листа, с личной работой с каждым клиентом.": [
    "Мед, сапун, свещи, козметика, домашни напитки. Индивидуален дизайн и тираж от един лист, с лична работа с всеки клиент.",
    "Honey, soap, candles, cosmetics, home-made drinks. Individual design and runs from a single sheet, with personal attention to every client.",
    "Hunang, sápa, kerti, snyrtivörur, heimagerðir drykkir. Sérhönnun og upplag frá einni örk, með persónulegri þjónustu við hvern viðskiptavin."],
  "Этикетки на банках мёда": ["Етикети на буркани с мед", "Labels on honey jars", "Merkimiðar á hunangskrukkum"],
  "Подробнее": ["Научете повече", "Learn more", "Nánar"],
  "Выберите набор": ["Изберете комплект", "Pick a set", "Veldu sett"],
  "Кухня, школа, мастерская или своя наклейка с нуля.": ["Кухня, училище, работилница или собствен стикер от нулата.", "Kitchen, school, workshop or your own from scratch.", "Eldhús, skóli, verkstæði eða þinn eigin frá grunni."],
  "Впишите свои слова": ["Впишете своите думи", "Type your words", "Skrifaðu þín orð"],
  "Названия, имена, даты. Лист меняется у вас на глазах.": ["Наименования, имена, дати. Листът се променя пред очите ви.", "Names, labels, dates. The sheet updates as you type.", "Heiti, nöfn, dagsetningar. Örkin breytist fyrir augunum á þér."],
  "Получите по почте": ["Получете по куриер", "Get it delivered", "Fáðu sent"],
  "Печатаем за 1–2 дня и отправляем Econt или Speedy. Лист плоский, приходит в конверте.": ["Печатаме за 1–2 дни и изпращаме с Еконт или Спиди. Листът е плосък и пристига в плик.", "We print in 1–2 days and ship with Econt or Speedy. The sheet is flat and arrives in an envelope.", "Við prentum á 1–2 dögum og sendum með Econt eða Speedy. Örkin er flöt og kemur í umslagi."],
  "Частые вопросы": ["Често задавани въпроси", "FAQ", "Algengar spurningar"],
  "Сколько наклеек поместится на лист?": ["Колко стикера се събират на един лист?", "How many labels fit on a sheet?", "Hversu margir límmiðar komast á eina örk?"],
  "Зависит от размера. Например, на A6 помещается 8 наклеек 40×22 мм или 12 круглых по 24 мм. Конструктор сразу показывает раскладку и считает листы.": [
    "Зависи от размера. Например, на A6 се събират 8 стикера 40×22 мм или 12 кръгли по 24 мм. Конструкторът веднага показва подредбата и брои листовете.",
    "It depends on size. An A6 sheet fits, for example, 8 labels of 40×22 mm or 12 round ones of 24 mm. The editor shows the layout and counts sheets instantly.",
    "Það fer eftir stærð. Á A6 örk komast t.d. 8 límmiðar 40×22 mm eða 12 kringlóttir 24 mm. Hönnunartólið sýnir uppröðunina og telur arkirnar strax."],
  "Наклейки выдержат мытьё?": ["Издържат ли стикерите на миене?", "Can the labels be washed?", "Þola límmiðarnir þvott?"],
  "Наклейки печатаются на виниловой плёнке и покрываются ламинатом, поэтому не боятся воды и протирания. Банки и контейнеры с ними можно мыть руками.": [
    "Стикерите се печатат на винилово фолио и се покриват с ламинат, затова не се боят от вода и бърсане. Бурканите и кутиите с тях могат да се мият на ръка.",
    "Labels are printed on vinyl film and laminated, so water and wiping won't hurt them. Jars and containers with them can be hand-washed.",
    "Límmiðarnir eru prentaðir á vínylfilmu og plastaðir, svo vatn og þurrkun skaðar þá ekki. Krukkur og box með þeim má handþvo."],
  "Можно заказать совсем немного?": ["Може ли да поръчам съвсем малко?", "Can I order just a few?", "Get ég pantað bara örfáa?"],
  "Да. Минимальный заказ — один лист A6. Оставшееся место можно заполнить копиями, это бесплатно.": ["Да. Минималната поръчка е един лист A6. Останалото място може да запълните с копия безплатно.", "Yes. The minimum is one A6 sheet. You can fill the remaining space with copies for free.", "Já. Lágmarkið er ein A6 örk. Afganginn af plássinu má fylla með afritum án aukagjalds."],
  "Как оплатить и получить?": ["Как да платя и получа?", "How do I pay and receive it?", "Hvernig greiði ég og fæ sent?"],
  "Картой на сайте или наложенным платежом. Доставка Econt или Speedy до офиса или курьером до двери.": ["С карта на сайта или с наложен платеж. Доставка с Еконт или Спиди до офис или с куриер до адрес.", "By card on the site or cash on delivery. Delivery with Econt or Speedy to an office or to your door.", "Með korti á vefnum eða við afhendingu. Sending með Econt eða Speedy á afgreiðslustað eða heim að dyrum."],

  // ---------- категория, мастер ----------
  "Путь": ["Път", "Breadcrumbs", "Slóð"],
  "Выбрать": ["Избери", "Choose", "Velja"],
  "Назад": ["Назад", "Back", "Til baka"],
  "Дальше": ["Напред", "Next", "Áfram"],
  "Шаги": ["Стъпки", "Steps", "Skref"],
  "Стиль": ["Стил", "Style", "Stíll"],
  "Свои слова": ["Своите думи", "Your words", "Þín orð"],
  "Какой стиль вам нравится?": ["Кой стил ви харесва?", "Which style do you like?", "Hvaða stíll heillar þig?"],
  "Перейти к своим словам": ["Към своите думи", "Go to your words", "Áfram í þín orð"],
  "Набор «{name}». Всё можно поменять позже в конструкторе.": ["Комплект „{name}“. Всичко може да промените по-късно в конструктора.", "Set “{name}”. You can change everything later in the editor.", "Sett „{name}“. Öllu má breyta seinna í hönnunartólinu."],
  "{n} в наборе": ["{n} в комплекта", "{n} in the set", "{n} í settinu"],

  // ---------- конструктор ----------
  "Конструктор": ["Конструктор", "Editor", "Hönnunartól"],
  "Работа {i} из {n} в наборе": ["Работа {i} от {n} в комплекта", "Item {i} of {n} in the set", "Verk {i} af {n} í settinu"],
  "Название работы": ["Име на работата", "Item name", "Heiti verks"],
  "Добавить ещё работу": ["Добави още работа", "Add another item", "Bæta við verki"],
  "Превью листа": ["Преглед на листа", "Sheet preview", "Forskoðun arkar"],
  "Размер листа": ["Размер на листа", "Sheet size", "Arkarstærð"],
  "Раскладка": ["Подредба", "Layout", "Uppröðun"],
  "Оптимизация раскладки": ["Оптимизация на подредбата", "Layout optimisation", "Bestun uppröðunar"],
  "По порядку списка": ["По реда в списъка", "In list order", "Í röð listans"],
  "Удобно: одинаковые наклейки рядом, ровными рядами": ["Удобно: еднаквите стикери един до друг, в равни редове", "Tidy: matching labels together, in neat rows", "Snyrtilegt: eins límmiðar saman, í beinum röðum"],
  "Максимально плотно: мозаика, наклейки можно поворачивать": ["Максимално плътно: мозайка, стикерите може да се завъртат", "Tightest: mosaic, labels may be rotated", "Þéttast: mósaík, má snúa límmiðum"],
  "При 100% — {a} вместо {b}": ["При 100% — {a} вместо {b}", "At 100% — {a} instead of {b}", "Á 100% — {a} í stað {b}"],
  "{n} больше листа {sheet}. Уменьшите размер или выберите лист побольше.": ["{n} са по-големи от лист {sheet}. Намалете размера или изберете по-голям лист.", "{n} larger than an {sheet} sheet. Reduce the size or choose a bigger sheet.", "{n} stærri en {sheet} örk. Minnkaðu stærðina eða veldu stærri örk."],
  "Лист {i} из {n}, {sheet}": ["Лист {i} от {n}, {sheet}", "Sheet {i} of {n}, {sheet}", "Örk {i} af {n}, {sheet}"],
  "Нажмите на наклейку, чтобы изменить её. Пунктир — линия реза.": ["Натиснете стикер, за да го промените. Пунктирът е линията на рязане.", "Tap a label to edit it. The dashed line is the cut line.", "Ýttu á límmiða til að breyta honum. Punktalínan er skurðarlínan."],
  "Настройки": ["Настройки", "Settings", "Stillingar"],
  "Наклейки на листе": ["Стикери на листа", "Labels on the sheet", "Límmiðar á örkinni"],
  "Добавить наклейку": ["Добави стикер", "Add label", "Bæta við límmiða"],
  "Заполнить лист копиями": ["Запълни листа с копия", "Fill the sheet with copies", "Fylla örkina með afritum"],
  "Добавить списком": ["Добави със списък", "Add as a list", "Bæta við sem lista"],
  "Одна строка — одна наклейка. Картинка подберётся сама, если узнаем слово.": ["Един ред — един стикер. Картинката се избира сама, ако разпознаем думата.", "One line, one label. A picture is picked automatically if we recognise the word.", "Ein lína, einn límmiði. Mynd er valin sjálfkrafa ef við þekkjum orðið."],
  "Булгур\nКиноа\nНут": ["Булгур\nКиноа\nНахут", "Bulgur\nQuinoa\nChickpeas", "Búlgur\nKínóa\nKjúklingabaunir"],
  "Добавить": ["Добави", "Add", "Bæta við"],
  "Готово, в набор": ["Готово, в комплекта", "Done, add to set", "Klárt, í settið"],
  "Масштаб": ["Мащаб", "Actual size", "Raunstærð"],
  "Натуральная величина с линейками": ["Реален размер с линийки", "Actual size with rulers", "Raunstærð með reglustikum"],
  "Закрыть редактирование": ["Затвори редакцията", "Close editing", "Loka breytingum"],
  "Готово, закрыть": ["Готово, затвори", "Done, close", "Klárt, loka"],
  "Предыдущая наклейка": ["Предишен стикер", "Previous label", "Fyrri límmiði"],
  "Следующая наклейка": ["Следващ стикер", "Next label", "Næsti límmiði"],
  "Листайте влево и вправо, чтобы перейти к другой наклейке": ["Плъзнете наляво или надясно, за да минете към друг стикер", "Swipe left or right to switch labels", "Strjúktu til vinstri eða hægri til að skipta um límmiða"],
  "Без текста": ["Без текст", "No text", "Enginn texti"],
  "{i} из {n}": ["{i} от {n}", "{i} of {n}", "{i} af {n}"],
  "текст {v} мм": ["текст {v} мм", "text {v} mm", "texti {v} mm"],
  "{n} шт.": ["{n} бр.", "{n} pcs", "{n} stk."],
  "{v} мм · {pt} pt": ["{v} мм · {pt} pt", "{v} mm · {pt} pt", "{v} mm · {pt} pt"],
  "мм": ["мм", "mm", "mm"],
  "Нажмите на наклейку на листе или в списке, чтобы изменить её.": ["Натиснете стикер на листа или в списъка, за да го промените.", "Tap a label on the sheet or in the list to edit it.", "Ýttu á límmiða á örkinni eða í listanum til að breyta honum."],
  "Выбрать наклейку": ["Избери стикер", "Select label", "Velja límmiða"],
  "Текст наклейки": ["Текст на стикера", "Label text", "Texti límmiða"],
  "Удалить наклейку": ["Изтрий стикера", "Delete label", "Eyða límmiða"],
  "Удалить": ["Изтрий", "Delete", "Eyða"],
  "Количество": ["Количество", "Quantity", "Fjöldi"],
  "Уменьшить количество": ["Намали количеството", "Decrease quantity", "Fækka"],
  "Увеличить количество": ["Увеличи количеството", "Increase quantity", "Fjölga"],
  "Количество, шт.": ["Количество, бр.", "Quantity, pcs", "Fjöldi, stk."],
  "Текст": ["Текст", "Text", "Texti"],
  "Вторая строка": ["Втори ред", "Second line", "Önnur lína"],
  "необязательно": ["по желание", "optional", "valfrjálst"],
  "Дата, имя, класс": ["Дата, име, клас", "Date, name, class", "Dagsetning, nafn, bekkur"],
  "Сколько штук": ["Колко броя", "How many", "Hversu mörg"],
  "Заполнить лист до конца": ["Запълни листа докрай", "Fill the rest of the sheet", "Fylla örkina"],
  "Размер текста": ["Размер на текста", "Text size", "Leturstærð"],
  "Авто": ["Авто", "Auto", "Sjálfvirkt"],
  "нет текста": ["няма текст", "no text", "enginn texti"],
  "мельче": ["по-малко", "smaller", "minna"],
  "крупнее": ["по-голямо", "larger", "stærra"],
  "Форма": ["Форма", "Shape", "Lögun"],
  "Прямоугольник": ["Правоъгълник", "Rectangle", "Ferhyrningur"],
  "Скруглённая": ["Заоблен", "Rounded", "Ávöl"],
  "Круг": ["Кръг", "Circle", "Hringur"],
  "Овал": ["Овал", "Oval", "Sporöskja"],
  "Бирка": ["Етикет", "Tag", "Merkispjald"],
  "Флажок": ["Флагче", "Flag", "Fáni"],
  "Размер, мм": ["Размер, мм", "Size, mm", "Stærð, mm"],
  "Ширина": ["Ширина", "Width", "Breidd"],
  "Высота": ["Височина", "Height", "Hæð"],
  "Картинка": ["Картинка", "Picture", "Mynd"],
  "нет": ["няма", "none", "engin"],
  "Без картинки": ["Без картинка", "No picture", "Engin mynd"],
  "Фон": ["Фон", "Background", "Bakgrunnur"],
  "Цвет текста": ["Цвят на текста", "Text colour", "Litur texta"],
  "Шрифт": ["Шрифт", "Font", "Letur"],
  "Наклейка": ["Стикер", "Label", "Límmiði"],
  "Наклейка «{t}»": ["Стикер „{t}“", "Label “{t}”", "Límmiði „{t}“"],
  "Применить форму, размер и цвета ко всем": ["Приложи формата, размера и цветовете към всички", "Apply shape, size and colours to all", "Nota lögun, stærð og liti á alla"],
  "Весь набор: {sum}, {n}": ["Целият комплект: {sum}, {n}", "Whole set: {sum}, {n}", "Allt settið: {sum}, {n}"],
  "Моя наклейка": ["Моят стикер", "My label", "Minn límmiði"],
  "Новая": ["Нов", "New", "Nýr"],
  "Работа": ["Работа", "Item", "Verk"],

  // ---------- натуральная величина ----------
  "Натуральная величина": ["Реален размер", "Actual size", "Raunstærð"],
  "{w} × {h} мм": ["{w} × {h} мм", "{w} × {h} mm", "{w} × {h} mm"],
  ", увеличено в 2 раза": [", увеличено 2 пъти", ", zoomed ×2", ", stækkað ×2"],
  "Закрыть": ["Затвори", "Close", "Loka"],
  "Вернуть натуральный размер": ["Върни реалния размер", "Back to actual size", "Aftur í raunstærð"],
  "Увеличить в 2 раза": ["Увеличи 2 пъти", "Zoom ×2", "Stækka ×2"],
  "Масштаб настроен под ваш экран": ["Мащабът е настроен за вашия екран", "Scale calibrated for your screen", "Kvarði stilltur fyrir skjáinn þinn"],
  "Масштаб примерный. Настроить точно": ["Мащабът е приблизителен. Настройте точно", "Scale is approximate. Calibrate", "Kvarðinn er áætlaður. Stilla nákvæmlega"],
  "Сайт не знает физический размер вашего экрана. Укажите диагональ или подгоните прямоугольник под банковскую карту, и линейки станут точными.": [
    "Сайтът не знае физическия размер на екрана ви. Въведете диагонала или нагласете правоъгълника по банкова карта и линийките ще станат точни.",
    "The site doesn't know your screen's physical size. Enter the diagonal or match the frame to a bank card, and the rulers become accurate.",
    "Vefurinn veit ekki raunstærð skjásins. Sláðu inn skálínuna eða stilltu rammann eftir greiðslukorti og reglustikurnar verða nákvæmar."],
  "Диагональ экрана, дюймы": ["Диагонал на екрана, инча", "Screen diagonal, inches", "Skálína skjás, tommur"],
  "например, 6.1": ["например 6.1", "e.g. 6.1", "t.d. 6.1"],
  "Применить": ["Приложи", "Apply", "Nota"],
  "или приложите банковскую карту к экрану и подгоните рамку под её размер": ["или поставете банкова карта до екрана и нагласете рамката по нея", "or hold a bank card to the screen and match the frame to it", "eða leggðu greiðslukort að skjánum og stilltu rammann eftir því"],
  "Уменьшить рамку": ["Намали рамката", "Shrink frame", "Minnka ramma"],
  "Размер рамки": ["Размер на рамката", "Frame size", "Stærð ramma"],
  "Увеличить рамку": ["Увеличи рамката", "Enlarge frame", "Stækka ramma"],
  "Сбросить настройку масштаба": ["Нулирай настройката на мащаба", "Reset scale calibration", "Endurstilla kvarða"],
  "85,6 × 54 мм": ["85,6 × 54 мм", "85.6 × 54 mm", "85,6 × 54 mm"],
  "54 × 85,6 мм": ["54 × 85,6 мм", "54 × 85.6 mm", "54 × 85,6 mm"],
  "Введите диагональ от 4 до 40 дюймов": ["Въведете диагонал от 4 до 40 инча", "Enter a diagonal from 4 to 40 inches", "Sláðu inn skálínu frá 4 til 40 tommum"],
  "Масштаб настроен": ["Мащабът е настроен", "Scale calibrated", "Kvarði stilltur"],
  "Масштаб снова примерный": ["Мащабът отново е приблизителен", "Scale is approximate again", "Kvarðinn er aftur áætlaður"],

  // ---------- уведомления ----------
  "Это последняя наклейка. Удалить всю работу можно в «Мой набор»": ["Това е последният стикер. Цялата работа може да изтриете в „Моят комплект“", "This is the last label. You can delete the whole item in “My set”", "Þetta er síðasti límmiðinn. Hægt er að eyða öllu verkinu í „Mitt sett“"],
  "На последнем листе нет места для этой наклейки": ["На последния лист няма място за този стикер", "No room for this label on the last sheet", "Ekki pláss fyrir þennan límmiða á síðustu örkinni"],
  "«{t}»: +{k} шт., теперь {q}": ["„{t}“: +{k} бр., вече {q}", "“{t}”: +{k} pcs, now {q}", "„{t}“: +{k} stk., nú {q}"],
  "Впишите хотя бы одну строку": ["Впишете поне един ред", "Type at least one line", "Skrifaðu að minnsta kosti eina línu"],
  "Добавлено: {n}": ["Добавени: {n}", "Added: {n}", "Bætt við: {n}"],
  "Готово: все наклейки одинаковые по форме и цвету": ["Готово: всички стикери са еднакви по форма и цвят", "Done: all labels share shape and colours", "Klárt: allir límmiðar eru eins í lögun og lit"],
  "«{name}» удалена": ["„{name}“ е изтрита", "“{name}” deleted", "„{name}“ eytt"],
  "Копия добавлена": ["Копието е добавено", "Copy added", "Afrit bætt við"],
  "(копия)": ["(копие)", "(copy)", "(afrit)"],

  // ---------- мой набор, оформление ----------
  "Все ваши работы хранятся здесь, в этом браузере. Добавляйте новые и оформляйте одним заказом.": ["Всички ваши работи се пазят тук, в този браузър. Добавяйте нови и поръчайте всичко наведнъж.", "All your items are saved here, in this browser. Add more and check out in one order.", "Öll verkin þín eru vistuð hér, í þessum vafra. Bættu við fleirum og pantaðu allt í einu."],
  "Пока пусто. Выберите готовый набор в каталоге или сделайте свою наклейку.": ["Засега е празно. Изберете готов комплект от каталога или направете собствен стикер.", "Nothing here yet. Pick a set from the catalogue or make your own label.", "Ekkert hér enn. Veldu sett úr vörulistanum eða búðu til þinn eigin límmiða."],
  "Открыть «{name}»": ["Отвори „{name}“", "Open “{name}”", "Opna „{name}“"],
  "Изменить": ["Промени", "Edit", "Breyta"],
  "Копия": ["Копие", "Copy", "Afrit"],
  "Точно удалить?": ["Сигурни ли сте?", "Delete for sure?", "Örugglega eyða?"],
  "Добавить работу": ["Добави работа", "Add item", "Bæta við verki"],
  "Наклейки на банки, Wi-Fi, щиток или что-то своё": ["Стикери за буркани, Wi-Fi, табло или нещо свое", "Jar labels, Wi-Fi, fuse box or something else", "Krukkumiðar, Wi-Fi, rafmagnstafla eða eitthvað annað"],
  "Своя наклейка с нуля": ["Собствен стикер от нулата", "Custom label from scratch", "Eigin límmiði frá grunni"],
  "Форма, размер и текст — как хотите": ["Форма, размер и текст — както искате", "Shape, size and text — your way", "Lögun, stærð og texti — eins og þú vilt"],
  "Оформить заказ": ["Поръчай", "Check out", "Ganga frá pöntun"],
  "Оформление": ["Поръчка", "Checkout", "Pöntun"],
  "Оформление заказа": ["Завършване на поръчката", "Checkout", "Ganga frá pöntun"],
  "Ваш заказ": ["Вашата поръчка", "Your order", "Pöntunin þín"],
  "Итого": ["Общо", "Total", "Samtals"],
  "Вернуться к набору": ["Обратно към комплекта", "Back to the set", "Aftur í settið"],
  "Имя и фамилия": ["Име и фамилия", "Full name", "Fullt nafn"],
  "Телефон": ["Телефон", "Phone", "Sími"],
  "Доставка": ["Доставка", "Delivery", "Sending"],
  "Econt, до офиса": ["Еконт, до офис", "Econt, to an office", "Econt, á afgreiðslustað"],
  "Speedy, до офиса": ["Спиди, до офис", "Speedy, to an office", "Speedy, á afgreiðslustað"],
  "Курьер до двери": ["Куриер до адрес", "Courier to your door", "Heim að dyrum"],
  "Город и офис или адрес": ["Град и офис или адрес", "City and office or address", "Bær og afgreiðslustaður eða heimilisfang"],
  "Оплата": ["Плащане", "Payment", "Greiðsla"],
  "Наложенным платежом при получении": ["Наложен платеж при получаване", "Cash on delivery", "Greitt við afhendingu"],
  "Картой на сайте": ["С карта на сайта", "By card on the site", "Með korti á vefnum"],
  "Отправить заказ на {sum}": ["Изпрати поръчка за {sum}", "Place order for {sum}", "Senda pöntun upp á {sum}"],
  "Это прототип: заказ никуда не отправлен, данные не сохраняются. Здесь будет оплата и приём заказа.": ["Това е прототип: поръчката не е изпратена и данните не се пазят. Тук ще има плащане и приемане на поръчката.", "This is a prototype: the order was not sent and nothing is stored. Payment and order intake will go here.", "Þetta er frumgerð: pöntunin var ekki send og ekkert er vistað. Hér kemur greiðsla og móttaka pöntunar."],
  "Такой страницы нет": ["Такава страница няма", "Page not found", "Síðan fannst ekki"],
  "Возможно, ссылка устарела.": ["Възможно е връзката да е остаряла.", "The link may be out of date.", "Tengillinn gæti verið úreltur."],
  "Открыть каталог": ["Отвори каталога", "Open the catalogue", "Opna vörulistann"],

  // ---------- этикетки для бизнеса ----------
  "Нарисуем этикетку под ваш мёд, мыло, свечи или косметику и напечатаем столько, сколько нужно сейчас. Без миллионных тиражей типографии и без шаблонов из интернета.": [
    "Ще нарисуваме етикет за вашия мед, сапун, свещи или козметика и ще отпечатаме толкова, колкото ви трябва сега. Без милионни тиражи на печатница и без шаблони от интернет.",
    "We design a label for your honey, soap, candles or cosmetics and print exactly as many as you need now. No million-copy print runs, no internet templates.",
    "Við hönnum merkimiða fyrir hunangið, sápuna, kertin eða snyrtivörurnar þínar og prentum nákvæmlega það magn sem þú þarft núna. Engin milljónaupplög og engin sniðmát af netinu."],
  "Прозрачная этикетка на банке мёда": ["Прозрачен етикет на буркан с мед", "Clear label on a honey jar", "Glær merkimiði á hunangskrukku"],
  "Обсудить этикетку": ["Да обсъдим етикета", "Discuss your label", "Ræðum merkimiðann"],
  "Дизайн под вас": ["Дизайн за вас", "Design made for you", "Hönnun fyrir þig"],
  "Работаем лично с вами: логотип, цвета, шрифты, обязательная информация о товаре. Показываем макет и правим, пока не понравится.": ["Работим лично с вас: лого, цветове, шрифтове, задължителна информация за продукта. Показваме макета и го коригираме, докато ви хареса.", "We work with you personally: logo, colours, fonts, mandatory product information. We show you the design and revise it until you love it.", "Við vinnum persónulega með þér: lógó, litir, letur, skyldubundnar vöruupplýsingar. Við sýnum hönnunina og lagfærum þar til þú ert ánægð(ur)."],
  "Малые тиражи": ["Малки тиражи", "Small runs", "Lítil upplög"],
  "Можно начать с одного листа и допечатывать партиями по мере продаж. Повторный тираж по готовому макету — только печать.": ["Може да започнете с един лист и да допечатвате на партиди според продажбите. Повторен тираж по готов макет — само печат.", "Start with a single sheet and reprint in batches as you sell. A reprint from an existing design is print cost only.", "Byrjaðu á einni örk og endurprentaðu í lotum eftir sölu. Endurprentun af tilbúinni hönnun kostar aðeins prentun."],
  "Любая форма": ["Всякаква форма", "Any shape", "Hvaða lögun sem er"],
  "Круг, овал, лента, фигурная этикетка по контуру логотипа. Плёнка с ламинатом не боится воды и рук.": ["Кръг, овал, лента, фигурен етикет по контура на логото. Фолиото с ламинат не се бои от вода и ръце.", "Circle, oval, band, or a shape following your logo's outline. Laminated film stands up to water and handling.", "Hringur, sporöskja, borði eða lögun eftir útlínum lógósins. Plöstuð filma þolir vatn og meðhöndlun."],
  "Что делаем": ["Какво правим", "What we make", "Hvað við gerum"],
  "Мёд и варенье": ["Мед и сладко", "Honey and jam", "Hunang og sulta"],
  "Этикетка с логотипом пасеки, сортом мёда и контактами. Круглая наклейка на крышку в пару.": ["Етикет с логото на пчелина, вида мед и контакти. Кръгъл стикер за капачката в комплект.", "A label with the apiary logo, honey type and contacts. A matching round sticker for the lid.", "Merkimiði með lógói býlisins, hunangstegund og tengiliðum. Samstæður kringlóttur miði á lokið."],
  "Мыло ручной работы": ["Ръчно направен сапун", "Handmade soap", "Handgerð sápa"],
  "Узкая лента вокруг бруска или наклейка на крафт-упаковку: название, состав, вес.": ["Тясна лента около сапуна или стикер върху крафт опаковка: име, състав, тегло.", "A narrow band around the bar or a sticker on kraft packaging: name, ingredients, weight.", "Mjór borði utan um stykkið eða miði á kraftumbúðir: heiti, innihald, þyngd."],
  "Свечи": ["Свещи", "Candles", "Kerti"],
  "Аромат, время горения и предупреждения. На стекло, металл и картонную коробку.": ["Аромат, време на горене и предупреждения. За стъкло, метал и картонена кутия.", "Scent, burn time and warnings. On glass, metal or a cardboard box.", "Ilmur, brennslutími og viðvaranir. Á gler, málm eða pappakassa."],
  "Косметика": ["Козметика", "Cosmetics", "Snyrtivörur"],
  "Флаконы и баночки: название, объём, состав, срок годности и партия.": ["Флакони и бурканчета: име, обем, състав, срок на годност и партида.", "Bottles and jars: name, volume, ingredients, expiry date and batch.", "Flöskur og krukkur: heiti, rúmmál, innihald, best fyrir og lota."],
  "Крафтовые напитки": ["Занаятчийски напитки", "Craft drinks", "Handverksdrykkir"],
  "Бутылки домашнего вина, ракии, сидра, лимонада. Серия этикеток в одном стиле.": ["Бутилки домашно вино, ракия, сайдер, лимонада. Серия етикети в един стил.", "Bottles of home-made wine, rakia, cider or lemonade. A series of labels in one style.", "Flöskur af heimagerðu víni, rakíu, eplasíder eða límonaði. Röð merkimiða í sama stíl."],
  "Упаковка и подарки": ["Опаковки и подаръци", "Packaging and gifts", "Umbúðir og gjafir"],
  "Наклейки-пломбы, «спасибо за покупку», логотип на пакеты и коробки.": ["Стикери-пломби, „благодарим за покупката“, лого за пликове и кутии.", "Seal stickers, “thank you for your order”, a logo for bags and boxes.", "Innsiglismiðar, „takk fyrir kaupin“, lógó á poka og kassa."],
  "Как работаем": ["Как работим", "How we work", "Hvernig við vinnum"],
  "Заявка": ["Запитване", "Request", "Fyrirspurn"],
  "Оставьте контакт и пару слов о товаре.": ["Оставете контакт и няколко думи за продукта.", "Leave a contact and a few words about your product.", "Skildu eftir tengilið og nokkur orð um vöruna."],
  "Разговор": ["Разговор", "Conversation", "Samtal"],
  "Обсуждаем размер, количество, стиль и что должно быть на этикетке.": ["Обсъждаме размера, количеството, стила и какво трябва да има на етикета.", "We agree on size, quantity, style and what goes on the label.", "Við ræðum stærð, magn, stíl og hvað á að vera á miðanum."],
  "Макет": ["Макет", "Design", "Hönnun"],
  "Готовим варианты дизайна и вносим правки.": ["Подготвяме варианти на дизайна и нанасяме корекции.", "We prepare design options and make revisions.", "Við gerum hönnunartillögur og lagfærum."],
  "Пробный лист": ["Пробен лист", "Proof sheet", "Prufuörk"],
  "При желании печатаем пробу, чтобы примерить на свою упаковку.": ["При желание печатаме проба, за да я пробвате на опаковката си.", "If you like, we print a proof to try on your packaging.", "Ef þú vilt prentum við prufu til að máta á umbúðirnar."],
  "Тираж": ["Тираж", "Print run", "Upplag"],
  "Печатаем, режем по контуру и отправляем Econt или Speedy.": ["Печатаме, изрязваме по контура и изпращаме с Еконт или Спиди.", "We print, cut to shape and ship with Econt or Speedy.", "Við prentum, skerum eftir útlínum og sendum með Econt eða Speedy."],
  "Стоимость считаем после разговора: дизайн оплачивается один раз, дальше платите только за печать.": ["Цената изчисляваме след разговора: дизайнът се плаща веднъж, после плащате само за печат.", "We quote after our conversation: design is paid once, after that you pay for printing only.", "Við gefum verð eftir samtalið: hönnun er greidd einu sinni, síðan greiðir þú aðeins fyrir prentun."],
  "Расскажите о своём товаре": ["Разкажете за своя продукт", "Tell us about your product", "Segðu okkur frá vörunni þinni"],
  "Свяжемся с вами в течение рабочего дня, удобным для вас способом.": ["Ще се свържем с вас до един работен ден, по удобен за вас начин.", "We'll get back to you within one working day, the way you prefer.", "Við höfum samband innan eins virks dags, eins og þér hentar."],
  "Как к вам обращаться": ["Как да се обръщаме към вас", "Your name", "Nafn"],
  "Как с вами связаться": ["Как да се свържем с вас", "How to reach you", "Hvernig náum við í þig"],
  "телефон, Viber, Telegram или e-mail": ["телефон, Viber, Telegram или имейл", "phone, Viber, Telegram or e-mail", "sími, Viber, Telegram eða netfang"],
  "+359 … или @ник": ["+359 … или @ник", "+359 … or @handle", "+359 … eða @notandi"],
  "Что за товар": ["Какъв е продуктът", "What's the product", "Hver er varan"],
  "Например, мёд в банках 250 и 500 г": ["Например мед в буркани 250 и 500 г", "For example, honey in 250 and 500 g jars", "Til dæmis hunang í 250 og 500 g krukkum"],
  "Сколько этикеток нужно на первый раз": ["Колко етикета трябват за начало", "How many labels to start with", "Hversu marga miða í fyrstu"],
  "до 50": ["до 50", "up to 50", "allt að 50"],
  "больше 500": ["над 500", "over 500", "yfir 500"],
  "пока не знаю": ["още не знам", "not sure yet", "veit ekki enn"],
  "Идея, пожелания, ссылки на примеры": ["Идея, пожелания, връзки към примери", "Idea, wishes, links to examples", "Hugmynd, óskir, tenglar á dæmi"],
  "Какой стиль нравится, есть ли логотип, что обязательно должно быть на этикетке": ["Какъв стил харесвате, имате ли лого, какво задължително трябва да има на етикета", "Which style you like, whether you have a logo, what must be on the label", "Hvaða stíll heillar, hvort þú átt lógó, hvað verður að vera á miðanum"],
  "Отправить заявку": ["Изпрати запитване", "Send request", "Senda fyrirspurn"],
  "Заполните имя и контакт, чтобы мы могли с вами связаться.": ["Попълнете име и контакт, за да можем да се свържем с вас.", "Fill in your name and contact so we can reach you.", "Fylltu út nafn og tengilið svo við getum haft samband."],
  "Это прототип: заявка пока никуда не отправляется. Здесь она будет приходить вам на почту или в Telegram.": ["Това е прототип: запитването засега не се изпраща. Тук то ще пристига по имейл или в Telegram.", "This is a prototype: the request isn't sent anywhere yet. It will arrive by e-mail or Telegram here.", "Þetta er frumgerð: fyrirspurnin er ekki send enn. Hún mun berast í tölvupósti eða á Telegram."],

  // ---------- данные: листы, материал, стили, шрифты ----------
  "как открытка": ["като картичка", "postcard size", "eins og póstkort"],
  "половина тетрадного листа": ["половин лист от тетрадка", "half a notebook page", "hálf stílabókarsíða"],
  "как лист бумаги": ["като лист хартия", "letter-paper size", "eins og blað"],
  "Плёнка с ламинатом": ["Фолио с ламинат", "Laminated film", "Plöstuð filma"],
  "Минимализм": ["Минимализъм", "Minimal", "Einfalt"],
  "Крафт": ["Крафт", "Kraft", "Kraftpappír"],
  "Меловая доска": ["Черна дъска", "Chalkboard", "Krítartafla"],
  "Детский": ["Детски", "Kids", "Barna"],
  "Яркий рабочий": ["Ярък работен", "Bold workshop", "Skært verkstæði"],
  "Простой": ["Обикновен", "Simple", "Einfalt"],
  "Чёткий": ["Ясен", "Crisp", "Skýrt"],
  "Мягкий": ["Мек", "Soft", "Mjúkt"],
  "Широкий": ["Широк", "Wide", "Breitt"],
  "Технический": ["Технически", "Technical", "Tæknilegt"],
  "Круглый": ["Кръгъл", "Rounded", "Ávalt"],
  "Книжный": ["Книжен", "Bookish", "Bókaletur"],
  "Брусковый": ["Слаб", "Slab", "Hellu"],
  "Вывеска": ["Табела", "Signboard", "Skilti"],
  "Рукописный": ["Ръкописен", "Handwritten", "Handskrift"],
  "От руки": ["На ръка", "Hand-drawn", "Fríhendis"],
  "Каллиграфия": ["Калиграфия", "Calligraphy", "Skrautskrift"],

  // пиктограммы
  "Банка": ["Буркан", "Jar", "Krukka"], "Колос": ["Клас", "Wheat", "Korn"], "Капля": ["Капка", "Drop", "Dropi"],
  "Снежинка": ["Снежинка", "Snowflake", "Snjókorn"], "Лист": ["Листо", "Leaf", "Lauf"], "Яблоко": ["Ябълка", "Apple", "Epli"],
  "Чашка": ["Чаша", "Cup", "Bolli"], "Звезда": ["Звезда", "Star", "Stjarna"], "Сердце": ["Сърце", "Heart", "Hjarta"],
  "Книга": ["Книга", "Book", "Bók"], "Карандаш": ["Молив", "Pencil", "Blýantur"], "Ключ гаечный": ["Гаечен ключ", "Spanner", "Skiptilykill"],
  "Болт": ["Болт", "Bolt", "Bolti"], "Молния": ["Мълния", "Lightning", "Elding"], "Вилка": ["Щепсел", "Plug", "Kló"],
  "Дом": ["Къща", "House", "Hús"], "Коробка": ["Кутия", "Box", "Kassi"], "Одежда": ["Дрехи", "Clothes", "Föt"],
  "Мяч": ["Топка", "Ball", "Bolti"], "Машинка": ["Колички", "Toy car", "Bíll"], "Солнце": ["Слънце", "Sun", "Sól"],
  "Луна": ["Луна", "Moon", "Tungl"], "Ключ": ["Ключ", "Key", "Lykill"],

  // ---------- каталог ----------
  "Кухня и кладовая": ["Кухня и килер", "Kitchen and pantry", "Eldhús og búr"],
  "Крупы, специи, морозилка, корзины. Всё на своих местах и подписано.": ["Зърнени храни, подправки, фризер, кошници. Всичко е на мястото си и надписано.", "Grains, spices, freezer, baskets. Everything in its place and labelled.", "Korn, krydd, frystir, körfur. Allt á sínum stað og merkt."],
  "Кладовая": ["Килер", "Pantry", "Búr"],
  "Подписи для банок с крупами, мукой и сахаром.": ["Надписи за буркани с ориз, брашно и захар.", "Labels for jars of grains, flour and sugar.", "Miðar á krukkur með korni, hveiti og sykri."],
  "Специи": ["Подправки", "Spices", "Krydd"],
  "Круглые наклейки на крышки и баночки со специями.": ["Кръгли стикери за капачки и бурканчета с подправки.", "Round labels for spice jars and lids.", "Kringlóttir miðar á kryddkrukkur og lok."],
  "Морозилка": ["Фризер", "Freezer", "Frystir"],
  "Что внутри и с какого числа. Место для даты маркером.": ["Какво има вътре и от коя дата. Място за дата с маркер.", "What's inside and since when. Space for a date in marker.", "Hvað er inni og frá hvaða degi. Pláss fyrir dagsetningu með tússpenna."],
  "Корзины и полки": ["Кошници и рафтове", "Baskets and shelves", "Körfur og hillur"],
  "Крупные таблички на корзины и полки кладовой.": ["Големи табелки за кошници и рафтове в килера.", "Large tags for pantry baskets and shelves.", "Stórir miðar á körfur og hillur í búrinu."],
  "Зимнина": ["Зимнина", "Preserves", "Niðursuða"],
  "Лютеница, компоты, варенье. Название и год на каждой банке.": ["Лютеница, компоти, сладко. Име и година на всеки буркан.", "Lyutenitsa, compotes, jam. Name and year on every jar.", "Ljútenitsa, ávaxtasafar, sulta. Heiti og ár á hverja krukku."],
  "Банки с датой": ["Буркани с дата", "Dated jars", "Dagsettar krukkur"],
  "Название и год, чтобы сначала съедать старые запасы.": ["Име и година, за да изяждате първо старите запаси.", "Name and year, so the oldest jars get eaten first.", "Heiti og ár, svo elstu krukkurnar klárist fyrst."],
  "На крышки": ["За капачки", "For lids", "Á lok"],
  "Круглые наклейки на крышки: видно сверху, когда банки в ящике.": ["Кръгли стикери за капачки: виждат се отгоре, когато бурканите са в кашон.", "Round lid labels: visible from above when jars are in a crate.", "Kringlóttir lokmiðar: sjást ofan frá þegar krukkurnar eru í kassa."],
  "Варенье в подарок": ["Сладко за подарък", "Jam as a gift", "Sulta að gjöf"],
  "Банка из сада выглядит как фирменный подарок.": ["Бурканът от градината изглежда като фирмен подарък.", "A jar from your garden looks like a branded gift.", "Krukka úr garðinum lítur út eins og merkt gjöf."],
  "Школа": ["Училище", "School", "Skóli"],
  "Тетради, учебники, пеналы. Ничего не теряется и не путается.": ["Тетрадки, учебници, несесери. Нищо не се губи и не се бърка.", "Notebooks, textbooks, pencil cases. Nothing gets lost or mixed up.", "Stílabækur, kennslubækur, pennaveski. Ekkert týnist eða ruglast."],
  "Тетради и учебники": ["Тетрадки и учебници", "Notebooks and textbooks", "Stílabækur og kennslubækur"],
  "Имя, предмет и класс на каждой обложке.": ["Име, предмет и клас на всяка корица.", "Name, subject and class on every cover.", "Nafn, fag og bekkur á hverri kápu."],
  "Именные мини": ["Мини с име", "Mini name labels", "Litlir nafnamiðar"],
  "Узкие полоски на ручки, линейки и карандаши.": ["Тесни лентички за химикалки, линийки и моливи.", "Slim strips for pens, rulers and pencils.", "Mjóar ræmur á penna, reglustikur og blýanta."],
  "Детская": ["Детска стая", "Kids' room", "Barnaherbergi"],
  "Картинки для тех, кто ещё не читает. Ребёнок убирает сам.": ["Картинки за тези, които още не четат. Детето подрежда само.", "Pictures for those who can't read yet. Kids tidy up on their own.", "Myndir fyrir þau sem lesa ekki enn. Barnið tekur til sjálft."],
  "Где мои игрушки": ["Къде са играчките ми", "Where are my toys", "Hvar eru leikföngin mín"],
  "Большая картинка и подпись на каждый ящик с игрушками.": ["Голяма картинка и надпис на всяка кутия с играчки.", "A big picture and label on every toy box.", "Stór mynd og miði á hvern leikfangakassa."],
  "Комод малыша": ["Скринът на малчугана", "Toddler's dresser", "Kommóða barnsins"],
  "Носки, футболки, пижамы по своим ящикам.": ["Чорапи, тениски, пижами по своите чекмеджета.", "Socks, T-shirts and pyjamas in their own drawers.", "Sokkar, bolir og náttföt í sínum skúffum."],
  "Мастерская": ["Работилница", "Workshop", "Verkstæði"],
  "Метизы, инструмент, стеллажи. Видно размер и хозяина.": ["Крепежи, инструменти, стелажи. Вижда се размерът и собственикът.", "Fasteners, tools, racks. Size and owner at a glance.", "Festingar, verkfæri, rekkar. Stærð og eigandi í sjónmáli."],
  "Метизы": ["Крепежи", "Fasteners", "Festingar"],
  "Размер болта, винта и дюбеля на каждой ячейке кассетницы.": ["Размер на болта, винта и дюбела на всяко чекмедже на касетата.", "Bolt, screw and plug sizes on every organiser drawer.", "Stærð bolta, skrúfa og tappa á hverja skúffu."],
  "Мой инструмент": ["Моите инструменти", "My tools", "Verkfærin mín"],
  "Имя и телефон: инструмент возвращается с объекта.": ["Име и телефон: инструментът се връща от обекта.", "Name and phone: tools come back from the job site.", "Nafn og sími: verkfærin skila sér heim af vinnustað."],
  "Электрика": ["Електрика", "Electrics", "Rafmagn"],
  "Щиток, кабели, зарядки. Понятно, что за что отвечает.": ["Табло, кабели, зарядни. Ясно е кое за какво е.", "Fuse box, cables, chargers. Clear what's what.", "Rafmagnstafla, snúrur, hleðslutæki. Ljóst hvað er hvað."],
  "Электрощиток": ["Електрическо табло", "Fuse box", "Rafmagnstafla"],
  "Подписи под автоматы: кухня, бойлер, свет, розетки.": ["Надписи под автоматите: кухня, бойлер, осветление, контакти.", "Labels under breakers: kitchen, boiler, lights, sockets.", "Miðar undir öryggi: eldhús, hitakútur, ljós, innstungur."],
  "Кабели и зарядки": ["Кабели и зарядни", "Cables and chargers", "Snúrur og hleðslutæki"],
  "Флажки на провода: больше не путаем блоки питания.": ["Флагчета на кабелите: край на объркването на зарядните.", "Flags on cables: no more mixing up power adapters.", "Fánar á snúrur: ekki lengur ruglingur á hleðslutækjum."],
  "Дом и переезд": ["Дом и преместване", "Home and moving", "Heimili og flutningar"],
  "Ящики, бытовая химия, коробки при переезде.": ["Чекмеджета, домакинска химия, кашони при преместване.", "Drawers, cleaning products, moving boxes.", "Skúffur, hreinsiefni, flutningakassar."],
  "Ящики и мелочи": ["Чекмеджета и дребни неща", "Drawers and odds and ends", "Skúffur og smáhlutir"],
  "Порядок в ящике, где лежит всё сразу.": ["Ред в чекмеджето, където е всичко.", "Order in the drawer where everything ends up.", "Regla í skúffunni þar sem allt endar."],
  "Бытовая химия": ["Домакинска химия", "Cleaning products", "Hreinsiefni"],
  "Для одинаковых бутылок и дозаторов.": ["За еднакви бутилки и дозатори.", "For matching bottles and dispensers.", "Fyrir eins flöskur og skammtara."],
  "Переезд": ["Преместване", "Moving", "Flutningar"],
  "Комната и номер на каждой коробке.": ["Стая и номер на всеки кашон.", "Room and number on every box.", "Herbergi og númer á hvern kassa."],
  "Апартаменты": ["Апартаменти", "Holiday rentals", "Íbúðagisting"],
  "Wi-Fi, правила, номера дверей. Меньше вопросов от гостей.": ["Wi-Fi, правила, номера на вратите. По-малко въпроси от гостите.", "Wi-Fi, house rules, door numbers. Fewer questions from guests.", "Wi-Fi, húsreglur, hurðanúmer. Færri spurningar frá gestum."],
  "Wi-Fi и правила": ["Wi-Fi и правила", "Wi-Fi and rules", "Wi-Fi og reglur"],
  "Пароль и важные правила на виду у гостей.": ["Паролата и важните правила пред очите на гостите.", "Password and key rules right in front of guests.", "Lykilorð og helstu reglur fyrir augum gesta."],
  "Номера дверей": ["Номера на вратите", "Door numbers", "Hurðanúmer"],
  "Номера апартаментов и указатели на этажах.": ["Номера на апартаментите и указатели по етажите.", "Apartment numbers and floor signs.", "Íbúðanúmer og vegvísar á hæðum."],
  // галерея
  "Тетради": ["Тетрадки", "Notebooks", "Stílabækur"], "Игрушки": ["Играчки", "Toys", "Leikföng"], "Щиток": ["Табло", "Fuse box", "Tafla"],
  "Корзины": ["Кошници", "Baskets", "Körfur"], "Ящики": ["Чекмеджета", "Drawers", "Skúffur"], "Варенье": ["Сладко", "Jam", "Sulta"],

  // ---------- тексты наклеек в готовых наборах ----------
  "Рис": ["Ориз", "Rice", "Hrísgrjón"], "Гречка": ["Елда", "Buckwheat", "Bókhveiti"], "Овсянка": ["Овесени ядки", "Oats", "Hafrar"],
  "Мука": ["Брашно", "Flour", "Hveiti"], "Сахар": ["Захар", "Sugar", "Sykur"], "Соль": ["Сол", "Salt", "Salt"],
  "Макароны": ["Макарони", "Pasta", "Pasta"], "Чечевица": ["Леща", "Lentils", "Linsubaunir"],
  "Паприка": ["Червен пипер", "Paprika", "Paprika"], "Куркума": ["Куркума", "Turmeric", "Túrmerik"], "Корица": ["Канела", "Cinnamon", "Kanill"],
  "Орегано": ["Риган", "Oregano", "Óreganó"], "Базилик": ["Босилек", "Basil", "Basilíka"], "Перец": ["Пипер", "Pepper", "Pipar"],
  "Чубрица": ["Чубрица", "Savory", "Sar"], "Чеснок": ["Чесън", "Garlic", "Hvítlaukur"], "Тмин": ["Кимион", "Cumin", "Kúmen"],
  "Кориандр": ["Кориандър", "Coriander", "Kóríander"], "Лавр": ["Дафинов лист", "Bay leaf", "Lárviður"], "Розмарин": ["Розмарин", "Rosemary", "Rósmarín"],
  "Фарш": ["Кайма", "Mince", "Hakk"], "Дата: ______": ["Дата: ______", "Date: ______", "Dags.: ______"], "Ягоды": ["Плодове", "Berries", "Ber"],
  "Овощи": ["Зеленчуци", "Vegetables", "Grænmeti"], "Суп": ["Супа", "Soup", "Súpa"], "Хлеб": ["Хляб", "Bread", "Brauð"],
  "Снеки": ["Снаксове", "Snacks", "Snarl"], "Завтраки": ["Закуски", "Breakfast", "Morgunmatur"], "Выпечка": ["Печене", "Baking", "Bakstur"],
  "Консервы": ["Консерви", "Tins", "Niðursuðuvörur"], "Напитки": ["Напитки", "Drinks", "Drykkir"], "Чай и кофе": ["Чай и кафе", "Tea and coffee", "Te og kaffi"],
  "Лютеница": ["Лютеница", "Lyutenitsa", "Ljútenitsa"], "Кьопоолу": ["Кьопоолу", "Kyopolou", "Kjopolú"], "Айвар": ["Айвар", "Ajvar", "Ajvar"],
  "Туршия": ["Туршия", "Pickles", "Súrsað grænmeti"], "Компот": ["Компот", "Compote", "Ávaxtasafi"], "Огурцы": ["Краставички", "Gherkins", "Gúrkur"],
  "Вишня": ["Вишна", "Cherry", "Kirsuber"], "Абрикос": ["Кайсия", "Apricot", "Apríkósa"], "Слива": ["Слива", "Plum", "Plóma"],
  "Инжир": ["Смокиня", "Fig", "Fíkja"], "Клубника": ["Ягода", "Strawberry", "Jarðarber"], "Айва": ["Дюля", "Quince", "Kveði"],
  "Варенье из инжира": ["Сладко от смокини", "Fig jam", "Fíkjusulta"], "С любовью, Мария": ["С любов, Мария", "With love, Maria", "Með ást, María"],
  "Абрикосовый джем": ["Конфитюр от кайсии", "Apricot jam", "Apríkósusulta"], "Сливовое варенье": ["Сладко от сливи", "Plum jam", "Plómusulta"],
  "Математика": ["Математика", "Maths", "Stærðfræði"], "Мария Петрова, 3 Б": ["Мария Петрова, 3 Б", "Maria Petrova, 3B", "María Petrova, 3B"],
  "Български език": ["Български език", "Bulgarian", "Búlgarska"], "Английский": ["Английски", "English", "Enska"], "Природа": ["Човекът и природата", "Science", "Náttúrufræði"],
  "Рисование": ["Изобразително изкуство", "Art", "Myndmennt"], "Музыка": ["Музика", "Music", "Tónlist"], "Мария П.": ["Мария П.", "Maria P.", "María P."],
  "Машинки": ["Колички", "Cars", "Bílar"], "Мячи": ["Топки", "Balls", "Boltar"], "Книжки": ["Книжки", "Books", "Bækur"],
  "Мягкие": ["Плюшени", "Soft toys", "Tuskudýr"], "Кубики": ["Кубчета", "Blocks", "Kubbar"],
  "Футболки": ["Тениски", "T-shirts", "Bolir"], "Пижамы": ["Пижами", "Pyjamas", "Náttföt"], "Носки": ["Чорапи", "Socks", "Sokkar"],
  "Штаны": ["Панталони", "Trousers", "Buxur"], "Кофты": ["Блузи", "Jumpers", "Peysur"],
  "Шурупы 3,5×35": ["Винтове 3,5×35", "Screws 3.5×35", "Skrúfur 3,5×35"], "Дюбели 6 мм": ["Дюбели 6 мм", "Wall plugs 6 mm", "Tappar 6 mm"],
  "Гайки M6": ["Гайки M6", "Nuts M6", "Rær M6"], "Шайбы M8": ["Шайби M8", "Washers M8", "Skinnur M8"], "Иван": ["Иван", "Ivan", "Ívan"],
  "Кухня": ["Кухня", "Kitchen", "Eldhús"], "Бойлер": ["Бойлер", "Boiler", "Hitakútur"], "Свет": ["Осветление", "Lights", "Ljós"],
  "Розетки": ["Контакти", "Sockets", "Innstungur"], "Кондиционер": ["Климатик", "Air con", "Loftkæling"], "Ванная": ["Баня", "Bathroom", "Baðherbergi"],
  "Спальня": ["Спалня", "Bedroom", "Svefnherbergi"], "Духовка": ["Фурна", "Oven", "Ofn"], "Стиральная": ["Пералня", "Washing machine", "Þvottavél"],
  "Ноутбук": ["Лаптоп", "Laptop", "Fartölva"], "Телевизор": ["Телевизор", "TV", "Sjónvarp"], "Роутер": ["Рутер", "Router", "Beinir"],
  "Колонка": ["Колонка", "Speaker", "Hátalari"], "Лампа": ["Лампа", "Lamp", "Lampi"],
  "Батарейки": ["Батерии", "Batteries", "Rafhlöður"], "Лампочки": ["Крушки", "Light bulbs", "Ljósaperur"], "Зарядки": ["Зарядни", "Chargers", "Hleðslutæki"],
  "Аптечка": ["Аптечка", "First aid", "Sjúkrakassi"], "Документы": ["Документи", "Documents", "Skjöl"], "Ключи": ["Ключове", "Keys", "Lyklar"],
  "Порошок": ["Прах за пране", "Detergent", "Þvottaefni"], "Для посуды": ["За съдове", "Dish soap", "Uppþvottalögur"], "Для пола": ["За под", "Floor cleaner", "Gólfhreinsir"],
  "Пятновыводитель": ["Препарат за петна", "Stain remover", "Blettahreinsir"],
  "Коробка №1, хрупкое": ["Кашон №1, чупливо", "Box 1, fragile", "Kassi 1, brothætt"], "Коробка №2": ["Кашон №2", "Box 2", "Kassi 2"],
  "Коробка №3": ["Кашон №3", "Box 3", "Kassi 3"], "Коробка №4": ["Кашон №4", "Box 4", "Kassi 4"], "Коробка №5": ["Кашон №5", "Box 5", "Kassi 5"],
  "Гостиная": ["Хол", "Living room", "Stofa"], "Книги": ["Книги", "Books", "Bækur"], "Коробка №6, тяжёлая": ["Кашон №6, тежко", "Box 6, heavy", "Kassi 6, þungt"],
  "Пароль: varna2026": ["Парола: varna2026", "Password: varna2026", "Lykilorð: varna2026"], "Check-out до 11:00": ["Напускане до 11:00", "Check-out by 11:00", "Útskráning fyrir 11:00"],
  "Ключ оставьте на столе": ["Оставете ключа на масата", "Leave the key on the table", "Skildu lykilinn eftir á borðinu"], "Не курить": ["Пушенето забранено", "No smoking", "Reykingar bannaðar"],
};

// Формы множественного числа. Ключ — русская форма для 1, значение — [одна, много] на bg/en/is.
const PLURALS = {
  "набор": { bg: ["комплект", "комплекта"], en: ["set", "sets"], is: ["sett", "sett"] },
  "наклейка": { bg: ["стикер", "стикера"], en: ["label", "labels"], is: ["límmiði", "límmiðar"] },
  "лист": { bg: ["лист", "листа"], en: ["sheet", "sheets"], is: ["örk", "arkir"] },
  "вид": { bg: ["вид", "вида"], en: ["kind", "kinds"], is: ["tegund", "tegundir"] },
  "работа": { bg: ["работа", "работи"], en: ["item", "items"], is: ["verk", "verk"] },
  "образец": { bg: ["образец", "образеца"], en: ["sample", "samples"], is: ["sýni", "sýni"] },
};

function tr(ru) {
  if (LANG === "ru" || ru == null) return ru;
  const v = I18N[ru];
  return v ? v[LANG_IDX[LANG]] : ru;
}
function t(ru, vars) {
  let s = tr(ru);
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return s;
}
// Числа с запятой для ru/bg/is, с точкой для en
const num1 = (v) => (LANG === "en" ? v.toFixed(1) : v.toFixed(1).replace(".", ","));

function pluralWord(n, one, few, many) {
  if (LANG === "ru") {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }
  const forms = PLURALS[one]?.[LANG];
  if (!forms) return tr(one);
  if (LANG === "is") return n % 10 === 1 && n % 100 !== 11 ? forms[0] : forms[1];
  return n === 1 ? forms[0] : forms[1];
}

// Готовые наклейки из каталога — в языке сайта
const locSticker = (s) => ({ ...s, text: tr(s.text), sub: tr(s.sub) });

// ---------- автоматический перевод отрисованного интерфейса ----------
// Переводит текстовые узлы и атрибуты, целиком совпадающие с русской строкой словаря.
// Не трогает пользовательский текст: SVG (наклейки), поля ввода и всё внутри [translate="no"].
const I18N_ATTRS = ["placeholder", "aria-label", "title", "alt"];
function translateTree(root) {
  if (LANG === "ru" || !root) return;
  if (root.nodeType === 3) { translateText(root); return; }
  if (root.nodeType !== 1 || (root.closest && root.closest('svg, [translate="no"]'))) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && n.matches('svg, [translate="no"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [root];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    if (n.nodeType === 3) translateText(n);
    else for (const a of I18N_ATTRS) {
      const v = n.getAttribute(a);
      if (v && I18N[v.trim()]) { const o = tr(v.trim()); if (o !== v) n.setAttribute(a, o); }
    }
  }
}
function translateText(node) {
  const raw = node.nodeValue;
  if (!raw || !/[А-Яа-яЁё]/.test(raw)) return;
  const p = node.parentNode;
  if (p && (p.nodeName === "TEXTAREA" || (p.closest && p.closest('svg, [translate="no"]')))) return;
  if (I18N_DONE.get(node) === raw) return; // уже переведён (перевод может совпадать с русским ключом)
  const key = raw.trim();
  if (!I18N[key]) return;
  const out = raw.replace(key, tr(key));
  I18N_DONE.set(node, out);
  if (out !== raw) node.nodeValue = out;
}
const I18N_DONE = new WeakMap();
const i18nObserver = new MutationObserver((muts) => {
  if (LANG === "ru") return;
  for (const m of muts) {
    if (m.type === "characterData") translateText(m.target);
    else m.addedNodes.forEach((n) => translateTree(n));
  }
});
i18nObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

const PAGE_TITLE = {
  ru: "Лепко — наклейки для порядка дома",
  bg: "Лепко — стикери за ред у дома",
  en: "Lepko — labels for a tidy home",
  is: "Lepko — límmiðar fyrir snyrtilegt heimili",
};
function applyLangMeta() {
  document.documentElement.lang = LANG;
  document.title = PAGE_TITLE[LANG];
}
function setLang(code) {
  if (!LANGS.some(([c]) => c === code) || code === LANG) return;
  LANG = code;
  try { localStorage.setItem("lepko-lang", code); } catch {}
  applyLangMeta();
  if (typeof route === "function") route(true);
}
applyLangMeta();

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lang]");
  if (b) { e.preventDefault(); setLang(b.dataset.lang); }
});
