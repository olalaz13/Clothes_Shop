// ================== GLOBAL ==================
const grid = document.getElementById('grid');
const countTxt = document.getElementById('countTxt');
const categoriesEl = document.getElementById('categories');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const cartCount = document.getElementById('cartCount');
const mobileMenu = document.getElementById('mobileMenu');
const desktopHeader = document.getElementById('desktopHeaderRight');

let activeCat = 'All';
let favorites = [];
let cart = [];

// ================== SAMPLE PRODUCTS ==================
const products = [
  { id: 1, title: 'Linen Shirt', price: 49, cat: 'Shirts', img: 'https://th.bing.com/th/id/OIP.45FSceBlhojQFEIv3utYkAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'Lightweight linen shirt — perfect for summer.' },
  { id: 2, title: 'Classic Tee', price: 19, cat: 'T-Shirts', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop', desc: 'Soft cotton t-shirt with a relaxed fit.' },
  { id: 3, title: 'Denim Jacket', price: 89, cat: 'Jackets', img: 'img/assets_task_01k5zjz5gze0xaf00smjmrrtdj_1758775483_img_0.webp', desc: 'Timeless denim jacket with contrast stitching.' },
  { id: 4, title: 'Sport Shorts', price: 29, cat: 'Shorts', img: 'https://th.bing.com/th/id/OIP.8TflCd8Tm4FxGm0CPbE0vgHaHa?w=210&h=210&c=7&r=0&o=7&rm=3', desc: 'Breathable shorts for everyday activity.' },
  { id: 5, title: 'Summer Dress', price: 69, cat: 'Dresses', img: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200&auto=format&fit=crop', desc: 'Flowy dress made from viscose blend.' },
  { id: 6, title: 'Hooded Sweatshirt', price: 59, cat: 'Sweatshirts', img: 'img/assets_task_01k5zjxr1qfpaahfypmq9tgb5h_1758775432_img_0.webp', desc: 'Cozy hoodie with soft inner lining.' },
  { id: 7, title: 'Chino Pants', price: 54, cat: 'Pants', img: 'https://th.bing.com/th/id/OIP.8mkxqa1lETx5srC9oaWjLgHaKu?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'Smart-casual chinos, straight fit.' },
  { id: 8, title: 'Canvas Sneakers', price: 79, cat: 'Shoes', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&auto=format&fit=crop', desc: 'Everyday sneakers with rubber sole.' }
];

// ================== CART LOCALSTORAGE ==================
function loadCart() {
  const user = localStorage.getItem("username");
  if (!user) return [];
  const data = localStorage.getItem(`cart_${user}`);
  return data ? JSON.parse(data) : [];
}

function saveCart() {
  const user = localStorage.getItem("username");
  if (!user) return;
  localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
}

cart = loadCart();

// ================== CATEGORIES ==================
function uniqueCats() {
  const cats = new Set(products.map(p => p.cat));
  return ['All', ...cats];
}

function renderCats() {
  categoriesEl.innerHTML = '';
  uniqueCats().forEach(c => {
    const el = document.createElement('button');
    el.className = 'chip' + (c === activeCat ? ' active' : '');
    el.textContent = c;
    el.onclick = () => { activeCat = c; render(); renderCats(); }
    categoriesEl.appendChild(el);
  });
}

// ================== GRID ==================
function render() {
  let q = searchInput.value.trim().toLowerCase();
  let arr = products.filter(p => (activeCat === 'All' || p.cat === activeCat) &&
    (p.title.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)));

  // sort
  const sort = sortSelect.value;
  if (sort === 'asc') arr.sort((a, b) => a.price - b.price);
  if (sort === 'desc') arr.sort((a, b) => b.price - a.price);

  grid.innerHTML = '';
  arr.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')" role="img" aria-label="${p.title}"></div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">${p.title}</div>
            <div class="muted" style="font-size:13px">${p.cat}</div>
          </div>
          <div class="price">$${p.price}</div>
        </div>
        <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
          <div class="muted" style="font-size:13px">Quick view for details</div>
          <div class="actions">
            <button class="outline" onclick="quickView(${p.id})">Quick view</button>
            <button class="add" onclick="addToCart(${p.id})">Add</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  countTxt.textContent = ` — ${arr.length} items`;
}

// ================== MODAL ==================
function quickView(id) {
  const p = products.find(x => x.id === id);
  document.getElementById('mThumb').style.backgroundImage = `url(${p.img})`;
  document.getElementById('mTitle').textContent = p.title;
  document.getElementById('mCat').textContent = p.cat;
  document.getElementById('mPrice').textContent = `$${p.price}`;
  document.getElementById('mDesc').textContent = p.desc;
  document.getElementById('modal').classList.add('open');
  document.getElementById('addCartModal').dataset.id = id;
}

document.getElementById('closeModal').onclick = () => document.getElementById('modal').classList.remove('open');
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') document.getElementById('modal').classList.remove('open'); });

// ================== CART ==================
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const found = cart.find(c => c.id === id);
  if (found) found.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`Đã thêm <b>${p.title}</b> vào giỏ hàng!`);
// ================== TOAST ==================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
}

document.getElementById('addCartModal').onclick = function () {
  addToCart(Number(this.dataset.id));
  document.getElementById('modal').classList;
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = totalItems;
  renderCartPanel();
  updateMobileCartCount();
  updateDesktopCartCount();
}

// ================== CART PANEL ==================
const cartPanel = document.createElement('div');
cartPanel.id = 'cartPanel';
cartPanel.style.cssText = 'position:fixed;top:0;right:-400px;width:360px;height:100%;background:#fff;box-shadow:-2px 0 6px rgba(0,0,0,.15);transition:.3s;padding:16px;overflow:auto;z-index:2000';
cartPanel.innerHTML = `
  <h2 style="margin:0 0 16px">Your Cart</h2>
  <div id="cartItems"></div>
  <div id="cartTotal" style="margin-top:16px;font-weight:700"></div>
  <button id="closeCart" style="margin-top:20px;padding:8px 12px;border:none;background:#333;color:#fff;border-radius:6px;cursor:pointer">Close</button>
`;
document.body.appendChild(cartPanel);

document.getElementById('cartBtn').onclick = () => { cartPanel.style.right = cartPanel.style.right === '0px' ? '-400px' : '0px'; };
document.getElementById('closeCart').onclick = () => cartPanel.style.right = '-400px';

function renderCartPanel() {
  const itemsEl = document.getElementById('cartItems');
  itemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.qty * item.price;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:8px 0;padding:6px;border-bottom:1px solid #ddd';
    row.innerHTML = `<div><b>${item.title}</b><div class='muted'>Qty: ${item.qty}</div></div>
      <div>
        <span>$${item.price * item.qty}</span>
        <button onclick="removeFromCart(${item.id})" style="margin-left:10px;border:none;background:#e74c3c;color:#fff;padding:2px 6px;border-radius:4px;cursor:pointer">x</button>
      </div>`;
    itemsEl.appendChild(row);
  });
  document.getElementById('cartTotal').textContent = `Total: $${total}`;
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

// ================== FAVORITE ==================
const favBtn = document.getElementById("favBtn");
favBtn.addEventListener("click", () => {
  const title = document.getElementById('mTitle').textContent;
  if (favorites.includes(title)) {
    favorites = favorites.filter(f => f !== title);
    favBtn.textContent = "❤ Favorite";
    alert(`${title} removed from favorites`);
  } else {
    favorites.push(title);
    favBtn.textContent = "★ Favorited";
    alert(`${title} added to favorites`);
  }
});

// ================== SEARCH & SORT ==================
searchInput.addEventListener('input', () => render());
sortSelect.addEventListener('change', () => render());

// ================== MOBILE MENU ==================
const hamburgerBtn = document.getElementById('hamburgerBtn');
hamburgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));

