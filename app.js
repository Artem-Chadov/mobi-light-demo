const variant = 'light';
const themes = {
  light: { title: 'Твой следующий<br>iPhone', description: 'Выбери модель, цвет и объём памяти. <br>Осталось найти твой iPhone.', cta: 'Выбрать iPhone' },
  blue: { title: 'Много планов.<br>Один iPhone', description: 'Для кадров, которые хочется сохранить. <br>И всего, что ты задумал на сегодня.', cta: 'Подобрать iPhone' },
  peach: { title: 'Твои любимые.<br>Теперь вместе', description: 'iPhone, музыка в AirPods и Apple Watch. <br>Собери комплект под свой день.', cta: 'Собрать комплект' }
};
document.querySelector('#hero-title').innerHTML = themes[variant].title;
document.querySelector('.hero-description').innerHTML = themes[variant].description;
document.querySelector('#hero-cta').firstChild.textContent = themes[variant].cta + ' ';
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); }
menuButton.addEventListener('click', () => { const open = mobileMenu.hidden; mobileMenu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
mobileMenu.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); } });

// All prices are illustrative. No stock, checkout or external order submission.
const PRODUCTS = [
  { id: 'iphone17', name: 'iPhone 17', category: 'phones', image: 'iphone-17-lavender.webp', color: 'Лавандовый', tagline: 'На каждый день', description: 'Выбери объём памяти для своих фотографий, приложений и музыки.', options: [{ label: '256 ГБ', price: 74990 }, { label: '512 ГБ', price: 92990 }] },
  { id: 'iphone18pro', name: 'iPhone 18 Pro', category: 'phones', image: 'iphone-18-pro-burgundy.webp', color: 'Бордовый', tagline: 'Для фото и видео', description: 'Бордовый корпус и выбор памяти для твоих съёмок. Посмотри доступные варианты.', options: [{ label: '256 ГБ', price: 109990 }, { label: '512 ГБ', price: 127990 }, { label: '1 ТБ', price: 147990 }] },
  { id: 'iphoneair', name: 'iPhone Air', category: 'phones', image: 'iphone-air-skyblue.webp', color: 'Небесно-голубой', tagline: 'Больше лёгкости', description: 'Тонкий iPhone в небесно-голубом цвете. Выбери подходящий объём памяти.', options: [{ label: '256 ГБ', price: 84990 }, { label: '512 ГБ', price: 102990 }, { label: '1 ТБ', price: 122990 }] },
  { id: 'iphone16', name: 'iPhone 16', category: 'phones', image: 'iphone-16-ultramarine.webp', color: 'Ультрамарин', tagline: 'Знакомый и любимый', description: 'iPhone в насыщенном цвете ультрамарин с памятью 128 ГБ. Сохрани модель в своей подборке.', options: [{ label: '128 ГБ', price: 59990 }] },
  { id: 'airpods5', name: 'AirPods 5', category: 'audio', image: 'airpods-5.webp', color: 'Белый', tagline: 'Музыка всегда рядом', description: 'Открытая посадка и зарядный футляр. В подборке показаны AirPods 5.', options: [{ label: 'С зарядным футляром', price: 14990 }] },
  { id: 'airpodspro3', name: 'AirPods Pro 3', category: 'audio', image: 'airpods-pro-3.webp', color: 'Белый', tagline: 'Время для музыки', description: 'Наушники с силиконовыми насадками и зарядным футляром. Добавь их к своему iPhone.', options: [{ label: 'С зарядным футляром', price: 24990 }] },
  { id: 'watch12', name: 'Apple Watch Series 12', category: 'watches', image: 'watch-series-12.webp', color: 'Тёмная бронза', tagline: 'В твоём ритме', description: 'Часы для твоего повседневного комплекта. Корпус цвета тёмной бронзы и оливковый ремешок показаны на фотографии.', options: [{ label: 'С оливковым ремешком', price: 39990 }] },
  { id: 'watchse3', name: 'Apple Watch SE 3', category: 'watches', image: 'watch-se-3.webp', color: 'Сияющая звезда', tagline: 'Рядом каждый день', description: 'Apple Watch для твоего комплекта. Корпус цвета «сияющая звезда» и песочный ремешок показаны на фотографии.', options: [{ label: 'С песочным ремешком', price: 22990 }] }
];
const productById = new Map(PRODUCTS.map(product => [product.id, product]));
const CART_KEY = 'mobi-demo-cart-v1';
const MAX_QUANTITY = 99;
const money = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value).replace(/[\u202f ]/g, '\u00a0') + '\u00a0₽';
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const plusIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>';
let toastTimer;
function notify(message) {
  const toast = document.querySelector('.toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}
function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    const valid = new Map();
    for (const item of saved.slice(0, 100)) {
      if (!item || typeof item !== 'object') continue;
      const product = productById.get(item.id);
      if (!product || !Number.isInteger(item.option) || !product.options[item.option] || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
      const key = `${item.id}:${item.option}`;
      const previous = valid.get(key)?.quantity || 0;
      valid.set(key, { id: item.id, option: item.option, quantity: Math.min(MAX_QUANTITY, previous + item.quantity) });
    }
    return [...valid.values()];
  } catch { return []; }
}
let cart = readCart();
let persistenceWarningShown = false;
let lastPersistenceSucceeded = true;
function persistCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); lastPersistenceSucceeded = true; }
  catch {
    lastPersistenceSucceeded = false;
    if (!persistenceWarningShown) {
      persistenceWarningShown = true;
      notify('Браузер не сохранил корзину. Она доступна до закрытия страницы.');
    }
    return false;
  }
  return true;
}
function cartTotal() { return cart.reduce((sum, item) => sum + productById.get(item.id).options[item.option].price * item.quantity, 0); }
function updateCartCount() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(count => { count.textContent = quantity; });
  document.querySelectorAll('[data-cart]').forEach(button => { button.setAttribute('aria-label', `Открыть корзину, товаров: ${quantity}`); });
}
function addToCart(id, option, quantity = 1, silent = false) {
  const product = productById.get(id);
  if (!product || !product.options[option]) return false;
  const existing = cart.find(item => item.id === id && item.option === option);
  if (existing && existing.quantity >= MAX_QUANTITY) { notify('В подборке уже 99 таких товаров.'); return false; }
  if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + quantity);
  else cart.push({ id, option, quantity: Math.min(MAX_QUANTITY, quantity) });
  const persisted = persistCart();
  updateCartCount();
  if (!silent && persisted) notify(`${product.name} добавлен в корзину`);
  return true;
}
function productCard(product, hit = false) {
  return `<article class="product-card${hit ? ' hit-card' : ''}" data-product-card="${product.id}">
    <button class="product-picture" data-product="${product.id}" aria-label="Посмотреть ${escapeHTML(product.name)}"><img src="assets/${product.image}" alt="${escapeHTML(product.name + ', ' + product.color.toLowerCase())}" width="600" height="600" loading="lazy"></button>
    <div class="product-info"><p class="product-tag">${product.tagline}</p><h3><button class="product-name" data-product="${product.id}">${product.name}</button></h3><p class="product-meta">${product.category === 'phones' ? product.options[0].label + ' / ' : ''}${product.color}</p>
      <div class="product-bottom"><span class="price">${money(product.options[0].price)}</span><button class="add-button" data-product="${product.id}" aria-label="Выбрать ${escapeHTML(product.name)}">${plusIcon}</button></div>
    </div>
  </article>`;
}

