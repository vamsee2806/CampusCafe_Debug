const checkoutItemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const discountEl = document.getElementById("discount");
const grandTotalEl = document.getElementById("grand-total");

const promoInput = document.getElementById("promo-input");
const applyPromoBtn = document.getElementById("apply-promo-btn");
const promoMsgEl = document.getElementById("promo-msg");

const orderForm = document.getElementById("order-form");
const studentNameInput = document.getElementById("student-name");
const rollNumberInput = document.getElementById("roll-number");
const orderMsgEl = document.getElementById("order-msg");

let cart = JSON.parse(localStorage.getItem("cartItems")) ||
  JSON.parse(localStorage.getItem("campus_cart")) || [];
cart = cart.map((item) => ({
  ...item,
  price: Number(item.price),
  qty: Number(item.qty) || 1
}));
let discountAmount = 0;

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
}

function renderCheckout() {
  checkoutItemsEl.innerHTML = "";

  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = '<li class="empty-state">No items found in your order.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${item.name} × ${item.qty || 1}</span>
        <span>₹${(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
      `;
      checkoutItemsEl.appendChild(li);
    });
  }

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  subtotalEl.textContent = subtotal.toFixed(2);
  taxEl.textContent = tax.toFixed(2);
  discountEl.textContent = discountAmount.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);
}

applyPromoBtn.addEventListener("click", () => {
  const subtotal = calculateSubtotal();
  const code = promoInput.value.trim().toUpperCase();
  discountAmount = 0;

  if (code !== "STUDENT15") {
    promoMsgEl.className = "msg-error";
    promoMsgEl.textContent = "Invalid promo code. Please try again.";
  } else if (subtotal < 150) {
    promoMsgEl.className = "msg-error";
    promoMsgEl.textContent = "STUDENT15 requires a subtotal of ₹150 or more.";
  } else {
    discountAmount = subtotal * 0.15;
    promoMsgEl.className = "msg-success";
    promoMsgEl.textContent = "STUDENT15 applied: 15% discount added.";
  }

  renderCheckout();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const studentName = studentNameInput.value.trim();
  const rollNumber = rollNumberInput.value.trim();

  if (cart.length === 0) {
    orderMsgEl.className = "msg-error";
    orderMsgEl.textContent = "Cannot confirm an empty order. Add items to your cart first.";
    return;
  }

  if (!studentName || !rollNumber) {
    orderMsgEl.className = "msg-error";
    orderMsgEl.textContent = "Please enter both your full name and roll number.";
    return;
  }

  const orderId = "CC-" + Date.now().toString(36).toUpperCase();
  orderMsgEl.className = "msg-success";
  orderMsgEl.textContent = `Order confirmed! Order ID: ${orderId}`;

  cart = [];
  discountAmount = 0;
  localStorage.removeItem("campus_cart");
  localStorage.removeItem("cartItems");
  renderCheckout();
  orderForm.reset();
});

renderCheckout();
