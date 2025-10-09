// User Account Functionality
class UserAccount {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'profile';
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.renderUserProfile();
        this.renderOrders();
        this.renderAddresses();
        this.renderWishlist();
    }

    loadUserData() {
        // Get current user from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
            window.location.href = 'signin.html';
            return;
        }

        // Load user data from localStorage
        const userData = localStorage.getItem(`user_${username}`);
        if (userData) {
            this.currentUser = JSON.parse(userData);
        } else {
            // Create default user data
            this.currentUser = {
                username: username,
                firstName: 'Nguyễn Văn',
                lastName: 'A',
                email: `${username}@example.com`,
                phone: '+84 123 456 789',
                birthday: '1990-01-01',
                gender: 'male',
                addresses: [],
                orders: [],
                wishlist: [],
                createdAt: new Date().toISOString()
            };
            this.saveUserData();
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem(`user_${this.currentUser.username}`, JSON.stringify(this.currentUser));
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.id !== 'logoutBtn') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchSection(item.dataset.section);
                });
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Save profile
        document.getElementById('saveProfile').addEventListener('click', () => {
            this.saveProfile();
        });

        // Add address
        document.getElementById('addAddressBtn').addEventListener('click', () => {
            this.addNewAddress();
        });
    }

    switchSection(section) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
    }

    renderUserProfile() {
        if (!this.currentUser) return;

        // Update avatar with first letter of first name
        const firstName = this.currentUser.firstName || 'U';
        document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userEmail').textContent = this.currentUser.email;

        // Update form fields
        document.getElementById('firstName').value = this.currentUser.firstName || '';
        document.getElementById('lastName').value = this.currentUser.lastName || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('phone').value = this.currentUser.phone || '';
        document.getElementById('birthday').value = this.currentUser.birthday || '';

        // Update gender radio
        if (this.currentUser.gender) {
            document.querySelector(`input[name="gender"][value="${this.currentUser.gender}"]`).checked = true;
        }

        // Update stats
        document.getElementById('ordersCount').textContent = this.currentUser.orders?.length || 0;
        document.getElementById('wishlistCount').textContent = this.currentUser.wishlist?.length || 0;
    }

    saveProfile() {
        if (!this.currentUser) return;

        this.currentUser.firstName = document.getElementById('firstName').value;
        this.currentUser.lastName = document.getElementById('lastName').value;
        this.currentUser.email = document.getElementById('email').value;
        this.currentUser.phone = document.getElementById('phone').value;
        this.currentUser.birthday = document.getElementById('birthday').value;

        const genderInput = document.querySelector('input[name="gender"]:checked');
        this.currentUser.gender = genderInput ? genderInput.value : 'male';

        this.saveUserData();
        this.renderUserProfile();

        // Show success message
        this.showToast('Thông tin đã được cập nhật thành công!');
    }

    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        const orders = this.currentUser?.orders || [];

        if (orders.length === 0) {
            ordersList.innerHTML = `
                        <div class="empty-state">
                            <i class="bi bi-bag"></i>
                            <h3>Chưa có đơn hàng</h3>
                            <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                            <a href="shop.html" class="save-btn">Mua Sắm Ngay</a>
                        </div>
                    `;
            return;
        }

        ordersList.innerHTML = orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <div class="order-id">Đơn hàng #${order.id}</div>
                                <div class="order-date">${new Date(order.date).toLocaleDateString('vi-VN')}</div>
                            </div>
                            <div class="order-status status-${order.status}">${this.getStatusText(order.status)}</div>
                        </div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.name}" class="item-image">
                                    <div class="item-name">${item.name}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-footer">
                            <div class="order-total">${this.formatPrice(order.total)}</div>
                            <div class="order-actions">
                                <button class="btn-sm btn-outline">Xem Chi Tiết</button>
                                <button class="btn-sm btn-outline">Mua Lại</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    renderAddresses() {
        const addressesList = document.getElementById('addressesList');
        const addresses = this.currentUser?.addresses || [];

        if (addresses.length === 0) {
            addressesList.innerHTML = `
                        <div class="empty-state">
                            <i class="bi bi-geo-alt"></i>
                            <h3>Chưa có địa chỉ</h3>
                            <p>Thêm địa chỉ giao hàng đầu tiên của bạn</p>
                        </div>
                    `;
            return;
        }

        addressesList.innerHTML = addresses.map(address => `
                    <div class="address-card ${address.default ? 'default' : ''}">
                        <div class="address-header">
                            <h3 class="address-title">${address.title}</h3>
                            ${address.default ? '<span class="default-badge">Mặc định</span>' : ''}
                        </div>
                        <div class="address-details">
                            <div><strong>${address.fullName}</strong></div>
                            <div>${address.phone}</div>
                            <div>${address.street}</div>
                            <div>${address.city}, ${address.district}, ${address.ward}</div>
                        </div>
                        <div class="address-actions">
                            <button class="btn-sm btn-outline">Sửa</button>
                            ${!address.default ? '<button class="btn-sm btn-outline">Đặt mặc định</button>' : ''}
                            <button class="btn-sm btn-outline">Xóa</button>
                        </div>
                    </div>
                `).join('');

        // Add "Add Address" card
        addressesList.innerHTML += `
                    <div class="add-address-card" onclick="userAccount.addNewAddress()">
                        <i class="bi bi-plus-circle"></i>
                        <div>Thêm Địa Chỉ Mới</div>
                    </div>
                `;
    }

    renderWishlist() {
        const wishlistGrid = document.getElementById('wishlistGrid');
        const wishlist = this.currentUser?.wishlist || [];

        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="bi bi-heart"></i>
                            <h3>Danh sách yêu thích trống</h3>
                            <p>Thêm sản phẩm bạn yêu thích vào đây</p>
                            <a href="shop.html" class="save-btn">Khám Phá Sản Phẩm</a>
                        </div>
                    `;
            return;
        }

        wishlistGrid.innerHTML = wishlist.map(item => `
                    <div class="wishlist-item">
                        <button class="wishlist-remove" onclick="userAccount.removeFromWishlist(${item.id})">
                            <i class="bi bi-x"></i>
                        </button>
                        <img src="${item.image}" alt="${item.name}" class="wishlist-image">
                        <div class="wishlist-name">${item.name}</div>
                        <div class="wishlist-price">${this.formatPrice(item.price)}</div>
                        <button class="btn-sm" style="background: var(--accent); color: white; width: 100%;">Thêm Vào Giỏ</button>
                    </div>
                `).join('');
    }

    addNewAddress() {
        // In a real app, this would open a modal or form
        this.showToast('Tính năng thêm địa chỉ mới sẽ được mở');
    }

    removeFromWishlist(itemId) {
        if (!this.currentUser) return;

        this.currentUser.wishlist = this.currentUser.wishlist.filter(item => item.id !== itemId);
        this.saveUserData();
        this.renderWishlist();
        this.renderUserProfile();

        this.showToast('Đã xóa sản phẩm khỏi danh sách yêu thích');
    }

    logout() {
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    }

    getStatusText(status) {
        const statusMap = {
            'delivered': 'Đã giao',
            'pending': 'Đang xử lý',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    showToast(message) {
        // Use existing toast functionality from script.js
        if (window.showToast) {
            window.showToast(message);
        } else {
            alert(message);
        }
    }
}

// Initialize user account when page loads
document.addEventListener('DOMContentLoaded', function () {
    window.userAccount = new UserAccount();

    // Initialize navbar
    if (typeof renderMobileMenu === 'function') {
        renderMobileMenu();
    }

    if (typeof renderDesktopHeader === 'function') {
        renderDesktopHeader();
    }

    // Highlight current page in menu
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
        if (item.getAttribute('href') === 'user.html') {
            item.style.color = 'var(--accent)';
            item.style.fontWeight = '600';
        }
    });
});

