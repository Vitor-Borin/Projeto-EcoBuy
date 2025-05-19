// cart.js refatorado

document.addEventListener("DOMContentLoaded", () => {
  // Carregar itens do carrinho
  loadCartItems()

  // Adicionar event listeners para ações do carrinho
  setupCartActions()

  // Configurar aplicação de cupom
  setupCouponCode()

  // Configurar cálculo de frete
  setupShippingCalculator()
  
  // Carregar produtos relacionados (apenas 3)
  loadRelatedProducts()
})

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const cartItemsContainer = document.querySelector(".cart-items") || document.createElement("div")

  if (!cartItemsContainer) return

  // Limpar container
  cartItemsContainer.innerHTML = ""

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos ao seu carrinho para continuar comprando.</p>
        <a href="index.html" class="btn btn-outline">Continuar comprando</a>
      </div>
    `
    updateCartSummary(0)
    return
  }

  // Adicionar cada item ao DOM
  cart.forEach((item) => {
    const cartItemHTML = `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image || './assets/img/placeholder.jpg'}" alt="${item.name || ''}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-info">
            <h3>${item.name || ''}</h3>
            <div class="cart-item-actions">
              <button class="cart-action remove-item">Excluir</button>
            </div>
          </div>
          <div class="cart-item-bottom">
            <div class="quantity-selector">
              <select class="quantity-select">
                ${generateQuantityOptions(item.quantity)}
              </select>
            </div>
            <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `

    cartItemsContainer.innerHTML += cartItemHTML
  })

  // Calcular e atualizar o resumo do carrinho
  updateCartSummary()
}

function generateQuantityOptions(selected) {
  let options = ""
  for (let i = 1; i <= 10; i++) {
    options += `<option value="${i}" ${i === selected ? "selected" : ""}>${i} un.</option>`
  }
  return options
}

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = Number(localStorage.getItem("selectedShipping") || 0)
  const total = subtotal + shipping
  const subtotalEl = document.querySelector('.cart-summary-subtotal')
  const shippingEl = document.querySelector('.cart-summary-shipping')
  const totalEl = document.querySelector('.cart-summary-total')
  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`
  if (shippingEl) shippingEl.textContent = shipping > 0 ? `R$ ${shipping.toFixed(2)}` : 'GRÁTIS'
  if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`
}

function setupCartActions() {
  // Event listener para botão de checkout
  const checkoutButton = document.querySelector(".btn-checkout")
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      // Verificar se há itens no carrinho
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")

      if (cart.length === 0) {
        showNotification("Seu carrinho está vazio. Adicione produtos para continuar.")
        return
      }

      // Simular checkout - em uma aplicação real, isso enviaria para uma página de pagamento
      window.location.href = "checkout.html"
    })
  }

  // Event delegation para ações de itens do carrinho
  const cartItemsContainer = document.querySelector(".cart-items") || document.createElement("div");
  cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target;
    const cartItem = target.closest(".cart-item");
    if (!cartItem) return;
    const itemId = cartItem.getAttribute("data-id");
    // Remover item
    if (target.classList.contains("remove-item")) {
      removeCartItem(itemId);
      cartItem.remove();
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length === 0) {
        loadCartItems();
      } else {
        updateCartSummary();
      }
    }
        // Código para "Salvar para depois" removido
    // Comprar (ir para página do produto)
    if (target.classList.contains("cart-action") && target.textContent.trim().toLowerCase() === "comprar") {
      window.location.href = `produtos.html?id=${itemId}`;
    }
  });

  // Event listener para mudanças na quantidade
  cartItemsContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-select")) {
      const cartItem = e.target.closest(".cart-item")
      const itemId = cartItem.getAttribute("data-id")
      const newQuantity = Number.parseInt(e.target.value)
      updateCartItemQuantity(itemId, newQuantity)
      // Atualizar preço exibido
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const item = cart.find((i) => i.id === itemId)
      if (item) {
        cartItem.querySelector(".cart-item-price").textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`
        // Atualizar resumo do carrinho
        updateCartSummary()
      }
    }
  })
}

