// confirmation.js refatorado

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
    const btnContinue = document.querySelector(".btn-outline")
    if (btnContinue) {
      btnContinue.addEventListener("click", () => {
        window.location.href = "index.html"
      })
    }
  
    const btnTrack = document.querySelector(".btn-primary")
    if (btnTrack) {
      btnTrack.addEventListener("click", () => {
        window.location.href = `tracking.html?order=${orderNumber}`
      })
    }
  
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
      address: generateRandomAddress(),
      estimatedDelivery: generateEstimatedDelivery()
    }
  
    // Adicionar ao histórico
    orderHistory.push(newOrder)
  
    // Salvar no localStorage
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  }
  
  function displayPurchaseDetails(orderNumber, cart, subtotal, discount, shippingCost, total, appliedCoupon) {
    // Atualizar título da página
    document.title = `Pedido ${orderNumber} - ecobuy`
  
    // Atualizar número do pedido
    const orderNumberElement = document.getElementById("order-number")
    if (orderNumberElement) {
      orderNumberElement.textContent = orderNumber
    }
  
    // Atualizar data do pedido
    const orderDateElement = document.getElementById("order-date")
    if (orderDateElement) {
      const today = new Date()
      const formattedDate = today.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      orderDateElement.textContent = `Realizado em ${formattedDate}`
    }
  
    // Atualizar endereço de entrega
    const address = generateRandomAddress()
    const deliveryAddressContent = document.querySelector(".delivery-address .info-content")
    if (deliveryAddressContent) {
      deliveryAddressContent.innerHTML = `
        <p>${address.name}</p>
        <p>${address.street}, ${address.number} ${address.complement ? '- ' + address.complement : ''}</p>
        <p>${address.neighborhood} - ${address.city}/${address.state}</p>
        <p>CEP: ${address.zipCode}</p>
      `
    }
  
    // Atualizar método de entrega e data estimada
    const estimatedDate = generateEstimatedDelivery()
    const deliveryMethodContent = document.querySelector(".delivery-method .info-content")
    if (deliveryMethodContent) {
      const shippingOption = shippingCost === 0 ? "Entrega Padrão (Frete Grátis)" : "Entrega Padrão"
      deliveryMethodContent.innerHTML = `
        <p>${shippingOption}</p>
        <p class="delivery-estimate">Previsão de entrega: ${estimatedDate}</p>
      `
    }
  
    // Atualizar informações de pagamento
    const paymentAmount = document.querySelector(".payment-amount")
    if (paymentAmount) {
      paymentAmount.textContent = `Pagamento de R$ ${total.toFixed(2)}`
    }
  
    const paymentMethod = document.querySelector(".payment-method")
    if (paymentMethod) {
      // Simular método de pagamento
      const cardTypes = ["VISA", "MASTERCARD", "ELO", "AMERICAN EXPRESS"]
      const randomCardType = cardTypes[Math.floor(Math.random() * cardTypes.length)]
      const randomCardNumber = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
      paymentMethod.textContent = `1x SEM JUROS com o cartão de crédito ${randomCardType} terminado em ${randomCardNumber}`
    }
  
    // Adicionar itens comprados
    const purchasedItems = document.querySelector(".purchased-items")
    if (purchasedItems) {
      // Manter apenas o título h3
      const h3 = purchasedItems.querySelector("h3")
      purchasedItems.innerHTML = ""
      if (h3) purchasedItems.appendChild(h3)
  
      // Adicionar cada item
      cart.forEach((item) => {
        const itemElement = document.createElement("div")
        itemElement.className = "purchased-item"
        itemElement.innerHTML = `
          <div class="item-image">
            <img src="${item.image || './assets/img/placeholder.jpg'}" alt="${item.name || ''}">
          </div>
          <div class="item-details">
            <div class="item-name">${item.name || ''}</div>
            <div class="item-quantity">Quantidade: ${item.quantity}</div>
            <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `
        purchasedItems.appendChild(itemElement)
      })
    }
  
    // Adicionar resumo de valores
    const valuesSummary = document.querySelector(".values-summary")
    if (valuesSummary) {
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
  
    // Selecionar 4 produtos aleatórios
    const recommendedProducts = []
  
    while (recommendedProducts.length < 4 && availableProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableProducts.length)
      recommendedProducts.push(availableProducts[randomIndex])
      availableProducts.splice(randomIndex, 1)
    }
  
    // Atualizar a seção de produtos recomendados
    const recommendationsContainer = document.querySelector(".product-recommendations")
    if (recommendationsContainer && recommendedProducts.length > 0) {
      recommendationsContainer.innerHTML = ""
  
      // Adicionar cada produto recomendado
      recommendedProducts.forEach(product => {
        const card = document.createElement("div")
        card.className = "recommendation-card"
        card.innerHTML = `
          <div class="recommendation-image">
            <img src="${product.image || './assets/img/placeholder.jpg'}" alt="${product.name || ''}">
          </div>
          <div class="recommendation-name">${product.name || ''}</div>
          <div class="recommendation-price">R$ ${product.price.toFixed(2)}</div>
          <button class="btn-add-cart" data-id="${product.id}">Adicionar ao carrinho</button>
        `
        recommendationsContainer.appendChild(card)
  
        // Adicionar evento ao botão de adicionar ao carrinho
        const addButton = card.querySelector(".btn-add-cart")
        if (addButton) {
          addButton.addEventListener("click", () => {
            addToCart(product.id)
            showNotification("Produto adicionado ao carrinho!")
            updateCartCount()
          })
        }
      })
    }
  }
  
  function generateRandomAddress() {
    const names = ["Maria Silva", "João Santos", "Ana Oliveira", "Carlos Souza", "Juliana Lima"]
    const streets = ["Rua das Flores", "Avenida Brasil", "Rua dos Pinheiros", "Avenida Paulista", "Rua Augusta"]
    const neighborhoods = ["Centro", "Jardim Primavera", "Vila Nova", "Bela Vista", "Moema"]
    const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"]
    const states = ["SP", "RJ", "MG", "PR", "RS"]
    const complements = ["Apto 101", "Casa 2", "Bloco B", "Sala 304", ""]
  
    return {
      name: names[Math.floor(Math.random() * names.length)],
      street: streets[Math.floor(Math.random() * streets.length)],
      number: Math.floor(Math.random() * 1000) + 1,
      complement: complements[Math.floor(Math.random() * complements.length)],
      neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`
    }
  }
  
  function generateEstimatedDelivery() {
    // Gerar data de entrega estimada (entre 3 e 10 dias a partir de hoje)
    const today = new Date()
    const deliveryDays = Math.floor(Math.random() * 8) + 3
    const estimatedDate = new Date(today)
    estimatedDate.setDate(today.getDate() + deliveryDays)
    
    return estimatedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
  
  function addToCart(productId) {
    // Verificar se o produto existe
    if (!window.productsDatabase || !window.productsDatabase[productId]) return
  
    const product = window.productsDatabase[productId]
  
    // Obter carrinho atual
    let cart = JSON.parse(localStorage.getItem("cart") || "[]")
  
    // Verificar se o produto já está no carrinho
    const existingItemIndex = cart.findIndex((item) => item.id === productId)
  
    if (existingItemIndex !== -1) {
      // Incrementar quantidade
      cart[existingItemIndex].quantity += 1
    } else {
      // Adicionar novo item
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      })
    }
  
    // Salvar carrinho atualizado
    localStorage.setItem("cart", JSON.stringify(cart))
  
    // Atualizar contador do carrinho
    updateCartCount()
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
  