document.querySelector('#hits-grid').innerHTML = ['iphone17', 'iphone18pro', 'airpodspro3'].map(id => productCard(productById.get(id), true)).join('');
document.querySelector('#remaining-sections').innerHTML = `
  <section class="section container" id="catalog" aria-labelledby="catalog-title">
    <div class="section-heading"><div><p class="section-kicker">Найди своё</p><h2 id="catalog-title">Каталог</h2></div><p class="catalog-intro">Выбирай технику под свои планы</p></div>
    <div class="catalog-toolbar">
      <div class="category-tabs" role="tablist" aria-label="Категории товаров">
        <button type="button" role="tab" id="tab-all" aria-controls="catalog-products" aria-selected="true" data-category="all" tabindex="0">Все товары</button>
        <button type="button" role="tab" id="tab-phones" aria-controls="catalog-products" aria-selected="false" data-category="phones" tabindex="-1">iPhone</button>
        <button type="button" role="tab" id="tab-audio" aria-controls="catalog-products" aria-selected="false" data-category="audio" tabindex="-1">Наушники</button>
        <button type="button" role="tab" id="tab-watches" aria-controls="catalog-products" aria-selected="false" data-category="watches" tabindex="-1">Часы</button>
      </div>
      <div class="catalog-tools"><label class="search-box">${searchIcon}<input type="search" id="search" placeholder="Найти модель" aria-label="Поиск по названию модели" autocomplete="off"></label><select id="sort" aria-label="Сортировка товаров"><option value="default">По умолчанию</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="name">По названию</option></select></div>
    </div>
    <p class="catalog-count" role="status" aria-live="polite"></p>
    <div id="catalog-products" role="tabpanel" aria-labelledby="tab-all"><div class="catalog-grid"></div><div class="empty-state" hidden><h3>Такая модель не нашлась</h3><p>Попробуй другое название или посмотри все товары.</p><button type="button" class="button secondary" data-reset>Сбросить поиск</button></div></div>
    <p class="demo-note">Цены примерные. Варианты памяти доступны в карточке товара.</p>
  </section>`;