function setupCouponCode() {
  const couponInput = document.querySelector(".coupon-input input")

  if (!couponInput) return

  // Verificar se já há um cupom aplicado
  const appliedCoupon = localStorage.getItem("appliedCoupon")

  if (appliedCoupon) {
    couponInput.value = appliedCoupon
    couponInput.disabled = true

    // Adicionar botão para remover cupom
    const couponContainer = couponInput.parentElement

    if (!couponContainer.querySelector(".remove-coupon")) {
      const removeButton = document.createElement("button")
      removeButton.className = "remove-coupon"
      removeButton.textContent = "✕"
      removeButton.title = "Remover cupom"

      couponContainer.appendChild(removeButton)

      // Adicionar event listener para remover cupom
      removeButton.addEventListener("click", () => {
        localStorage.removeItem("appliedCoupon")
        couponInput.value = ""
        couponInput.disabled = false
        removeButton.remove()

        // Atualizar resumo do carrinho
        updateCartSummary()

        showNotification("Cupom removido com sucesso!")
      })
    }
  }

  // Adicionar event listener para aplicar cupom
  couponInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      applyCoupon()
    }
  })

  // Adicionar botão para aplicar cupom
  const couponContainer = couponInput.parentElement

  if (!couponContainer.querySelector(".apply-coupon") && !appliedCoupon) {
    const applyButton = document.createElement("button")
    applyButton.className = "apply-coupon"
    applyButton.textContent = "Aplicar"

    couponContainer.appendChild(applyButton)

    // Adicionar event listener para aplicar cupom
    applyButton.addEventListener("click", () => {
      applyCoupon()
    })
  }
}

function applyCoupon() {
  const couponInput = document.querySelector(".coupon-input input")

  if (!couponInput) return

  const couponCode = couponInput.value.trim().toUpperCase()

  if (!couponCode) {
    showNotification("Por favor, digite um código de cupom.")
    return
  }

  // Verificar se o cupom é válido (neste caso, apenas "ECO" é válido)
  if (couponCode === "ECO") {
    localStorage.setItem("appliedCoupon", couponCode)

    // Desabilitar input e adicionar botão para remover cupom
    couponInput.disabled = true

    const couponContainer = couponInput.parentElement
    const applyButton = couponContainer.querySelector(".apply-coupon")

    if (applyButton) {
      applyButton.remove()
    }

    if (!couponContainer.querySelector(".remove-coupon")) {
      const removeButton = document.createElement("button")
      removeButton.className = "remove-coupon"
      removeButton.textContent = "✕"
      removeButton.title = "Remover cupom"

      couponContainer.appendChild(removeButton)

      // Adicionar event listener para remover cupom
      removeButton.addEventListener("click", () => {
        localStorage.removeItem("appliedCoupon")
        couponInput.value = ""
        couponInput.disabled = false
        removeButton.remove()

        // Adicionar botão para aplicar cupom
        if (!couponContainer.querySelector(".apply-coupon")) {
          const applyButton = document.createElement("button")
          applyButton.className = "apply-coupon"
          applyButton.textContent = "Aplicar"

          couponContainer.appendChild(applyButton)

          // Adicionar event listener para aplicar cupom
          applyButton.addEventListener("click", () => {
            applyCoupon()
          })
        }

        // Atualizar resumo do carrinho
        updateCartSummary()

        showNotification("Cupom removido com sucesso!")
      })
    }

    // Atualizar resumo do carrinho
    updateCartSummary()

    showNotification("Cupom aplicado com sucesso! Você ganhou 3% de desconto.")
  } else {
    showNotification("Cupom inválido. Tente novamente.")
  }
}

