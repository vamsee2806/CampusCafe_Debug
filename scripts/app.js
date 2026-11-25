const menuGrid = document.getElementById("menu-grid");
const cartList = document.getElementById("cart-list");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartCountEl = document.getElementById("cart-count");
const cartMsgEl = document.getElementById("cart-msg");
const checkoutBtn = document.getElementById("checkout-btn");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let cart = JSON.parse(localStorage.getItem("campus_cart")) || [];
cart = cart.map((item) => ({
  ...item,
  price: Number(item.price),
  qty: Number(item.qty) || 1
}));

let activeCategory = "all";

function renderMenu(items) {
  menuGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="card-header">
        <span class="category-tag">${item.category}</span>
        <span class="price">₹${item.price}</span>
      </div>
      <h3>${item.name}</h3>
      <p style="font-size: 0.85rem; color: #6b7280;">${item.description}</p>
      <button class="btn btn-primary add-btn" data-id="${item.id}">Add to Cart</button>
    `;
    menuGrid.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function applyMenuFilters() {
  const searchText = searchInput.value.trim().toLowerCase();
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
  renderMenu(filteredItems);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyMenuFilters();
  });
});

searchInput.addEventListener("input", applyMenuFilters);

function addToCart(itemId) {
  const found = MENU_ITEMS.find((item) => item.id === itemId);
  if (!found) return;

  const existing = cart.find((item) => item.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: found.id,
      name: found.name,
      price: Number(found.price),
      qty: 1
    });
  }

  cartMsgEl.textContent = "";
  saveCart();
  renderCart();
}

function changeQuantity(itemId, change) {
  const item = cart.find((cartItem) => cartItem.id === itemId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== itemId);
  }

  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("campus_cart", JSON.stringify(cart));
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = '<li class="empty-state">Your cart is empty.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${item.name} (x${item.qty})</span>
        <div class="qty-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name}">+</button>
        </div>
        <span>₹${Number(item.price) * item.qty}</span>
      `;
      cartList.appendChild(li);
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);
  cartSubtotalEl.textContent = subtotal;
  cartCountEl.textContent = totalQuantity;

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const change = button.dataset.action === "increase" ? 1 : -1;
      changeQuantity(Number(button.dataset.id), change);
    });
  });
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    cartMsgEl.textContent = "Your cart is empty. Add an item before checkout.";
    return;
  }

  cartMsgEl.textContent = "";
  saveCart();
  window.location.href = "pages/checkout.html";
});

renderMenu(MENU_ITEMS);
renderCart();
