let lastCheckoutAmount = 0;
let lastCheckoutItems = [];

const cart = [];
let purchasedCount = 0;
let toastTimer = null;

const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

const cartList = document.getElementById("cartList");
const headerCartCount = document.getElementById("headerCartCount");
const selectedCount = document.getElementById("selectedCount");
const modalSelectedCount = document.getElementById("modalSelectedCount");
const grandTotal = document.getElementById("grandTotal");
const modalGrandTotal = document.getElementById("modalGrandTotal");

const clearBtn = document.getElementById("clearBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutMessage = document.getElementById("checkoutMessage");
const checkoutMessageContent = document.getElementById("checkoutMessageContent");

const openCartButton = document.getElementById("openCartButton");
const closeCartButton = document.getElementById("closeCartButton");
const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");

const cartModal = document.getElementById("cartModal");

function formatPrice(value) {
  return value.toLocaleString("ko-KR") + "원";
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  headerCartCount.textContent = cart.length;
  selectedCount.textContent = cart.length + "개";
  modalSelectedCount.textContent = cart.length + "개";

  grandTotal.textContent = formatPrice(getTotal());
  modalGrandTotal.textContent = formatPrice(getTotal());

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        장바구니가 비어 있어요. 새로운 상품으로 채워주세요.
      </div>
    `;
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-sub">캠페인 선택 시뮬레이션</div>
      </div>
      <div class="cart-item-price">
        ${formatPrice(item.price)}
      </div>
    </div>
  `).join("");
}

function addProductToCart(card) {
  const item = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.dataset.image,
  };

  cart.push(item);
  checkoutMessage.classList.remove("is-show");
  renderCart();
}

function openCartModal() {
  cartModal.classList.add("is-open");
  cartModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCartModal() {
  cartModal.classList.remove("is-open");
  cartModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showCheckoutMessage(message) {
  checkoutMessageContent.textContent = message;
  checkoutMessage.classList.add("is-show");
}

function setupCartEvents() {
  document.querySelectorAll(".product-card").forEach(card => {
    const button = card.querySelector(".add-btn");

    if (!button) return;

    button.addEventListener("click", () => {
      addProductToCart(card);
      showToast("상품을 장바구니에 담았습니다.");
    });
  });

  clearBtn.addEventListener("click", () => {
    cart.length = 0;
    checkoutMessage.classList.remove("is-show");
    renderCart();
  });

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showCheckoutMessage("결제할 상품이 없어요. 먼저 상품을 담아주세요.");
      return;
    }

    purchasedCount += cart.length;

    const total = getTotal();
    const count = cart.length;

    lastCheckoutAmount = total;
    lastCheckoutItems = cart.map(item => item.name);

    cart.length = 0;

    closeCartModal();

    showCheckoutMessage(
`환경을 위한 선택에 동참해주셔서 감사합니다.
총 ${count}개의 상품을 ${formatPrice(total)}만큼 선택했어요.
지금까지 누적 ${purchasedCount}개의 선택이 이어졌습니다.
당신의 선택이 더 오래 입는 문화를 만듭니다.`
    );

    renderCart();
  });

  openCartButton.addEventListener("click", openCartModal);
  closeCartButton.addEventListener("click", closeCartModal);

  cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });

  checkoutCloseBtn.addEventListener("click", event => {
  event.preventDefault();

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdmxSheTuVGWpXg1VC1zOUWDbNnlE4RgwT5wCCnJ6qfb3f1SA/viewform";

  const url =
    `${formUrl}?usp=pp_url` +
    `&entry.1579233342=${encodeURIComponent(lastCheckoutAmount)}` +
    `&entry.1956683407=${encodeURIComponent(lastCheckoutItems.length)}` +
    `&entry.1605307871=${encodeURIComponent(lastCheckoutItems.join(", "))}`;

  window.open(url, "_blank");

  checkoutMessage.classList.remove("is-show");
  document.body.style.overflow = "";
});

  window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCartModal();
      checkoutMessage.classList.remove("is-show");
      document.body.style.overflow = "";
    }
  });
}

const storySection = document.querySelector(".story-section");
const storyText = document.getElementById("storyText");

function setupStoryText() {
  if (!storySection || !storyText) return;

  const storyOriginalText = storyText.textContent.trim();

  storyText.innerHTML = "";

  Array.from(storyOriginalText).forEach(char => {
    const span = document.createElement("span");
    span.className = "story-char";
    span.textContent = char === " " ? "\u00A0" : char;
    storyText.appendChild(span);
  });
}

function updateStoryOpacity() {
  if (!storySection || !storyText) return;

  const rect = storySection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const sectionEnd = rect.height - windowHeight;
  const chars = storyText.querySelectorAll(".story-char");

  if (sectionEnd <= 0) {
    chars.forEach(char => char.classList.add("is-active"));
    return;
  }

  const scrolled = Math.min(Math.max(-rect.top, 0), sectionEnd);
  const progress = scrolled / sectionEnd;
  const activeCount = Math.floor(chars.length * progress);

  chars.forEach((char, index) => {
    char.classList.toggle("is-active", index < activeCount);
  });
}

setupCartEvents();
setupStoryText();

window.addEventListener("scroll", updateStoryOpacity);
window.addEventListener("resize", updateStoryOpacity);

renderCart();
updateStoryOpacity();