function setupShippingCalculator() {
  // Adicionar campo de CEP e botão de calcular frete
  const cartSummary = document.querySelector(".cart-summary") || document.createElement("div");

  if (!cartSummary) return;

  // Verificar se já existe um calculador de frete
  const existingCalculator = document.querySelector(".shipping-calculator");
  if (existingCalculator) {
    setupShippingCalculatorEvents(existingCalculator);
    return;
  }

  // Criar calculador de frete
  const shippingCalculator = document.createElement("div");
  shippingCalculator.className = "shipping-calculator";
  shippingCalculator.innerHTML = `
    <h3>Calcular Frete</h3>
    <div class="shipping-form">
      <input type="text" placeholder="Digite seu CEP" maxlength="9" id="shipping-cep">
      <button class="btn btn-shipping" id="calculate-shipping">Calcular</button>
    </div>
  `;

  // Inserir antes do botão de checkout
  const checkoutButton = cartSummary.querySelector(".btn-checkout");
  if (checkoutButton) {
    checkoutButton.before(shippingCalculator);
  } else {
    cartSummary.appendChild(shippingCalculator);
  }

  // Configurar event listeners
  setupShippingCalculatorEvents(shippingCalculator);
}

function setupShippingCalculatorEvents(calculator) {
  // Adicionar event listener para o botão de calcular frete
  const calculateButton = calculator.querySelector(".btn-shipping");
  if (!calculateButton) return;
  
  // Remover event listeners antigos para evitar duplicação
  const newButton = calculateButton.cloneNode(true);
  calculateButton.parentNode.replaceChild(newButton, calculateButton);
  
  newButton.addEventListener("click", () => {
    const cepInput = calculator.querySelector("input");
    if (!cepInput) return;
    
    const cepRaw = cepInput.value.replace(/\D/g, "");
    
    // Validação mais robusta de CEP
    if (!validateCEP(cepRaw)) {
      showNotification("Por favor, digite um CEP válido de 8 dígitos.");
      cepInput.focus();
      return;
    }
    
    // Simular cálculo de frete
    calculateShipping(cepRaw);
  });

  // Máscara e validação de CEP ao digitar
  const cepInput = calculator.querySelector("input");
  if (!cepInput) return;
  
  // Remover event listeners antigos para evitar duplicação
  const newInput = cepInput.cloneNode(true);
  cepInput.parentNode.replaceChild(newInput, cepInput);
  
  newInput.addEventListener("input", function() {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5, 8);
    }
    this.value = value;
  });
  
  newInput.addEventListener("paste", function(e) {
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    paste = paste.replace(/\D/g, "").slice(0, 8);
    if (paste.length > 5) {
      paste = paste.slice(0, 5) + '-' + paste.slice(5, 8);
    }
    this.value = paste;
    e.preventDefault();
  });
  
  // Adicionar evento para calcular ao pressionar Enter
  newInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      newButton.click();
    }
  });
}

// Função para validar CEP
function validateCEP(cep) {
  // CEP deve ter 8 dígitos
  if (cep.length !== 8) return false;
  
  // CEP não pode ter todos os dígitos iguais
  if (/^(\d)\1+$/.test(cep)) return false;
  
  // CEP deve começar com dígitos válidos (0-9)
  if (!/^[0-9]/.test(cep)) return false;
  
  return true;
}

