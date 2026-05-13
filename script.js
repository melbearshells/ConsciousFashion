const cart = [];
let purchasedCount = 0;

const cartList = document.getElementById('cartList');
const headerCartCount = document.getElementById('headerCartCount');
const selectedCount = document.getElementById('selectedCount');
const modalSelectedCount = document.getElementById('modalSelectedCount');
const grandTotal = document.getElementById('grandTotal');
const modalGrandTotal = document.getElementById('modalGrandTotal');

const clearBtn = document.getElementById('clearBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutMessage = document.getElementById('checkoutMessage');
const checkoutMessageContent = document.getElementById('checkoutMessageContent');

const openCartButton = document.getElementById('openCartButton');
const closeCartButton = document.getElementById('closeCartButton');
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');

const cartModal = document.getElementById('cartModal');

function formatPrice(value) {
  return value.toLocaleString('ko-KR') + '원';
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  headerCartCount.textContent = cart.length;
  selectedCount.textContent = cart.length + '개';
  modalSelectedCount.textContent = cart.length + '개';

  grandTotal.textContent = formatPrice(getTotal());
  modalGrandTotal.textContent = formatPrice(getTotal());

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        장바구니가 비어 있어요.
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
        <div class="cart-item-sub">
          캠페인 선택 시뮬레이션
        </div>
      </div>

      <div class="cart-item-price">
        ${formatPrice(item.price)}
      </div>
    </div>
  `).join('');
}

document.querySelectorAll('.product-card').forEach(card => {
  const button = card.querySelector('.add-btn');

  button.addEventListener('click', () => {
    const item = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
    };

    cart.push(item);
    renderCart();
  });
});

clearBtn.addEventListener('click', () => {
  cart.length = 0;
  renderCart();
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;

  purchasedCount += cart.length;

  const total = getTotal();
  const count = cart.length;

  cart.length = 0;

  checkoutMessage.classList.add('is-show');

  checkoutMessageContent.textContent =
`환경을 위한 선택에 동참해주셔서 감사합니다.
총 ${count}개의 상품을 ${formatPrice(total)}만큼 선택했어요.
지금까지 누적 ${purchasedCount}개의 선택이 이어졌습니다.
당신의 선택이 더 오래 입는 문화를 만듭니다.`;

  closeCartModal();
  renderCart();
});

function openCartModal() {
  cartModal.classList.add('is-open');
}

function closeCartModal() {
  cartModal.classList.remove('is-open');
}

openCartButton.addEventListener('click', openCartModal);
closeCartButton.addEventListener('click', closeCartModal);

checkoutCloseBtn.addEventListener('click', () => {
  checkoutMessage.classList.remove('is-show');
});

const storySection = document.querySelector('.story-section');
const storyText = document.getElementById('storyText');

const storyOriginalText = storyText.textContent.trim();

storyText.innerHTML = '';

Array.from(storyOriginalText).forEach(char => {
  const span = document.createElement('span');

  span.className = 'story-char';
  span.textContent = char === ' ' ? '\u00A0' : char;

  storyText.appendChild(span);
});

function updateStoryOpacity() {
  const rect = storySection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const sectionEnd = rect.height - windowHeight;

  const chars = storyText.querySelectorAll('.story-char');

  const scrolled = Math.min(
    Math.max(-rect.top, 0),
    sectionEnd
  );

  const progress = scrolled / sectionEnd;

  const activeCount = Math.floor(chars.length * progress);

  chars.forEach((char, index) => {
    char.classList.toggle(
      'is-active',
      index < activeCount
    );
  });
}

window.addEventListener('scroll', updateStoryOpacity);

renderCart();
updateStoryOpacity();