function renderMobileMenu() {
  const user = localStorage.getItem('username');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  mobileMenu.innerHTML = `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
          <li><a href="#">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
      </ul>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
          ${user
      ? `<span>👋 Welcome, <a href="#">${user}</a></span>
               <button id="logoutMobileBtn" class="btn">Logout</button>
               <button id="cartMobileBtn" class="btn">🛒 Cart <span id="cartCountMobile" style="color: #000;" class="badge">${totalItems}</span></button>`
      : `<button id="signinMobileBtn" class="btn">Sign in</button>`}
      </div>
  `;

  const logoutBtn = document.getElementById('logoutMobileBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => { localStorage.removeItem('username'); renderMobileMenu(); renderDesktopHeader(); location.reload(); });
  }

  const signinBtn = document.getElementById('signinMobileBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      const name = prompt("Enter username:");
      if (name) {
        localStorage.setItem('username', name);
        renderMobileMenu();
        renderDesktopHeader();
      }
      mobileMenu.classList.remove('open');
    });
  }

  const cartBtnMobile = document.getElementById('cartMobileBtn');
  if (cartBtnMobile) {
    cartBtnMobile.addEventListener('click', () => { cartPanel.style.right = cartPanel.style.right === '0px' ? '-400px' : '0px'; mobileMenu.classList.remove('open'); });
  }
}