function calculateShipping(cep) {
  // Simular carregamento
  showNotification("Calculando frete...");

  // Remover opções de frete anteriores
  const existingOptions = document.querySelector(".shipping-options-container");
  if (existingOptions) {
    existingOptions.remove();
  }

  // Simular uma chamada de API real com setTimeout
  setTimeout(() => {
    // Criar tabela de fretes
    let shippingTable = document.createElement("div");
    shippingTable.className = "shipping-options-container";

    // Inserir após o calculador de frete
    const shippingCalculator = document.querySelector(".shipping-calculator");
    if (shippingCalculator) {
      shippingCalculator.appendChild(shippingTable);
    }

    // Garantir formatação do CEP
    let cepFormatado = cep.replace(/\D/g, "");
    if (cepFormatado.length === 8) {
      cepFormatado = cepFormatado.substring(0, 5) + '-' + cepFormatado.substring(5);
    }

    // Identificar a região baseada no CEP
    const region = getRegionFromCEP(cepFormatado);
    
    // Definir prazos e preços com base na região
    const shippingOptions = getShippingOptionsByRegion(region);

    // Verificar se o CEP está na região de frete grátis (Sul e Sudeste para compras acima de R$ 150)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isFreeShippingRegion = ["Sudeste", "Sul", "São Paulo", "Rio de Janeiro", "Minas Gerais"].includes(region);
    const isFreeShippingValue = subtotal >= 150;
    const hasFreeShipping = isFreeShippingRegion && isFreeShippingValue;

    // Renderizar tabela de fretes
    let tableHTML = `
      <h3>Opções de entrega para o CEP ${cepFormatado}</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 10px;">Região: ${region}</p>
      <div class="shipping-options">
    `;

    shippingOptions.forEach((option, idx) => {
      const price = hasFreeShipping && option.name === "Padrão" ? 0 : option.price;
      const priceText = price === 0 ? `<span style="color: #2e7d32; font-weight: bold;">GRÁTIS</span>` : `R$ ${price.toFixed(2)}`;
      tableHTML += `
        <div class="shipping-option">
          <label>
            <input type="radio" name="shipping" value="${option.id}" data-price="${price}" ${idx === 0 ? 'checked' : ''}>
            <div class="option-details">
              <div class="option-name">${option.name}</div>
              <div class="option-price">${priceText}</div>
              <div class="option-time">Entrega em até ${option.days} dia${option.days > 1 ? "s" : ""}</div>
            </div>
          </label>
        </div>
      `;
    });

    tableHTML += `</div>`;

    // Adicionar mensagem de frete grátis se aplicável
    if (hasFreeShipping) {
      tableHTML += `
        <div class="free-shipping-message" style="background-color: #e8f5e9; color: #2e7d32; padding: 10px; border-radius: 4px; margin-top: 10px; font-weight: bold; border: 1px solid #a5d6a7;">
          <p style="margin: 0;"><i class="fas fa-truck" style="margin-right: 8px;"></i>Frete grátis para a opção Padrão em compras acima de R$ 150!</p>
        </div>
      `;
    } else if (isFreeShippingRegion && !isFreeShippingValue) {
      tableHTML += `
        <div class="free-shipping-message" style="background-color: #f8f9fa; color: #666; padding: 10px; border-radius: 4px; margin-top: 10px; border: 1px dashed #ccc;">
          <p style="margin: 0;"><i class="fas fa-info-circle" style="margin-right: 8px;"></i>Adicione mais R$ ${(150 - subtotal).toFixed(2)} ao carrinho para ganhar frete grátis na opção Padrão!</p>
        </div>
      `;
    }

    shippingTable.innerHTML = tableHTML;

    // Selecionar o primeiro frete por padrão
    const firstRadio = shippingTable.querySelector('input[type="radio"]');
    if (firstRadio) {
      localStorage.setItem("selectedShipping", firstRadio.getAttribute("data-price"));
      if (typeof updateCartSummary === 'function') updateCartSummary();
    }
    
    // Se houver frete grátis, selecionar automaticamente a opção padrão
    if (hasFreeShipping) {
      const standardShippingRadio = shippingTable.querySelector('input[value="standard"]');
      if (standardShippingRadio) {
        standardShippingRadio.checked = true;
        localStorage.setItem("selectedShipping", standardShippingRadio.getAttribute("data-price"));
        if (typeof updateCartSummary === 'function') updateCartSummary();
      }
    }

    // Adicionar event listeners para as opções de frete
    const shippingRadios = shippingTable.querySelectorAll('input[type="radio"]');
    shippingRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.checked) {
          const shippingPrice = Number.parseFloat(this.getAttribute("data-price"));
          // Salvar opção de frete selecionada
          localStorage.setItem("selectedShipping", shippingPrice);
          // Atualizar resumo do carrinho imediatamente
          if (typeof updateCartSummary === 'function') updateCartSummary();
        }
      });
    });
  }, 1500); // Aumentando o delay para simular melhor uma API real

  // Retorna um valor padrão para atualizar a UI imediatamente enquanto "carrega"
  return 0;
}

