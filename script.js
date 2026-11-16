
const products = [
  { name: "Aurora Gold Ring", price: 1890 },
  { name: "Luna Pendant Necklace", price: 2450 },
  { name: "Solstice Hoop Earrings", price: 1590 },
  { name: "Golden Hour Bracelet", price: 1790 },
  { name: "Celeste Pearl Drops", price: 2150 },
  { name: "Classic Signet Pendant", price: 2690 }
];

const cart = [];

const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

let toastTimer;

// FORMAT PHILIPPINE PESO
function money(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0
  }).format(value);
}

// SHOW NOTIFICATION
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// UPDATE SHOPPING CART
function renderCart() {
  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = quantity;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
  } else {

    cart.forEach((item) => {

      const row = document.createElement("div");
      row.className = "cart-item";

      const details = document.createElement("div");

      details.innerHTML = `
        <strong>${item.name}</strong>
        <small>${item.quantity} × ${money(item.price)}</small>
      `;

      const remove = document.createElement("button");

      remove.type = "button";
      remove.textContent = "Remove";

      remove.setAttribute(
        "aria-label",
        `Remove ${item.name} from bag`
      );

      remove.addEventListener("click", () => {
        removeFromCart(item.name);
      });

      row.append(details, remove);
      cartItems.appendChild(row);

    });
  }

  cartTotal.textContent = money(total);
}

// ADD PRODUCT TO CART
function addToCart(productName) {

  const product = products.find(
    (item) => item.name === productName
  );

  if (!product) return;

  const existing = cart.find(
    (item) => item.name === productName
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();

  showToast(`${productName} added to your bag.`);
}

// REMOVE PRODUCT FROM CART
function removeFromCart(productName) {

  const index = cart.findIndex(
    (item) => item.name === productName
  );

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderCart();
}

// CONNECT ALL BUY BUTTONS
document.querySelectorAll("[data-buy]").forEach((button) => {

  button.addEventListener("click", () => {

    addToCart(button.dataset.buy);

  });

});

// OPEN SHOPPING CART
document.getElementById("cartButton").addEventListener("click", () => {

  cartDialog.showModal();

});

// CLOSE SHOPPING CART
document.getElementById("closeCart").addEventListener("click", () => {

  cartDialog.close();

});

// CHECKOUT BUTTON
document.getElementById("checkoutButton").addEventListener("click", () => {

  showToast("This is a demo store. Checkout is not connected yet.");

  cartDialog.close();

});

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

});

// CLOSE MOBILE MENU AFTER CLICKING A LINK
mainNav.querySelectorAll("a").forEach((link) => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

  });

});

// PRODUCT SEARCH
document.getElementById("searchInput").addEventListener("input", (event) => {

  const query = event.target.value.trim().toLowerCase();

  let visible = 0;

  document.querySelectorAll(".product-card").forEach((card) => {

    const matches =
      card.dataset.name.toLowerCase().includes(query) ||
      card.dataset.category.toLowerCase().includes(query);

    card.hidden = !matches;

    if (matches) {
      visible++;
    }

  });

  let empty = document.getElementById("noSearchResults");

  if (!empty) {

    empty = document.createElement("p");

    empty.id = "noSearchResults";
    empty.className = "demo-note";
    empty.textContent = "No pieces found. Try another search.";

    document.getElementById("productGrid").after(empty);

  }

  empty.hidden = visible !== 0;

});

// CONTACT FORM VALIDATION
const contactForm = document.getElementById("contactForm");

const feedback = document.getElementById("formFeedback");

contactForm.addEventListener("submit", (event) => {

  event.preventDefault();

  feedback.classList.remove("error");

  if (!contactForm.checkValidity()) {

    contactForm.reportValidity();

    feedback.textContent =
      "Please complete all fields with valid information.";

    feedback.classList.add("error");

    return;
  }

  feedback.textContent =
    "Thank you! Your demo message is ready. No message has been sent to a server.";

  contactForm.reset();

});

// INITIALIZE CART
renderCart();