document.querySelector('#overlays').innerHTML = `
  <dialog class="product-dialog" aria-labelledby="detail-title"><button class="dialog-close" data-close aria-label="Закрыть карточку товара">${closeIcon}</button><div class="product-detail-grid"></div></dialog>
  <dialog class="cart-dialog" aria-labelledby="cart-title"><div class="dialog-header"><div><p class="section-kicker">Твоя подборка</p><h2 id="cart-title">Корзина</h2></div><button class="dialog-close" data-close aria-label="Закрыть корзину">${closeIcon}</button></div><p class="dialog-note">Демо-корзина. Заказ не отправляется, оплата не списывается.</p><div class="cart-items"></div><div class="cart-empty" hidden><h3>Здесь будут твои находки</h3><p>Выбери iPhone, наушники или часы и добавь их в подборку.</p><button class="button primary" data-browse>Перейти к каталогу</button></div><div class="cart-summary"></div></dialog>
  <dialog class="chooser-dialog" aria-labelledby="chooser-title"><button class="dialog-close" data-close aria-label="Закрыть подбор iPhone">${closeIcon}</button><p class="section-kicker">Начнём с тебя</p><h2 id="chooser-title">Для чего тебе iPhone?</h2><p class="dialog-note">Выбери ближайший сценарий. Откроем подходящую модель из каталога.</p><div class="chooser-grid"><button class="chooser-option" data-product="iphone17"><span>Каждый день</span><small>Общаться, слушать музыку и снимать моменты</small><img src="assets/iphone-17-lavender.webp" alt="iPhone 17" width="220" height="220" loading="eager"></button><button class="chooser-option" data-product="iphone18pro"><span>Фото и видео</span><small>Больше внимания к съёмке и памяти</small><img src="assets/iphone-18-pro-burgundy.webp" alt="iPhone 18 Pro" width="220" height="220" loading="eager"></button><button class="chooser-option" data-product="iphoneair"><span>Больше лёгкости</span><small>Тонкий корпус и большой экран</small><img src="assets/iphone-air-skyblue.webp" alt="iPhone Air" width="220" height="220" loading="eager"></button></div></dialog>
  <dialog class="bundle-dialog" aria-labelledby="bundle-title"><button class="dialog-close" data-close aria-label="Закрыть сборку комплекта">${closeIcon}</button><p class="section-kicker">Всё под рукой</p><h2 id="bundle-title">Собери свой комплект</h2><p class="dialog-note">Выбери iPhone и добавь то, что пригодится каждый день. Цены примерные.</p><div class="bundle-options"></div><div class="bundle-summary"><div><span>Стоимость комплекта</span><strong class="bundle-total"></strong></div><button class="button primary" data-add-bundle>Добавить комплект</button></div></dialog>`;

