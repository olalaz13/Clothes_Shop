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

// ================== CART PANEL INITIALIZATION ==================
function initCartPanel() {
    // Chỉ tạo cart panel nếu chưa tồn tại
    if (!document.getElementById('cartPanel')) {
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
        
        // Gắn sự kiện close
        document.getElementById('closeCart').addEventListener('click', () => {
            cartPanel.style.right = '-400px';
        });
        
        return cartPanel;
    }
    return document.getElementById('cartPanel');
}

// ================== CATEGORIES ==================
function uniqueCats() {
  const cats = new Set(products.map(p => p.cat));
  return ['All', ...cats];
}

function renderCats() {
  if (!categoriesEl) return;
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
  if (!grid) return;
  
  let q = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let arr = products.filter(p => (activeCat === 'All' || p.cat === activeCat) &&
    (p.title.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)));

  // sort
  const sort = sortSelect ? sortSelect.value : 'popular';
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

  if (countTxt) {
    countTxt.textContent = ` — ${arr.length} items`;
  }
}

// ================== MODAL ==================
function quickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const mThumb = document.getElementById('mThumb');
  const mTitle = document.getElementById('mTitle');
  const mCat = document.getElementById('mCat');
  const mPrice = document.getElementById('mPrice');
  const mDesc = document.getElementById('mDesc');
  const modal = document.getElementById('modal');
  
  if (mThumb) mThumb.style.backgroundImage = `url(${p.img})`;
  if (mTitle) mTitle.textContent = p.title;
  if (mCat) mCat.textContent = p.cat;
  if (mPrice) mPrice.textContent = `$${p.price}`;
  if (mDesc) mDesc.textContent = p.desc;
  
  const addCartModal = document.getElementById('addCartModal');
  if (addCartModal) addCartModal.dataset.id = id;
  
  if (modal) modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// ================== CART ==================
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const found = cart.find(c => c.id === id);
  if (found) found.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`Đã thêm <b>${p.title}</b> vào giỏ hàng!`);
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (cartCount) cartCount.textContent = totalItems;
  renderCartPanel();
  updateMobileCartCount();
  updateDesktopCartCount();
}

function renderCartPanel() {
  const itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;
  
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
  
  const cartTotal = document.getElementById('cartTotal');
  if (cartTotal) cartTotal.textContent = `Total: $${total}`;
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

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

// ================== FAVORITE ==================
function toggleFavorite() {
  const favBtn = document.getElementById("favBtn");
  const mTitle = document.getElementById('mTitle');
  
  if (!favBtn || !mTitle) return;
  
  const title = mTitle.textContent;
  if (favorites.includes(title)) {
    favorites = favorites.filter(f => f !== title);
    favBtn.textContent = "❤ Favorite";
    alert(`${title} removed from favorites`);
  } else {
    favorites.push(title);
    favBtn.textContent = "★ Favorited";
    alert(`${title} added to favorites`);
  }
}

// ================== SEARCH & SORT ==================
function setupSearchAndSort() {
  if (searchInput) {
    searchInput.addEventListener('input', () => render());
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', () => render());
  }
}

// ================== MOBILE MENU ==================
function renderMobileMenu() {
  if (!mobileMenu) return;
  
  const user = localStorage.getItem('username');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  mobileMenu.innerHTML = `
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
          <li><a href="index.html">Home</a></li>
          <li><a href="shop.html">Shop</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
      </ul>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
          ${user
      ? `<span>👋 Welcome, <a href="user.html">${user}</a></span>
               <button id="logoutMobileBtn" class="btn">Logout</button>
               <button id="cartMobileBtn" class="btn">🛒 Cart <span id="cartCountMobile" style="color: #000;" class="badge">${totalItems}</span></button>`
      : `<button id="signinMobileBtn" class="btn">Sign in</button>`}
      </div>
  `;

  const logoutBtn = document.getElementById('logoutMobileBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => { 
      localStorage.removeItem('username'); 
      renderMobileMenu(); 
      renderDesktopHeader(); 
      location.reload(); 
    });
  }

  const signinBtn = document.getElementById('signinMobileBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      window.location.href = 'signin.html';
    });
  }

  const cartBtnMobile = document.getElementById('cartMobileBtn');
  if (cartBtnMobile) {
    cartBtnMobile.addEventListener('click', () => {
      const panel = initCartPanel();
      panel.style.right = panel.style.right === '0px' ? '-400px' : '0px';
      renderCartPanel();
      mobileMenu.classList.remove('open');
    });
  }
}

function updateMobileCartCount() {
  const el = document.getElementById('cartCountMobile');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ================== DESKTOP HEADER ==================
function renderDesktopHeader() {
  if (!desktopHeader) return;
  
  const user = localStorage.getItem('username');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  desktopHeader.innerHTML = user
    ? `<span>👋 Welcome, <a href="user.html">${user}</a></span>
       <button id="logoutDesktopBtn" class="btn">Logout</button>
       <button id="cartDesktopBtn" class="btn">🛒 Cart <span id="cartCountDesktop" style="color: #000;" class="badge">${totalItems}</span></button>`
    : `<button id="signinDesktopBtn" class="btn">Sign in</button>`;

  const logoutBtn = document.getElementById('logoutDesktopBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('username');
      renderDesktopHeader();
      renderMobileMenu();
      location.reload();
    });
  }

  const signinBtn = document.getElementById('signinDesktopBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      window.location.href = 'signin.html';
    });
  }

  const cartBtn = document.getElementById('cartDesktopBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const panel = initCartPanel();
      panel.style.right = panel.style.right === '0px' ? '-400px' : '0px';
      renderCartPanel();
    });
  }
}

function updateDesktopCartCount() {
  const el = document.getElementById('cartCountDesktop');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ================== CART BUTTON EVENT HANDLER ==================
function setupCartButton() {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const panel = initCartPanel();
      panel.style.right = panel.style.right === '0px' ? '-400px' : '0px';
      renderCartPanel();
    });
  }
}

// ================== MODAL EVENT HANDLERS ==================
function setupModalEvents() {
  const closeModalBtn = document.getElementById('closeModal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', e => { 
      if (e.target.id === 'modal') closeModal(); 
    });
  }

  const addCartModal = document.getElementById('addCartModal');
  if (addCartModal) {
    addCartModal.addEventListener('click', function () {
      addToCart(Number(this.dataset.id));
      closeModal();
    });
  }

  const favBtn = document.getElementById('favBtn');
  if (favBtn) {
    favBtn.addEventListener('click', toggleFavorite);
  }
}

// ================== DROPDOWN DYNAMIC DIRECTION ==================
function setupDropdownDirection() {
  const select = document.getElementById("sizeSelect");
  const wrapper = document.getElementById("sizeDropdown");

  if (select && wrapper) {
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
  }
}

// ================== NAVBAR HIGHLIGHT ==================
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop();
  const menuItems = document.querySelectorAll(".menu a");

  menuItems.forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.style.color = "var(--accent)";
      item.style.fontWeight = "600";
    }
  });
}

// ================== MOBILE MENU TOGGLE ==================
function setupMobileMenuToggle() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  // Close mobile menu when clicking on links
  const mobileMenuLinks = document.querySelectorAll("#mobileMenu a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
    });
  });
}

// ================== INIT ==================
function init() {
  renderCats();
  render();
  updateCartUI();
  renderMobileMenu();
  renderDesktopHeader();
  setupCartButton();
  setupModalEvents();
  setupSearchAndSort();
  setupDropdownDirection();
  highlightCurrentPage();
  setupMobileMenuToggle();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);