// Função para identificar a região com base no CEP
function getRegionFromCEP(cep) {
  const firstDigit = cep.charAt(0);
  
  // Lógica baseada nos primeiros dígitos do CEP para regiões do Brasil
  switch (firstDigit) {
    case "0":
    case "1":
      return "São Paulo";
    case "2":
      return "Rio de Janeiro";
    case "3":
      return "Minas Gerais";
    case "4":
      return "Sudeste";
    case "5":
      return "Sul";
    case "6":
      return "Centro-Oeste";
    case "7":
      return "Nordeste";
    case "8":
    case "9":
      return "Norte";
    default:
      return "Outra região";
  }
}

// Função para obter opções de frete com base na região
function getShippingOptionsByRegion(region) {
  const baseOptions = [
    {
      id: "economic",
      name: "Econômico"
    },
    {
      id: "standard",
      name: "Padrão"
    },
    {
      id: "express",
      name: "Expresso"
    }
  ];

  // Definir prazos e preços com base na região
  switch (region) {
    case "São Paulo":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 12.90 : option.id === "standard" ? 18.90 : 32.90,
        days: option.id === "economic" ? 3 : option.id === "standard" ? 2 : 1
      }));
    case "Rio de Janeiro":
    case "Minas Gerais":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 15.90 : option.id === "standard" ? 22.90 : 38.90,
        days: option.id === "economic" ? 4 : option.id === "standard" ? 3 : 2
      }));
    case "Sudeste":
    case "Sul":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 18.90 : option.id === "standard" ? 25.90 : 42.90,
        days: option.id === "economic" ? 5 : option.id === "standard" ? 3 : 2
      }));
    case "Centro-Oeste":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 22.90 : option.id === "standard" ? 32.90 : 48.90,
        days: option.id === "economic" ? 7 : option.id === "standard" ? 5 : 3
      }));
    case "Nordeste":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 28.90 : option.id === "standard" ? 38.90 : 58.90,
        days: option.id === "economic" ? 8 : option.id === "standard" ? 6 : 4
      }));
    case "Norte":
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 35.90 : option.id === "standard" ? 48.90 : 68.90,
        days: option.id === "economic" ? 10 : option.id === "standard" ? 8 : 5
      }));
    default:
      return baseOptions.map(option => ({
        ...option,
        price: option.id === "economic" ? 25.90 : option.id === "standard" ? 35.90 : 55.90,
        days: option.id === "economic" ? 7 : option.id === "standard" ? 5 : 3
      }));
  }
}

