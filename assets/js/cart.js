document.addEventListener("DOMContentLoaded", () => {
  // Carregar itens do carrinho
  loadCartItems()

  // Adicionar event listeners para ações do carrinho
  setupCartActions()

  // Configurar aplicação de cupom
  setupCouponCode()

  // Configurar cálculo de frete
  setupShippingCalculator()
})

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const cartItemsContainer = document.querySelector(".cart-items")

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
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <div class="cart-item-actions">
              <button class="cart-action remove-item">Excluir</button>
              <button class="cart-action save-for-later">Salvar</button>
              <a href="product.html?id=${item.id}" class="cart-action">Comprar</a>
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
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Verificar se há cupom aplicado
  const appliedCoupon = localStorage.getItem("appliedCoupon")
  let discount = 0

  if (appliedCoupon) {
    // Aplicar desconto de 3%
    discount = subtotal * 0.03
  }

  // Verificar se há frete selecionado
  const selectedShipping = localStorage.getItem("selectedShipping")
  let shippingCost = 0

  if (selectedShipping) {
    shippingCost = Number.parseFloat(selectedShipping)
  }

  const total = subtotal - discount + shippingCost

  // Atualizar valores no resumo do carrinho
  const subtotalElement = document.querySelector(".summary-row:first-child span:last-child")
  if (subtotalElement) {
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`
  }

  // Atualizar elemento de frete
  const shippingElement = document.querySelector(".summary-row:nth-child(2) span:last-child")
  if (shippingElement) {
    if (shippingCost > 0) {
      shippingElement.textContent = `R$ ${shippingCost.toFixed(2)}`
      shippingElement.className = ""
    } else {
      shippingElement.textContent = "Grátis"
      shippingElement.className = "free-shipping"
    }
  }

  // Adicionar linha de desconto se houver cupom aplicado
  const discountRow = document.querySelector(".discount-row")

  if (discount > 0) {
    if (discountRow) {
      // Atualizar valor do desconto
      discountRow.querySelector("span:last-child").textContent = `-R$ ${discount.toFixed(2)}`
    } else {
      // Criar linha de desconto
      const newDiscountRow = document.createElement("div")
      newDiscountRow.className = "summary-row discount-row"
      newDiscountRow.innerHTML = `
        <span>Desconto (${appliedCoupon})</span>
        <span class="discount-value">-R$ ${discount.toFixed(2)}</span>
      `

      // Inserir após a linha de frete
      if (shippingElement) {
        shippingElement.closest(".summary-row").after(newDiscountRow)
      }
    }
  } else if (discountRow) {
    // Remover linha de desconto se não houver cupom
    discountRow.remove()
  }

  // Atualizar total
  const totalElement = document.querySelector(".total-price")
  if (totalElement) {
    totalElement.textContent = `R$ ${total.toFixed(2)}`
  }
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
      window.location.href = "confirmation.html"
    })
  }

  // Event delegation para ações de itens do carrinho
  document.querySelector(".cart-items")?.addEventListener("click", (e) => {
    const target = e.target
    const cartItem = target.closest(".cart-item")

    if (!cartItem) return

    const itemId = cartItem.getAttribute("data-id")

    // Remover item
    if (target.classList.contains("remove-item")) {
      removeCartItem(itemId)
      cartItem.remove()

      // Verificar se o carrinho está vazio
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      if (cart.length === 0) {
        loadCartItems() // Recarregar para mostrar mensagem de carrinho vazio
      } else {
        // Atualizar resumo do carrinho
        updateCartSummary()
      }
    }

    // Salvar para depois
    if (target.classList.contains("save-for-later")) {
      // Adicionar à lista de desejos
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

      if (!wishlist.includes(itemId)) {
        wishlist.push(itemId)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
      }

      // Remover do carrinho
      removeCartItem(itemId)
      cartItem.remove()

      showNotification("Item salvo para comprar depois!")

      // Verificar se o carrinho está vazio
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      if (cart.length === 0) {
        loadCartItems() // Recarregar para mostrar mensagem de carrinho vazio
      } else {
        // Atualizar resumo do carrinho
        updateCartSummary()
      }
    }
  })

  // Event listener para mudanças na quantidade
  document.querySelector(".cart-items")?.addEventListener("change", (e) => {
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
  const cartSummary = document.querySelector(".cart-summary")

  if (!cartSummary) return

  // Verificar se já existe um calculador de frete
  if (cartSummary.querySelector(".shipping-calculator")) return

  // Criar calculador de frete
  const shippingCalculator = document.createElement("div")
  shippingCalculator.className = "shipping-calculator"
  shippingCalculator.innerHTML = `
    <h3>Calcular Frete</h3>
    <div class="shipping-form">
      <input type="text" placeholder="Digite seu CEP" maxlength="9">
      <button class="btn btn-shipping">Calcular</button>
    </div>
  `

  // Inserir antes do botão de checkout
  const checkoutButton = cartSummary.querySelector(".btn-checkout")
  if (checkoutButton) {
    checkoutButton.before(shippingCalculator)
  } else {
    cartSummary.appendChild(shippingCalculator)
  }

  // Adicionar event listener para o botão de calcular frete
  const calculateButton = shippingCalculator.querySelector(".btn-shipping")
  calculateButton.addEventListener("click", () => {
    const cepInput = shippingCalculator.querySelector("input")
    const cep = cepInput.value.replace(/\D/g, "")

    if (cep.length !== 8) {
      showNotification("Por favor, digite um CEP válido.")
      return
    }

    // Simular cálculo de frete
    calculateShipping(cep)
  })

  // Formatar CEP automaticamente
  const cepInput = shippingCalculator.querySelector("input")
  cepInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "")

    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5)
    }

    this.value = value
  })
}

// Atualizar a função de cálculo de frete no carrinho para usar os novos estilos
function calculateShipping(cep) {
  // Simular carregamento
  showNotification("Calculando frete...")

  setTimeout(() => {
    // Verificar se já existe uma tabela de fretes
    let shippingTable = document.querySelector(".shipping-options-container")

    if (!shippingTable) {
      // Criar tabela de fretes
      shippingTable = document.createElement("div")
      shippingTable.className = "shipping-options-container"

      // Inserir após o calculador de frete
      const shippingCalculator = document.querySelector(".shipping-calculator")
      if (shippingCalculator) {
        shippingCalculator.appendChild(shippingTable)
      }
    }

    // Gerar opções de frete aleatórias
    const shippingOptions = [
      {
        id: "economic",
        name: "Econômico",
        price: Math.random() * 15 + 5, // Entre R$ 5 e R$ 20
        days: Math.floor(Math.random() * 5) + 6, // Entre 6 e 10 dias
      },
      {
        id: "standard",
        name: "Padrão",
        price: Math.random() * 20 + 15, // Entre R$ 15 e R$ 35
        days: Math.floor(Math.random() * 3) + 3, // Entre 3 e 5 dias
      },
      {
        id: "express",
        name: "Expresso",
        price: Math.random() * 25 + 30, // Entre R$ 30 e R$ 55
        days: Math.floor(Math.random() * 2) + 1, // Entre 1 e 2 dias
      },
    ]

    // Verificar se o CEP está na região de frete grátis (começando com 0, 1, 2, 3, 4)
    const firstDigit = cep.charAt(0)
    const isFreeShipping = ["0", "1", "2", "3", "4"].includes(firstDigit)

    // Renderizar tabela de fretes
    let tableHTML = `
      <h3>Opções de entrega para o CEP ${cep.slice(0, 5)}-${cep.slice(5)}</h3>
      <div class="shipping-options">
    `

    shippingOptions.forEach((option) => {
      const price = isFreeShipping && option.name === "Padrão" ? 0 : option.price
      const priceText = price === 0 ? "Grátis" : `R$ ${price.toFixed(2)}`

      tableHTML += `
        <div class="shipping-option">
          <label>
            <input type="radio" name="shipping" value="${option.id}" data-price="${price}">
            <div class="option-details">
              <div class="option-name">${option.name}</div>
              <div class="option-price">${priceText}</div>
              <div class="option-time">Entrega em até ${option.days} dia${option.days > 1 ? "s" : ""}</div>
            </div>
          </label>
        </div>
      `
    })

    tableHTML += `</div>`

    // Adicionar mensagem de frete grátis se aplicável
    if (isFreeShipping) {
      tableHTML += `
        <div class="free-shipping-message">
          <p>Seu CEP está na região de frete grátis para a opção Padrão!</p>
        </div>
      `
    }

    shippingTable.innerHTML = tableHTML

    // Adicionar event listeners para as opções de frete
    const shippingRadios = shippingTable.querySelectorAll('input[type="radio"]')
    shippingRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.checked) {
          const shippingPrice = Number.parseFloat(this.getAttribute("data-price"))

          // Salvar opção de frete selecionada
          localStorage.setItem("selectedShipping", shippingPrice)

          // Atualizar resumo do carrinho
          updateCartSummary()
        }
      })
    })
  }, 1000)
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
  const cartIcon = document.querySelector(".cart-icon")
  if (cartIcon) {
    cartIcon.textContent = totalItems > 0 ? `🛒 ${totalItems}` : "🛒"
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
