// Initialize navbar functionality for About page
document.addEventListener("DOMContentLoaded", function () {
    // Highlight current page in menu
    const currentPage = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach((item) => {
        if (item.getAttribute("href") === currentPage) {
            item.style.color = "var(--accent)";
            item.style.fontWeight = "600";
        }
    });
});
// ================== MOBILE FILTERS TOGGLE ==================
const toggleFiltersBtn = document.getElementById('toggleFilters');
const filtersOverlay = document.getElementById('filtersOverlay');
const shopSidebar = document.querySelector('.shop-sidebar');

// Hàm mở sidebar
const openSidebar = () => {
    shopSidebar.classList.add('open');
    filtersOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Ngăn scroll khi mở filters
};

// Hàm đóng sidebar
const closeSidebar = () => {
    shopSidebar.classList.remove('open');
    filtersOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Cho phép scroll lại
};

// Khi nhấn nút toggle
if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener('click', () => {
        if (shopSidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

// Khi nhấn vào overlay cũng đóng sidebar
if (filtersOverlay) {
    filtersOverlay.addEventListener('click', closeSidebar);
}

// Đóng filters khi chọn category trên mobile
function setupMobileCategoryClicks() {
    const categoryChips = document.querySelectorAll('.chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (window.innerWidth <= 1000) {
                closeSidebar();
            }
        });
    });
}

// Gọi hàm này sau khi render categories
setupMobileCategoryClicks();

// ================== PRICE FILTER ==================
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");
const applyPrice = document.getElementById("applyPrice");

if (applyPrice) {
    applyPrice.addEventListener("click", () => {
        let min = parseFloat(priceMin.value) || 0;
        let max = parseFloat(priceMax.value) || Infinity;

        // Lọc sản phẩm theo giá
        const filtered = products.filter(p => p.price >= min && p.price <= max &&
            (activeCat === 'All' || p.cat === activeCat) &&
            (p.title.toLowerCase().includes(searchInput.value.trim().toLowerCase()) ||
             p.cat.toLowerCase().includes(searchInput.value.trim().toLowerCase()) ||
             p.desc.toLowerCase().includes(searchInput.value.trim().toLowerCase()))
        );

        renderFiltered(filtered);
        
        // Đóng filters sau khi áp dụng trên mobile
        if (window.innerWidth <= 1000) {
            closeSidebar();
        }
    });
}

// ================== VIEW MODE ==================
const viewGrid = document.getElementById("viewGrid");
const viewList = document.getElementById("viewList");
const gridEl = document.getElementById("grid");

// Mặc định Grid view
if (viewGrid && viewList) {
    viewGrid.addEventListener("click", () => {
        gridEl.classList.remove("list-view");
        gridEl.classList.add("grid-view");
        viewGrid.classList.add("active");
        viewList.classList.remove("active");
    });

    viewList.addEventListener("click", () => {
        gridEl.classList.remove("grid-view");
        gridEl.classList.add("list-view");
        viewList.classList.add("active");
        viewGrid.classList.remove("active");
    });
}

// ================== RENDER FILTERED PRODUCTS ==================
function renderFiltered(arr) {
    if (!grid) return;
    
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

// ================== INIT SHOP PAGE ==================
function initShopPage() {
    // Gọi lại các hàm render từ script.js
    renderCats();
    render();
    updateCartUI();
    renderMobileMenu();
    renderDesktopHeader();
    
    // Thiết lập mobile categories
    setupMobileCategoryClicks();
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', initShopPage);