let activeCategory = 'all';
const searchInput = document.querySelector('#search');
const sortSelect = document.querySelector('#sort');
function renderCatalog() {
  const query = searchInput.value.trim().toLocaleLowerCase('ru-RU');
  let visible = PRODUCTS.filter(product => (activeCategory === 'all' || product.category === activeCategory) && `${product.name} ${product.color}`.toLocaleLowerCase('ru-RU').includes(query));
  if (sortSelect.value === 'price-asc') visible.sort((first, second) => first.options[0].price - second.options[0].price);
  if (sortSelect.value === 'price-desc') visible.sort((first, second) => second.options[0].price - first.options[0].price);
  if (sortSelect.value === 'name') visible.sort((first, second) => first.name.localeCompare(second.name, 'ru'));
  document.querySelector('.catalog-grid').innerHTML = visible.map(product => productCard(product)).join('');
  document.querySelector('.empty-state').hidden = visible.length > 0;
  document.querySelector('.catalog-count').textContent = `Найдено товаров: ${visible.length}`;
}
function setCategory(category) {
  activeCategory = ['all', 'phones', 'audio', 'watches'].includes(category) ? category : 'all';
  document.querySelectorAll('[data-category]').forEach(tab => {
    const selected = tab.dataset.category === activeCategory;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#catalog-products').setAttribute('aria-labelledby', `tab-${activeCategory}`);
  renderCatalog();
}
document.querySelector('.category-tabs').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = [...document.querySelectorAll('[data-category]')];
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  event.preventDefault();
  const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  setCategory(tabs[index].dataset.category);
  tabs[index].focus();
});
searchInput.addEventListener('input', renderCatalog);
sortSelect.addEventListener('change', renderCatalog);

