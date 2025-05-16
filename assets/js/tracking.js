// tracking.js refatorado

document.addEventListener("DOMContentLoaded", () => {
    // Obter número do pedido da URL
    const urlParams = new URLSearchParams(window.location.search)
    const orderNumber = urlParams.get("order")
  
    if (!orderNumber) {
      // Redirecionar para a página inicial se não houver número de pedido
      window.location.href = "index.html"
      return
    }
  
    // Carregar detalhes do pedido
    loadOrderDetails(orderNumber)
  
    // Adicionar event listeners para botões
    const btnOrderDetails = document.querySelector(".btn-outline");
    if (btnOrderDetails) btnOrderDetails.addEventListener("click", () => {
      showOrderDetails(orderNumber)
    })
  
    const btnCancel = document.querySelector(".btn-outline-red");
    if (btnCancel) btnCancel.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja cancelar esta compra?")) {
        cancelOrder(orderNumber)
      }
    })
  
    const helpBtn = document.querySelector(".help-button");
    if (helpBtn) helpBtn.addEventListener("click", () => {
      showPaymentProblemForm()
    })
  
    // Toggle para detalhes do envio
    const detailsToggle = document.querySelector(".tracking-details-toggle");
    if (detailsToggle) {
      const detailsContent = document.querySelector(".tracking-details-content");
      let isExpanded = true;
      
      detailsToggle.addEventListener("click", () => {
        if (isExpanded) {
          detailsContent.style.display = "none";
          detailsToggle.textContent = "Ver mais";
        } else {
          detailsContent.style.display = "block";
          detailsToggle.textContent = "Ver menos";
        }
        isExpanded = !isExpanded;
      });
    }
  })
  
  function loadOrderDetails(orderNumber) {
    // Obter histórico de pedidos
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  
    // Encontrar o pedido pelo número
    const order = orderHistory.find((o) => o.id === orderNumber)
  
    if (!order) {
      // Pedido não encontrado, mostrar mensagem de erro
      document.querySelector(".tracking-container").innerHTML = `
        <div class="error-message">
          <h2>Pedido não encontrado</h2>
          <p>O pedido ${orderNumber} não foi encontrado no sistema.</p>
          <a href="index.html" class="btn btn-outline">Voltar à página inicial</a>
        </div>
      `
      return
    }
  
    // Atualizar título da página
    document.title = `Rastreio do Pedido ${orderNumber} - ecobuy`
  
    // Atualizar número do pedido
    document.getElementById("order-number").textContent = `Pedido: ${orderNumber}`
  
    // Obter o primeiro item do pedido (para exibir na página)
    const firstItem = order.items[0]
  
    // Atualizar informações do produto
    document.querySelector(".product-title").textContent = firstItem.name
    document.querySelector(".quantity-info").textContent =
      `${order.items.length > 1 ? order.items.length + " itens" : "1 quantidade"}`
    
    // Atualizar imagem do produto se disponível
    if (firstItem.image) {
      const productImage = document.getElementById("product-image");
      if (productImage) productImage.src = firstItem.image;
    }
  
    // Simular status de entrega
    const currentDate = new Date()
    const orderDate = new Date(order.date)
  
    // Calcular datas estimadas
    const preparationDate = new Date(orderDate)
    preparationDate.setHours(preparationDate.getHours() + 2)
  
    const shippingDate = new Date(preparationDate)
    shippingDate.setHours(shippingDate.getHours() + 6)
  
    const deliveryDate = new Date(shippingDate)
    deliveryDate.setDate(deliveryDate.getDate() + 2)
  
    // Formatar datas
    const formatDate = (date) => {
      const day = date.getDate()
      const month = date.toLocaleString("pt-BR", { month: "short" })
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
  
      return `${day} ${month} ${hours}:${minutes}`
    }
  
    // Determinar status atual
    let currentStatus
    let statusClass
  
    if (currentDate < preparationDate) {
      currentStatus = "Em preparação"
      statusClass = "preparation"
    } else if (currentDate < shippingDate) {
      currentStatus = "Enviado"
      statusClass = "shipped"
    } else if (currentDate < deliveryDate) {
      currentStatus = "A Caminho"
      statusClass = "on-the-way"
    } else {
      currentStatus = "Entregue"
      statusClass = "delivered"
    }
  
    // Atualizar status no histórico de pedidos
    updateOrderStatus(orderNumber, currentStatus)
  
    // Atualizar status na página
    const statusElement = document.querySelector(".tracking-status");
    if (statusElement) {
      let statusIcon = "fa-box";
      
      if (statusClass === "shipped" || statusClass === "on-the-way") {
        statusIcon = "fa-truck";
      } else if (statusClass === "delivered") {
        statusIcon = "fa-check-circle";
      }
      
      statusElement.innerHTML = `<i class="fa-solid ${statusIcon}"></i> ${currentStatus}`;
    }
  
    // Formatar data de entrega para exibição
    const deliveryDateFormatted = deliveryDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  
    // Atualizar data de entrega estimada
    document.querySelector(".delivery-date").textContent = `Chegará ${deliveryDateFormatted}`
  
    // Atualizar timeline
    const timelineItems = document.querySelectorAll(".timeline-item")
  
    // Status 1: Em preparação
    if (timelineItems[0]) {
      if (currentStatus !== "Em preparação") {
        timelineItems[0].classList.add("completed")
        timelineItems[0].querySelector(".timeline-content").innerHTML = `
          <h3>Em preparação</h3>
          <p>Seu pedido foi recebido e está sendo preparado.</p>
          <p class="timeline-date">${formatDate(orderDate)}</p>
        `
      }
    }
  
    // Status 2: A Caminho
    if (timelineItems[1]) {
      if (currentStatus === "Enviado" || currentStatus === "A Caminho" || currentStatus === "Entregue") {
        timelineItems[1].classList.add("completed")
        timelineItems[1].classList.remove("active")
        
        if (currentStatus === "A Caminho") {
          timelineItems[1].classList.add("active")
        }
        
        timelineItems[1].querySelector(".timeline-content").innerHTML = `
          <h3>A Caminho</h3>
          <p>O vendedor despachou o seu pacote.</p>
          <p class="timeline-date">${formatDate(shippingDate)}</p>
        `
      }
    }
  
    // Status 3: Entrega
    if (timelineItems[2]) {
      if (currentStatus === "Entregue") {
        timelineItems[2].classList.add("completed")
        timelineItems[2].classList.add("active")
        timelineItems[2].querySelector(".timeline-content").innerHTML = `
          <h3>Entregue</h3>
          <p>Seu pedido foi entregue com sucesso!</p>
          <p class="timeline-date">${formatDate(deliveryDate)}</p>
        `
      } else {
        timelineItems[2].querySelector(".timeline-content").innerHTML = `
          <h3>Entrega</h3>
          <p>Chegará ${deliveryDateFormatted}</p>
        `
      }
    }
    
    // Atualizar endereço de entrega
    if (order.address) {
      const contactInfo = document.querySelector(".tracking-contact-info div");
      if (contactInfo) {
        contactInfo.innerHTML = `
          <p>${order.address.name}</p>
          <p>${order.address.street}, ${order.address.number} ${order.address.complement ? '- ' + order.address.complement : ''}</p>
          <p>${order.address.neighborhood} - ${order.address.city}/${order.address.state}</p>
          <p>CEP: ${order.address.zipCode}</p>
        `;
      }
    }
  }
  
  function updateOrderStatus(orderNumber, status) {
    // Obter histórico de pedidos
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  
    // Encontrar o pedido pelo número
    const orderIndex = orderHistory.findIndex((o) => o.id === orderNumber)
  
    if (orderIndex !== -1) {
      // Atualizar status
      orderHistory[orderIndex].status = status
  
      // Salvar no localStorage
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
    }
  }
  
  function showOrderDetails(orderNumber) {
    // Obter histórico de pedidos
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  
    // Encontrar o pedido pelo número
    const order = orderHistory.find((o) => o.id === orderNumber)
  
    if (!order) return
  
    // Criar modal de detalhes do pedido
    const modal = document.createElement("div")
    modal.className = "modal"
  
    // Calcular subtotal
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
    // Calcular frete (diferença entre total e subtotal)
    const shipping = order.total - subtotal
  
    // Criar HTML do modal
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalhes do Pedido ${order.id}</h2>
          <button class="close-modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="order-date">
            <strong>Data do pedido:</strong> ${new Date(order.date).toLocaleDateString("pt-BR")}
          </div>
          <div class="order-status">
            <strong>Status:</strong> ${order.status}
          </div>
          
          <h3>Itens do pedido:</h3>
          <div class="order-items">
            ${order.items
              .map(
                (item) => `
              <div class="order-item">
                <div class="item-image">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-quantity">Quantidade: ${item.quantity}</div>
                  <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Frete:</span>
              <span>${shipping > 0 ? `R$ ${shipping.toFixed(2)}` : "Grátis"}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span class="total-value">R$ ${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline close-modal">Fechar</button>
        </div>
      </div>
    `
  
    // Adicionar modal ao DOM
    document.body.appendChild(modal)
  
    // Adicionar event listeners para fechar o modal
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modal.remove()
      })
    })
  
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }
  
  function cancelOrder(orderNumber) {
    // Obter histórico de pedidos
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  
    // Encontrar o pedido pelo número
    const orderIndex = orderHistory.findIndex((o) => o.id === orderNumber)
  
    if (orderIndex !== -1) {
      // Atualizar status para cancelado
      orderHistory[orderIndex].status = "Cancelado"
  
      // Salvar no localStorage
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  
      // Mostrar notificação
      showNotification("Pedido cancelado com sucesso!")
  
      // Recarregar a página após 1.5 segundos
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }
  
  function showPaymentProblemForm() {
    // Criar modal do formulário
    const modal = document.createElement("div")
    modal.className = "modal"
  
    // Criar HTML do modal
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Relatar problema com pagamento</h2>
          <button class="close-modal">✕</button>
        </div>
        <div class="modal-body">
          <form id="payment-problem-form">
            <div class="form-group">
              <label for="problem-type">Tipo de problema:</label>
              <select id="problem-type" required>
                <option value="">Selecione o tipo de problema</option>
                <option value="double-charge">Cobrança em duplicidade</option>
                <option value="not-processed">Pagamento não processado</option>
                <option value="wrong-amount">Valor incorreto</option>
                <option value="other">Outro problema</option>
              </select>
            </div>
            <div class="form-group">
              <label for="problem-description">Descrição do problema:</label>
              <textarea id="problem-description" rows="5" required></textarea>
            </div>
            <div class="form-group">
              <label for="contact-email">E-mail para contato:</label>
              <input type="email" id="contact-email" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline close-modal">Cancelar</button>
          <button class="btn btn-primary" id="submit-problem">Enviar</button>
        </div>
      </div>
    `
  
    // Adicionar modal ao DOM
    document.body.appendChild(modal)
  
    // Adicionar event listeners para fechar o modal
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modal.remove()
      })
    })
  
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  
    // Adicionar event listener para enviar o formulário
    const submitButton = modal.querySelector("#submit-problem")
    submitButton.addEventListener("click", () => {
      const form = document.getElementById("payment-problem-form")
      const problemType = document.getElementById("problem-type").value
      const problemDescription = document.getElementById("problem-description").value
      const contactEmail = document.getElementById("contact-email").value
  
      if (problemType && problemDescription && contactEmail) {
        // Simular envio do formulário
        showNotification("Problema relatado com sucesso! Entraremos em contato em breve.")
        modal.remove()
      } else {
        // Mostrar mensagem de erro
        showNotification("Por favor, preencha todos os campos obrigatórios.")
      }
    })
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
  