function removeCartItem(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]")
  cart = cart.filter((item) => item.id !== itemId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

function updateCartItemQuantity(itemId, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const itemIndex = cart.findIndex((item) => item.id === itemId)

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = quantity
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  // Atualizar o ícone do carrinho
  const cartCountElement = document.querySelector(".cart-count")
  if (cartCountElement) {
    cartCountElement.textContent = totalItems > 0 ? totalItems : "0"
  }
}

function showNotification(message) {
  // Verificar se já existe uma notificação
  let notification = document.querySelector(".notification")

  if (!notification) {
    // Criar elemento de notificação
    notification = document.createElement("div")
    notification.className = "notification"
    document.body.appendChild(notification)
  }

  // Atualizar mensagem e mostrar
  notification.textContent = message
  notification.classList.add("show")

  // Esconder após 3 segundos
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Função para adicionar produto ao carrinho e atualizar a view se estiver na página do carrinho
function addToCartAndReload(productId) {
  addToCart(productId);
  // Se estiver na página do carrinho, recarregar os itens
  if (window.location.pathname.includes('cart.html')) {
    loadCartItems();
  }
}

// Função para carregar produtos relacionados na seção "VOCÊ PODE GOSTAR TAMBÉM"
function loadRelatedProducts() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid || !window.productsDatabase) return;
  
  // Limpar grid de produtos
  productGrid.innerHTML = "";
  
  // Obter todos os produtos disponíveis
  const allProducts = Object.values(window.productsDatabase);
  
  // Embaralhar produtos para selecionar aleatoriamente
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
  
  // Limitar a apenas 3 produtos
  const limitedProducts = shuffledProducts.slice(0, 3);
  
  // Adicionar os 3 produtos à grade
  limitedProducts.forEach(product => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

// Função auxiliar para criar cartão de produto (replicando a função do scripts.js)
function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.className = "product-card";

  // Adicionar badge de desconto se houver
  if (product.originalPrice) {
    const discount = Math.round(100 - (product.price / product.originalPrice * 100));
    const discountBadge = document.createElement("div");
    discountBadge.className = "discount-badge";
    discountBadge.textContent = `-${discount}%`;
    productCard.appendChild(discountBadge);
  }

  // Adicionar botão de favoritos
  const wishlistButton = document.createElement("button");
  wishlistButton.className = "btn-wishlist";
  wishlistButton.setAttribute("data-id", product.id);

  // Verificar se o produto está na lista de desejos
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const isInWishlist = wishlist.includes(product.id);

  wishlistButton.innerHTML = isInWishlist ? 
    '<i class="fa-solid fa-heart" style="color: #ff6b6b;"></i>' : 
    '<i class="fa-regular fa-heart"></i>';

  wishlistButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  });

  productCard.appendChild(wishlistButton);

  // Adicionar conteúdo do card
  const productContent = document.createElement("div");
  productContent.style.display = "flex";
  productContent.style.flexDirection = "column";
  productContent.style.height = "100%";
  
  productContent.innerHTML = `
    <a href="produto.html?id=${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='./assets/img/placeholder.jpg'">
      </div>
    </a>
    <div class="product-info">
      <div>
        <h3>${product.name}</h3>
        <div class="product-price">
          <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ""}
        </div>
        <div class="product-rating">
          ${createStarsHTML(product.rating)}
          <span class="rating-value">${product.rating.toFixed(1)}</span>
        </div>
      </div>
      <button class="btn btn-add-cart" data-id="${product.id}">Adicionar ao carrinho</button>
    </div>
  `;

  productCard.appendChild(productContent);

  // Adicionar evento ao botão de adicionar ao carrinho
  setTimeout(() => {
    const addToCartBtn = productCard.querySelector('.btn-add-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCartAndReload(product.id);
      });
    }
  }, 0);

  return productCard;
}

// Função auxiliar para criar estrelas de avaliação
function createStarsHTML(rating) {
  let starsHTML = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Estrela cheia
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fa-solid fa-star" style="color: #ffc107;"></i>';
  }
  
  // Meia estrela
  if (hasHalfStar) {
    starsHTML += '<i class="fa-solid fa-star-half-stroke" style="color: #ffc107;"></i>';
  }
  
  // Estrela vazia
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="fa-regular fa-star" style="color: #ffc107;"></i>';
  }
  
  return starsHTML;
}

// Função para alternar produto na lista de desejos
function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const isInWishlist = wishlist.includes(productId);
  
  if (isInWishlist) {
    // Remover da lista de desejos
    wishlist = wishlist.filter(id => id !== productId);
    showNotification("Produto removido dos favoritos!");
  } else {
    // Adicionar à lista de desejos
    wishlist.push(productId);
    showNotification("Produto adicionado aos favoritos!");
  }
  
  // Salvar lista de desejos atualizada
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  
  // Atualizar ícones de favorito na página
  const wishlistButtons = document.querySelectorAll(`.btn-wishlist[data-id="${productId}"]`);
  wishlistButtons.forEach(button => {
    if (!isInWishlist) {
      button.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff6b6b;"></i>';
      button.classList.add('active');
    } else {
      button.innerHTML = '<i class="fa-regular fa-heart"></i>';
      button.classList.remove('active');
    }
  });
}