const allDialogs = [...document.querySelectorAll('dialog')];
for (const dialog of allDialogs) {
  const closeButton = dialog.querySelector('[data-close]');
  closeButton.remove();
  const scrollBody = document.createElement('div');
  scrollBody.className = 'dialog-scroll';
  while (dialog.firstChild) scrollBody.append(dialog.firstChild);
  dialog.append(closeButton, scrollBody);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(control => control.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); return; }
    const outside = !controls.includes(document.activeElement);
    if (event.shiftKey && (document.activeElement === first || outside)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || outside)) { event.preventDefault(); first.focus(); }
  });
}
let returnFocus = null;
function openDialog(dialog) {
  const alreadyOpen = allDialogs.find(item => item.open);
  if (!alreadyOpen) returnFocus = document.activeElement;
  if (alreadyOpen && alreadyOpen !== dialog) alreadyOpen.close('switch');
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.querySelector('[data-close]')?.focus({ preventScroll: true });
}
for (const dialog of allDialogs) {
  dialog.addEventListener('close', () => {
    queueMicrotask(() => {
      if (allDialogs.some(item => item.open)) return;
      document.body.classList.remove('dialog-open');
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
  });
  let pointerStartedOutside = false;
  const isOutside = event => { const bounds = dialog.getBoundingClientRect(); return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom; };
  dialog.addEventListener('pointerdown', event => { pointerStartedOutside = event.target === dialog && isOutside(event); });
  dialog.addEventListener('click', event => { if (pointerStartedOutside && event.target === dialog && isOutside(event)) dialog.close(); pointerStartedOutside = false; });
}
let detailProduct = null;
let detailOption = 0;
function openProduct(id) {
  const product = productById.get(id);
  if (!product) return;
  detailProduct = product;
  detailOption = 0;
  const dialog = document.querySelector('.product-dialog');
  dialog.querySelector('.product-detail-grid').innerHTML = `<div class="detail-image"><img src="assets/${product.image}" alt="${escapeHTML(product.name + ', ' + product.color.toLowerCase())}" width="600" height="600"></div><div class="detail-copy"><p class="product-tag">${product.tagline}</p><h2 id="detail-title">${product.name}</h2><p class="detail-meta">${product.color}</p><p class="detail-description">${product.description}</p><fieldset class="option-group"><legend>${product.category === 'phones' ? 'Память' : 'Вариант'}</legend><div class="option-buttons">${product.options.map((option, index) => `<button type="button" class="option-button" data-option="${index}" aria-pressed="${index === 0}">${option.label}</button>`).join('')}</div></fieldset><p class="detail-price">${money(product.options[0].price)}</p><p class="demo-note">Примерная цена в демо-каталоге</p><div class="detail-actions"><button class="button primary" data-add>Добавить в корзину ${plusIcon}</button><button class="button secondary" data-cart>Открыть корзину</button></div><p class="detail-feedback" role="status" aria-live="polite"></p></div>`;
  openDialog(dialog);
}
function renderCart(restoreAction) {
  const items = document.querySelector('.cart-items');
  const summary = document.querySelector('.cart-summary');
  document.querySelector('.cart-dialog .dialog-note').textContent = 'Демо-корзина. Заказ не отправляется, оплата не списывается.' + (lastPersistenceSucceeded ? '' : ' Браузер не сохранил корзину. Она доступна до закрытия страницы.');
  document.querySelector('.cart-empty').hidden = cart.length > 0;
  summary.hidden = cart.length === 0;
  items.innerHTML = cart.map(item => {
    const product = productById.get(item.id);
    const option = product.options[item.option];
    const key = `${item.id}:${item.option}`;
    return `<article class="cart-item"><img src="assets/${product.image}" alt="${escapeHTML(product.name)}" width="120" height="120"><div class="cart-item-info"><h3>${product.name}</h3><p>${option.label} / ${product.color}</p><span class="cart-unit-price">${money(option.price)} за шт.</span><button class="remove-button" data-remove="${key}" aria-label="Удалить ${escapeHTML(product.name)}, ${option.label}">Удалить</button></div><div class="cart-item-controls"><div class="quantity-controls"><button data-quantity="${key}" data-delta="-1" aria-label="Уменьшить количество ${escapeHTML(product.name)}" ${item.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Количество">${item.quantity}</span><button data-quantity="${key}" data-delta="1" aria-label="Увеличить количество ${escapeHTML(product.name)}" ${item.quantity === MAX_QUANTITY ? 'disabled' : ''}>+</button></div><strong class="cart-line-total">${money(option.price * item.quantity)}</strong></div></article>`;
  }).join('');
  summary.innerHTML = `<div class="cart-total"><span>Итого</span><strong>${money(cartTotal())}</strong></div><button class="button primary" data-download>Сохранить подборку</button><p class="demo-note">Скачается текстовый файл с моделями и примерными ценами.</p>`;
  if (restoreAction) {
    const match = [...items.querySelectorAll('button')].find(button => button.dataset.quantity === restoreAction.key && button.dataset.delta === restoreAction.delta && !button.disabled);
    (match || items.querySelector('button:not(:disabled)') || document.querySelector('[data-browse]')).focus({ preventScroll: true });
  }
}
function openCart() { renderCart(); openDialog(document.querySelector('.cart-dialog')); }
function changeQuantity(key, delta) {
  const item = cart.find(entry => `${entry.id}:${entry.option}` === key);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(MAX_QUANTITY, item.quantity + delta));
  persistCart();
  updateCartCount();
  renderCart({ key, delta: String(delta) });
}
function removeItem(key) {
  const index = cart.findIndex(entry => `${entry.id}:${entry.option}` === key);
  if (index < 0) return;
  const name = productById.get(cart[index].id).name;
  cart.splice(index, 1);
  persistCart(); updateCartCount(); renderCart();
  const controls = [...document.querySelectorAll('.cart-items [data-remove]')];
  (controls[Math.min(index, controls.length - 1)] || document.querySelector('[data-browse]')).focus({ preventScroll: true });
  notify(`${name} удалён из корзины`);
}
function downloadCart() {
  if (!cart.length) return;
  const lines = ['mobi — твоя подборка', '', 'Демонстрационный каталог. Цены примерные. Заказ не отправлен.', '', ...cart.map((item, index) => {
    const product = productById.get(item.id);
    const option = product.options[item.option];
    return `${index + 1}. ${product.name}, ${product.color}, ${option.label}\n   ${item.quantity} шт. × ${money(option.price)} = ${money(option.price * item.quantity)}`;
  }), '', `Итого: ${money(cartTotal())}`];
  try {
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'mobi-подборка.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Подборка готова к скачиванию');
  } catch { notify('Не получилось скачать файл. Попробуй ещё раз.'); }
}
function openBundle() {
  const categories = [{ key: 'phones', label: 'iPhone', optional: false }, { key: 'audio', label: 'Наушники', optional: true }, { key: 'watches', label: 'Часы', optional: true }];
  document.querySelector('.bundle-options').innerHTML = categories.map(category => `<label class="bundle-option"><span>${category.label}</span><select data-bundle-category="${category.key}">${category.optional ? '<option value="">Пока без этого</option>' : ''}${PRODUCTS.filter(product => product.category === category.key).map(product => `<option value="${product.id}">${product.name} — ${money(product.options[0].price)}</option>`).join('')}</select><span class="bundle-preview"></span></label>`).join('');
  updateBundle();
  openDialog(document.querySelector('.bundle-dialog'));
}
function bundleProducts() { return [...document.querySelectorAll('[data-bundle-category]')].map(select => productById.get(select.value)).filter(Boolean); }
function updateBundle() {
  document.querySelector('.bundle-total').textContent = money(bundleProducts().reduce((sum, product) => sum + product.options[0].price, 0));
  document.querySelectorAll('[data-bundle-category]').forEach(select => {
    const product = productById.get(select.value);
    select.nextElementSibling.innerHTML = product ? `<img src="assets/${product.image}" alt="${escapeHTML(product.name)}" width="100" height="100"><small>${product.options[0].label} / ${product.color}</small>` : '<small>Можно добавить позже</small>';
  });
}
document.querySelector('.bundle-options').addEventListener('change', updateBundle);
document.querySelector('#hero-cta').addEventListener('click', event => {
  if (variant === 'light') { searchInput.value = ''; setCategory('phones'); return; }
  event.preventDefault();
  if (variant === 'blue') openDialog(document.querySelector('.chooser-dialog'));
  if (variant === 'peach') openBundle();
});