function updateMobileCartCount() {
  const el = document.getElementById('cartCountMobile');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ================== DESKTOP HEADER ==================
function renderDesktopHeader() {
  const user = localStorage.getItem('username');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  desktopHeader.innerHTML = user
    ? `<span>👋 Welcome, <a href="#">${user}</a></span>
       <button id="logoutDesktopBtn" class="btn">Logout</button>
       <button id="cartDesktopBtn" class="btn">🛒 Cart <span id="cartCountDesktop" style="color: #000;" class="badge">${totalItems}</span></button>`
    : `<button id="signinDesktopBtn" class="btn">Sign in</button>`;

  const logoutBtn = document.getElementById('logoutDesktopBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('username');

      // Reset về HTML gốc
      desktopHeader.innerHTML = `
      <button class="btn" onclick="window.location.href='signin.html'">Sign in</button>
      <button class="cart-btn" id="cartBtn">
        <span class="cart-icon">
          🛒
        </span>
        <span class="cart-text">Cart</span>
        <span id="cartCount" class="badge">${cart.reduce((s, i) => s + i.qty, 0)}</span>
      </button>
    `;

      // Gắn lại sự kiện cho nút Cart
      const cartBtn = document.getElementById('cartBtn');
      if (cartBtn) {
        cartBtn.addEventListener('click', () => {
          cartPanel.style.right = cartPanel.style.right === '0px' ? '-400px' : '0px';
        });
      }

      // Cập nhật mobile menu
      renderMobileMenu();
    });
  }


  const signinBtn = document.getElementById('signinDesktopBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      const name = prompt("Enter username:");
      if (name) {
        localStorage.setItem('username', name);
        renderDesktopHeader();
        renderMobileMenu();
      }
    });
  }

  const cartBtn = document.getElementById('cartDesktopBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      cartPanel.style.right = cartPanel.style.right === '0px' ? '-400px' : '0px';
    });
  }
}

function updateDesktopCartCount() {
  const el = document.getElementById('cartCountDesktop');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ================== DROPDOWN DYNAMIC DIRECTION ==================

const select = document.getElementById("sizeSelect");
const wrapper = document.getElementById("sizeDropdown");

select.addEventListener("click", () => {
  const rect = select.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownHeight = 500;

  if (spaceBelow < dropdownHeight) {
    wrapper.classList.add("dropup");
  } else {
    wrapper.classList.remove("dropup");
  }
});


// ================== INIT ==================
renderCats();
render();
updateCartUI();
renderMobileMenu();
renderDesktopHeader();
