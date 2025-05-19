// confirmation.js para exibir informações do pedido finalizado

document.addEventListener("DOMContentLoaded", () => {
  console.log("Confirmation page loaded");
  
  // Obter o ID do pedido da URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order');
  
  console.log("Order ID from URL:", orderId);
  
  if (!orderId) {
    // Tentar pegar do localStorage
    const currentOrderId = localStorage.getItem("currentOrderId");
    console.log("Order ID from localStorage:", currentOrderId);
    
    if (currentOrderId) {
      console.log("Redirecting to order page with ID:", currentOrderId);
      // Redirecionar para a URL com o ID do pedido
      window.location.href = `confirmation.html?order=${currentOrderId}`;
      return;
    } else {
      console.log("No order ID found, redirecting to home page");
      // Redirecionar para a página inicial se não houver pedido
      window.location.href = "index.html";
      return;
    }
  }
  
  // Carrega e exibe as informações do pedido pelo ID
  loadOrderDetails(orderId);
  
  // Limpar o ID do pedido atual após mostrar a confirmação
  localStorage.removeItem("currentOrderId");
  
  // Adicionar event listeners para botões
  const btnContinue = document.querySelector(".btn-outline");
  if (btnContinue) {
    btnContinue.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const btnTrack = document.querySelector(".btn-primary");
  if (btnTrack) {
    btnTrack.addEventListener("click", () => {
      window.location.href = `tracking.html?order=${orderId}`;
    });
  }
});

function loadOrderDetails(orderNumber) {
  console.log("Loading order details for order:", orderNumber);
  
  // Obter histórico de pedidos
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
  console.log("Order history retrieved:", orderHistory.length, "orders found");
  
  // Encontrar o pedido pelo ID
  const order = orderHistory.find(order => order.id === orderNumber);
  console.log("Order found:", order ? "Yes" : "No");
  
  if (!order) {
    console.error("Order not found in order history:", orderNumber);
    alert("Pedido não encontrado!");
    window.location.href = "index.html";
    return;
  }
  
  console.log("Displaying order details...");
  
  // Atualizar título da página
  document.title = `Pedido ${orderNumber} - EcoBuy`;

  // Atualizar número do pedido
  const orderNumberElement = document.getElementById("order-number");
  if (orderNumberElement) {
    orderNumberElement.textContent = orderNumber;
  }
  
  // Atualizar data do pedido
  const orderDateElement = document.getElementById("order-date");
  if (orderDateElement) {
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    orderDateElement.textContent = `Realizado em ${formattedDate}`;
  }
  
  // Atualizar endereço de entrega
  const deliveryAddressContent = document.querySelector(".delivery-address .info-content");
  if (deliveryAddressContent && order.address) {
    deliveryAddressContent.innerHTML = `
      <p>${order.address.name}</p>
      <p>${order.address.street}, ${order.address.number} ${order.address.complement ? '- ' + order.address.complement : ''}</p>
      <p>${order.address.neighborhood} - ${order.address.city}/${order.address.state}</p>
      <p>CEP: ${order.address.zipCode}</p>
    `;
  }
  
  // Atualizar método de entrega e data estimada
  const deliveryMethodContent = document.querySelector(".delivery-method .info-content");
  if (deliveryMethodContent) {
    // Calcular data estimada de entrega (5 dias úteis após a compra)
    const orderDate = new Date(order.date);
    const estimatedDate = new Date(orderDate);
    // Adicionar 7 dias para entrega
    estimatedDate.setDate(estimatedDate.getDate() + 7);
    
    const formattedEstimatedDate = estimatedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Verificar se há frete grátis (subtotal acima de R$150)
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingOption = subtotal >= 150 ? "Entrega Padrão (Frete Grátis)" : "Entrega Padrão";
    
    deliveryMethodContent.innerHTML = `
      <p>${shippingOption}</p>
      <p class="delivery-estimate">Previsão de entrega: ${formattedEstimatedDate}</p>
    `;
  }
  
  // Atualizar informações de pagamento
  const paymentAmount = document.querySelector(".payment-amount");
  if (paymentAmount) {
    paymentAmount.textContent = `Pagamento de R$ ${order.total.toFixed(2)}`;
  }
  
  const paymentMethod = document.querySelector(".payment-method");
  if (paymentMethod) {
    let methodText = '';
    
    switch(order.paymentMethod) {
      case 'card':
        methodText = "1x SEM JUROS no cartão de crédito";
        break;
      case 'pix':
        methodText = "Pagamento via PIX";
        break;
      case 'boleto':
        methodText = "Pagamento via Boleto Bancário";
        break;
      default:
        methodText = "Método de pagamento não especificado";
    }
    
    paymentMethod.textContent = methodText;
  }
  
  // Adicionar itens comprados
  const purchasedItems = document.querySelector(".purchased-items");
  if (purchasedItems) {
    // Manter apenas o título h3
    const h3 = purchasedItems.querySelector("h3");
    purchasedItems.innerHTML = "";
    if (h3) purchasedItems.appendChild(h3);
    
    // Adicionar cada item
    order.items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "purchased-item";
      itemElement.innerHTML = `
        <div class="item-image">
          <img src="${item.image || './assets/img/placeholder.jpg'}" alt="${item.name || ''}">
        </div>
        <div class="item-details">
          <div class="item-name">${item.name || ''}</div>
          <div class="item-quantity">Quantidade: ${item.quantity}</div>
          <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `;
      purchasedItems.appendChild(itemElement);
    });
  }
  
  // Calcular valores para o resumo
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 150 ? 0 : 19.90; // Frete grátis acima de R$150
  const discount = order.total < subtotal + shipping ? (subtotal + shipping - order.total) : 0;
  
  // Adicionar resumo de valores
  const valuesSummary = document.querySelector(".values-summary");
  if (valuesSummary) {
    let summaryHTML = `
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>R$ ${subtotal.toFixed(2)}</span>
      </div>
    `;
    
    if (discount > 0) {
      summaryHTML += `
        <div class="summary-row discount-row">
          <span>Desconto:</span>
          <span class="discount-value">-R$ ${discount.toFixed(2)}</span>
        </div>
      `;
    }
    
    summaryHTML += `
      <div class="summary-row">
        <span>Frete:</span>
        <span>${shipping > 0 ? `R$ ${shipping.toFixed(2)}` : "Grátis"}</span>
      </div>
      <div class="summary-row total-row">
        <span>Total:</span>
        <span class="total-value">R$ ${order.total.toFixed(2)}</span>
      </div>
    `;
    
    valuesSummary.innerHTML = summaryHTML;
  }
}
  