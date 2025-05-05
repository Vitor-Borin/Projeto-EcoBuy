document.addEventListener("DOMContentLoaded", () => {
    // Obter dados do carrinho para mostrar na confirmação
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  
    if (cart.length === 0) {
      // Redirecionar para a página inicial se não houver itens no carrinho
      window.location.href = "index.html"
      return
    }
  
    // Calcular total da compra
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
  
    // Gerar número de pedido aleatório
    const orderNumber = generateOrderNumber()
  
    // Salvar pedido no histórico
    saveOrderToHistory(orderNumber, cart, total)
  
    // Exibir detalhes da compra
    displayPurchaseDetails(orderNumber, cart, subtotal, discount, shippingCost, total, appliedCoupon)
  
    // Adicionar event listeners para botões
    document.querySelector(".btn-outline").addEventListener("click", () => {
      window.location.href = "index.html"
    })
  
    document.querySelector(".btn-purple").addEventListener("click", () => {
      window.location.href = `tracking.html?order=${orderNumber}`
    })
  
    // Limpar o carrinho após a compra
    localStorage.removeItem("cart")
    localStorage.removeItem("selectedShipping")
    localStorage.removeItem("appliedCoupon")
  
    updateCartCount()
  })
  
  function generateOrderNumber() {
    // Gerar número de pedido aleatório com formato: ECO-XXXXXX
    const randomPart = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
    return `ECO-${randomPart}`
  }
  
  function saveOrderToHistory(orderNumber, cart, total) {
    // Obter histórico de pedidos existente
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  
    // Criar novo pedido
    const newOrder = {
      id: orderNumber,
      date: new Date().toISOString(),
      items: cart,
      total: total,
      status: "Em preparação",
    }
  
    // Adicionar ao histórico
    orderHistory.push(newOrder)
  
    // Salvar no localStorage
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  }
  
  function displayPurchaseDetails(orderNumber, cart, subtotal, discount, shippingCost, total, appliedCoupon) {
    // Atualizar título da página
    document.title = `Pedido ${orderNumber} - ecobuy`
  
    // Obter o primeiro item do carrinho (para exibir na mensagem de confirmação)
    const firstItem = cart[0]
    let confirmationMessage = `Você comprou ${firstItem.name}`
  
    // Se houver mais itens, adicionar "e mais X itens"
    if (cart.length > 1) {
      confirmationMessage += ` e mais ${cart.length - 1} ${cart.length - 1 === 1 ? "item" : "itens"}`
    }
  
    // Atualizar mensagem de confirmação
    document.querySelector(".confirmation-box p").textContent = confirmationMessage
  
    // Adicionar número do pedido
    const orderNumberElement = document.createElement("div")
    orderNumberElement.className = "order-number"
    orderNumberElement.textContent = `Pedido: ${orderNumber}`
    document.querySelector(".confirmation-box").appendChild(orderNumberElement)
  
    // Atualizar resumo da compra
    const paymentInfo = document.querySelector(".payment-info")
    if (paymentInfo) {
      const paymentDetails = paymentInfo.querySelector(".payment-details")
      if (paymentDetails) {
        // Atualizar valor total
        const paymentAmount = paymentDetails.querySelector(".payment-amount")
        if (paymentAmount) {
          paymentAmount.textContent = `Você pagou R$ ${total.toFixed(2)}`
        }
  
        // Adicionar detalhes do pagamento
        const paymentMethod = paymentDetails.querySelector(".payment-method")
        if (paymentMethod) {
          // Simular método de pagamento
          const cardTypes = ["VISA", "MASTERCARD", "ELO", "AMERICAN EXPRESS"]
          const randomCardType = cardTypes[Math.floor(Math.random() * cardTypes.length)]
          const randomCardNumber = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")
  
          paymentMethod.textContent = `1x SEM JUROS com o cartão de crédito ${randomCardType} terminado em ${randomCardNumber}`
        }
      }
    }
  
    // Adicionar detalhes dos itens comprados
    const purchaseSummary = document.querySelector(".purchase-summary")
    if (purchaseSummary) {
      // Criar lista de itens
      const itemsList = document.createElement("div")
      itemsList.className = "purchased-items"
  
      // Adicionar cabeçalho
      itemsList.innerHTML = `<h3>Itens do pedido:</h3>`
  
      // Adicionar cada item
      cart.forEach((item) => {
        const itemElement = document.createElement("div")
        itemElement.className = "purchased-item"
        itemElement.innerHTML = `
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-quantity">Quantidade: ${item.quantity}</div>
            <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `
  
        itemsList.appendChild(itemElement)
      })
  
      // Adicionar resumo de valores
      const valuesSummary = document.createElement("div")
      valuesSummary.className = "values-summary"
  
      let summaryHTML = `
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
      `
  
      if (discount > 0) {
        summaryHTML += `
          <div class="summary-row discount-row">
            <span>Desconto (${appliedCoupon}):</span>
            <span class="discount-value">-R$ ${discount.toFixed(2)}</span>
          </div>
        `
      }
  
      summaryHTML += `
        <div class="summary-row">
          <span>Frete:</span>
          <span>${shippingCost > 0 ? `R$ ${shippingCost.toFixed(2)}` : "Grátis"}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total:</span>
          <span class="total-value">R$ ${total.toFixed(2)}</span>
        </div>
      `
  
      valuesSummary.innerHTML = summaryHTML
  
      // Adicionar à página
      purchaseSummary.appendChild(itemsList)
      purchaseSummary.appendChild(valuesSummary)
    }
  
    // Atualizar produtos recomendados
    updateRecommendedProducts(cart)
  }
  
  function updateRecommendedProducts(purchasedItems) {
    if (!window.productsDatabase) return
  
    // Obter IDs dos produtos comprados
    const purchasedIds = purchasedItems.map((item) => item.id)
  
    // Filtrar produtos não comprados
    const availableProducts = Object.values(window.productsDatabase).filter(
      (product) => !purchasedIds.includes(product.id),
    )
  
    // Selecionar 2 produtos aleatórios
    const recommendedProducts = []
  
    while (recommendedProducts.length < 2 && availableProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableProducts.length)
      recommendedProducts.push(availableProducts[randomIndex])
      availableProducts.splice(randomIndex, 1)
    }
  
    // Atualizar a seção de produtos recomendados
    const bundleProducts = document.querySelectorAll(".bundle-product")
  
    if (bundleProducts.length >= 2 && recommendedProducts.length >= 2) {
      // Atualizar primeiro produto recomendado
      updateBundleProduct(bundleProducts[0], recommendedProducts[0])
  
      // Atualizar segundo produto recomendado
      updateBundleProduct(bundleProducts[1], recommendedProducts[1])
  
      // Atualizar preço total
      const totalPrice = recommendedProducts[0].price + recommendedProducts[1].price
      const bundleTotalPrice = document.querySelector(".bundle-total-price")
      if (bundleTotalPrice) {
        bundleTotalPrice.textContent = `R$ ${totalPrice.toFixed(2)}`
      }
    }
  }
  
  function updateBundleProduct(bundleElement, product) {
    const image = bundleElement.querySelector("img")
    const name = bundleElement.querySelector("h3")
    const price = bundleElement.querySelector(".bundle-price")
  
    if (image) image.src = product.image
    if (image) image.alt = product.name
    if (name) name.textContent = product.name
    if (price) price.textContent = `R$ ${product.price.toFixed(2)}`
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
  