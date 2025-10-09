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

// Initialize cart
cart = loadCart();

// ================== ENHANCED CART PANEL ==================
function initCartPanel() {
    if (!document.getElementById('cartPanel')) {
        const cartPanel = document.createElement('div');
        cartPanel.id = 'cartPanel';
        cartPanel.style.cssText = `
            position: fixed;
            top: 0;
            right: -420px;
            width: 380px;
            height: 100%;
            background: #fff;
            box-shadow: -4px 0 20px rgba(0,0,0,0.15);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            padding: 0;
            overflow: hidden;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', system-ui, sans-serif;
        `;
        
        cartPanel.innerHTML = `
            <div style="padding: 24px; border-bottom: 1px solid #f0f0f0; background: #fafafa;">
                <div style="display: flex; justify-content: between; align-items: center;">
                    <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; color: #333;">Your Shopping Cart</h2>
                    <button id="closeCart" style="margin-left:90px;background: none; border: none; font-size: 30px; cursor: pointer; color: #666; padding: 4px; border-radius: 4px; transition: all 0.2s;">&times;</button>
                </div>
                <div id="cartSummary" style="margin-top: 8px; color: #666; font-size: 0.9rem;"></div>
            </div>
            
            <div id="cartItems" style="flex: 1; overflow-y: auto; padding: 16px;"></div>
            
            <div id="emptyCart" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; color: #999; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 16px;">🛒</div>
                <h3 style="margin: 0 0 8px; color: #666;">Your cart is empty</h3>
                <p style="margin: 0; font-size: 0.9rem;">Add some products to get started</p>
            </div>
            
            <div style="border-top: 1px solid #f0f0f0; padding: 20px; background: #fafafa;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #666;">Subtotal</span>
                    <span id="cartSubtotal" style="font-weight: 600; font-size: 1.1rem;">$0</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.9rem;">
                    <span style="color: #666;">Shipping</span>
                    <span style="color: #27ae60;">Free</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                    <span style="font-weight: 600;">Total</span>
                    <span id="cartTotal" style="font-weight: 700; font-size: 1.3rem; color: #e44d26;">$0</span>
                </div>
                <button id="checkoutBtn" style="width: 100%; padding: 14px; background: #e44d26; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Checkout Now</button>
                <button id="continueShopping" style="width: 100%; padding: 12px; background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; margin-top: 12px; cursor: pointer; transition: all 0.2s;">Continue Shopping</button>
            </div>
        `;
        
        document.body.appendChild(cartPanel);
        
        // Enhanced close button event
        document.getElementById('closeCart').addEventListener('click', () => {
            cartPanel.style.right = '-420px';
            const overlay = document.getElementById('cartOverlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
        });
        
        // Continue shopping button
        document.getElementById('continueShopping').addEventListener('click', () => {
            cartPanel.style.right = '-420px';
            const overlay = document.getElementById('cartOverlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
        });
        
        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            showToast('Proceeding to checkout...');
            // Add checkout logic here
        });
        
        // Close when clicking outside (on overlay)
        const overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        `;
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            cartPanel.style.right = '-420px';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
        
        return cartPanel;
    }
    return document.getElementById('cartPanel');
}

// ================== ENHANCED CART RENDERING ==================
function renderCartPanel() {
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('emptyCart');
    const summaryEl = document.getElementById('cartSummary');
    
    if (!itemsEl || !emptyEl || !summaryEl) return;
    
    // Show/hide empty state
    if (cart.length === 0) {
        itemsEl.style.display = 'none';
        emptyEl.style.display = 'flex';
        summaryEl.textContent = '0 items';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.style.opacity = '0.6';
            checkoutBtn.style.cursor = 'not-allowed';
        }
    } else {
        itemsEl.style.display = 'block';
        emptyEl.style.display = 'none';
        
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        summaryEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }
    }
    
    // Render cart items
    itemsEl.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.qty * item.price;
        subtotal += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.style.cssText = `
            display: flex;
            gap: 12px;
            padding: 16px;
            margin-bottom: 12px;
            background: #fff;
            border-radius: 12px;
            border: 1px solid #f0f0f0;
            transition: all 0.2s;
        `;
        itemEl.innerHTML = `
            <div style="width: 80px; height: 80px; background: #f5f5f5; border-radius: 8px; overflow: hidden;">
                <img src="${products.find(p => p.id === item.id)?.img || ''}" 
                     alt="${item.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600; color: #333;">${item.title}</h4>
                    <span style="font-weight: 700; color: #e44d26;">$${itemTotal}</span>
                </div>
                <p style="margin: 0 0 12px; font-size: 0.85rem; color: #888;">$${item.price} each</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="updateQuantity(${item.id}, ${item.qty - 1})" 
                                style="width: 28px; height: 28px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">−</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.qty}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.qty + 1})" 
                                style="width: 28px; height: 28px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" 
                            style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; transition: all 0.2s;">Remove</button>
                </div>
            </div>
        `;
        itemsEl.appendChild(itemEl);
    });
    
    // Update totals
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal}`;
    if (cartTotal) cartTotal.textContent = `$${subtotal}`;
}

// ================== ENHANCED QUANTITY MANAGEMENT ==================
function updateQuantity(id, newQty) {
    if (newQty < 1) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = newQty;
        saveCart();
        updateCartUI();
        showToast(`Quantity updated`);
    }
}

// ================== ENHANCED CART OPEN FUNCTION ==================
function openCartPanel() {
    const panel = initCartPanel();
    const overlay = document.getElementById('cartOverlay');
    
    panel.style.right = '0';
    if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }
    renderCartPanel();
}

// ================== ENHANCED TOAST NOTIFICATION ==================
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-size: 0.9rem;
            max-width: 300px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3000);
}

// ================== UPDATE CART UI ==================
function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    renderCartPanel();
    updateMobileCartCount();
    updateDesktopCartCount();
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

// ================== CART FUNCTIONS ==================
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  
  const found = cart.find(c => c.id === id);
  if (found) found.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`Added <b>${p.title}</b> to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
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
    cartBtnMobile.addEventListener('click', openCartPanel);
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
    cartBtn.addEventListener('click', openCartPanel);
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
    cartBtn.addEventListener('click', openCartPanel);
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