document.addEventListener('click', event => {
  const target = event.target.closest('button, a');
  if (!target) return;
  if (target.hasAttribute('data-product')) { openProduct(target.dataset.product); return; }
  if (target.hasAttribute('data-all-catalog')) { searchInput.value = ''; sortSelect.value = 'default'; setCategory('all'); closeMenu(); return; }
  if (target.hasAttribute('data-category')) { setCategory(target.dataset.category); return; }
  if (target.hasAttribute('data-category-link')) { searchInput.value = ''; setCategory(target.dataset.categoryLink); closeMenu(); return; }
  if (target.hasAttribute('data-prices')) { searchInput.value = ''; sortSelect.value = 'price-asc'; setCategory('all'); closeMenu(); return; }
  if (target.hasAttribute('data-reset')) { searchInput.value = ''; sortSelect.value = 'default'; setCategory('all'); searchInput.focus(); return; }
  if (target.hasAttribute('data-cart')) { openCart(); return; }
  if (target.hasAttribute('data-close')) { target.closest('dialog')?.close(); return; }
  if (target.hasAttribute('data-option') && detailProduct) {
    const optionIndex = Number(target.dataset.option);
    if (!detailProduct.options[optionIndex]) return;
    detailOption = optionIndex;
    document.querySelectorAll('[data-option]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.option) === detailOption)));
    document.querySelector('.detail-price').textContent = money(detailProduct.options[detailOption].price);
    document.querySelector('.detail-feedback').textContent = '';
    return;
  }
  if (target.hasAttribute('data-add') && detailProduct) {
    if (addToCart(detailProduct.id, detailOption)) document.querySelector('.detail-feedback').textContent = `${detailProduct.name}, ${detailProduct.options[detailOption].label} добавлен в корзину` + (lastPersistenceSucceeded ? '' : '. Браузер не сохранил корзину. Она доступна до закрытия страницы.');
    return;
  }
  if (target.hasAttribute('data-quantity')) { changeQuantity(target.dataset.quantity, Number(target.dataset.delta)); return; }
  if (target.hasAttribute('data-remove')) { removeItem(target.dataset.remove); return; }
  if (target.hasAttribute('data-download')) { downloadCart(); return; }
  if (target.hasAttribute('data-browse')) {
    target.closest('dialog').close();
    searchInput.value = ''; setCategory('all');
    requestAnimationFrame(() => { document.querySelector('#catalog').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); searchInput.focus({ preventScroll: true }); });
    return;
  }
  if (target.hasAttribute('data-add-bundle')) {
    let added = 0;
    for (const product of bundleProducts()) if (addToCart(product.id, 0, 1, true)) added++;
    if (added) { openCart(); notify('Комплект добавлен в корзину'); }
  }
});
document.addEventListener('click', event => { if (!mobileMenu.hidden && !event.target.closest('.site-header')) closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); });
window.addEventListener('storage', event => { if (event.key === CART_KEY) { cart = readCart(); updateCartCount(); if (document.querySelector('.cart-dialog').open) renderCart(); } });
renderCatalog();
updateCartCount();
