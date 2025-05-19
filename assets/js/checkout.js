document.addEventListener("DOMContentLoaded", () => {
  // Carregar itens do carrinho
  renderOrderSummary();
  // Alternar métodos de pagamento
  setupPaymentMethodSwitch();
  // Cupom
  document.getElementById("apply-coupon").addEventListener("click", applyCoupon);
  // Finalizar pagamento
  document.getElementById("finish-payment").addEventListener("click", handleCheckout);

  // Preencher campos do endereço se houver salvo
  fillAddressFields();
  // Salvar endereço no localStorage ao alterar qualquer campo
  document.querySelectorAll('.address-form input').forEach(input => {
    input.addEventListener('input', saveAddressFromFields);
  });
  
  // Configurar busca de CEP automática
  setupCepSearch();
  
  // Configurar formatação de campos de cartão de crédito
  setupCreditCardFormatting();
});

let appliedDiscount = 0;
let shippingValue = 19.9;
let subtotal = 0;
let total = 0;

function renderOrderSummary() {
  // Simula leitura do carrinho do localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const orderList = document.getElementById("order-items-list");
  orderList.innerHTML = "";
  subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    orderList.innerHTML += `
      <div class="checkout-item">
        <div class="checkout-item-image"><img src="${item.image}" alt="${item.name}"></div>
        <div class="checkout-item-details">
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-qty">Qtd: ${item.quantity}</div>
        </div>
        <div class="checkout-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `;
  });
  // Frete grátis acima de 150
  shippingValue = subtotal >= 150 ? 0 : 19.9;
  document.getElementById("summary-subtotal").textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById("summary-shipping").textContent = shippingValue > 0 ? `R$ ${shippingValue.toFixed(2)}` : "Grátis";
  updateTotal();
}

function updateTotal() {
  total = subtotal + shippingValue - appliedDiscount;
  if (appliedDiscount > 0) {
    document.getElementById("summary-discount-row").style.display = "flex";
    document.getElementById("summary-discount").textContent = `-R$ ${appliedDiscount.toFixed(2)}`;
  } else {
    document.getElementById("summary-discount-row").style.display = "none";
  }
  document.getElementById("summary-total").textContent = `R$ ${total.toFixed(2)}`;
}

function setupPaymentMethodSwitch() {
  const radios = document.querySelectorAll('input[name="payment-method"]');
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      document.getElementById("payment-details-card").style.display = radio.value === "card" ? "block" : "none";
      document.getElementById("payment-details-pix").style.display = radio.value === "pix" ? "block" : "none";
      document.getElementById("payment-details-boleto").style.display = radio.value === "boleto" ? "block" : "none";
    });
  });
}

function applyCoupon() {
  const code = document.getElementById("coupon-code").value.trim().toUpperCase();
  const msg = document.getElementById("coupon-message");
  if (code === "ECO10") {
    appliedDiscount = subtotal * 0.10;
    msg.textContent = "Cupom aplicado: 10% OFF";
    msg.style.color = "#2e7d32";
  } else if (code === "PIX5" && document.querySelector('input[name="payment-method"]:checked').value === "pix") {
    appliedDiscount = subtotal * 0.05;
    msg.textContent = "Cupom aplicado: 5% OFF no Pix";
    msg.style.color = "#2e7d32";
  } else if (code) {
    appliedDiscount = 0;
    msg.textContent = "Cupom inválido.";
    msg.style.color = "#e74c3c";
  } else {
    appliedDiscount = 0;
    msg.textContent = "";
  }
  updateTotal();
}

function handleCheckout(event) {
  // Prevent default form submission behavior
  event.preventDefault();
  
  console.log("Checkout process started");
  
  // Validar endereço antes de prosseguir
  const address = {
    name: document.getElementById("address-name").value.trim(),
    street: document.getElementById("address-street").value.trim(),
    number: document.getElementById("address-number").value.trim(),
    complement: document.getElementById("address-complement").value.trim(),
    neighborhood: document.getElementById("address-neighborhood").value.trim(),
    city: document.getElementById("address-city").value.trim(),
    state: document.getElementById("address-state").value.trim(),
    zipCode: document.getElementById("address-zip").value.trim()
  };
  if (!address.name || !address.street || !address.number || !address.neighborhood || !address.city || !address.state || !address.zipCode) {
    showNotification("Preencha todos os campos do endereço antes de finalizar o pagamento.");
    return;
  }
  localStorage.setItem("checkoutAddress", JSON.stringify(address));
  
  // Validação simples
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  if (paymentMethod === "card") {
    const cardNumber = document.getElementById("card-number").value.trim();
    const cardExpiry = document.getElementById("card-expiry").value.trim();
    const cardCvv = document.getElementById("card-cvv").value.trim();
    const cardName = document.getElementById("card-name").value.trim();
    if (!/^[0-9\s]{13,19}$/.test(cardNumber.replace(/\s/g, "")) || !/^[0-9]{2}\/[0-9]{2}$/.test(cardExpiry) || !/^[0-9]{3,4}$/.test(cardCvv) || !cardName) {
      showNotification("Preencha corretamente os dados do cartão.");
      return;
    }
  }

  // Desabilitar o botão de finalizar compra
  const finishButton = document.getElementById("finish-payment");
  finishButton.disabled = true;
  finishButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando pagamento...';

  // Processar o pagamento imediatamente sem setTimeout
  processPayment(finishButton, address, paymentMethod);
}

// Nova função para processar o pagamento
function processPayment(finishButton, address, paymentMethod) {
  console.log("Processing payment...");
  
  // Obter carrinho
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    showNotification("Carrinho vazio.");
    finishButton.disabled = false;
    finishButton.innerHTML = '<i class="fa-solid fa-lock"></i> Finalizar Pagamento';
    return;
  }

  const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
  const orderId = `ECO-${Math.floor(Math.random()*900000+100000)}`;
  
  // Simular processamento do pagamento (90% de chance de sucesso)
  const paymentStatus = Math.random() > 0.1;

  if (paymentStatus) {
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total: total,
      status: "Em preparação",
      address: address,
      paymentMethod: paymentMethod
    };
    
    // Adicionar ao histórico
    orderHistory.push(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    
    // Limpar o carrinho
    localStorage.removeItem("cart");
    
    // Salvar o ID do pedido atual para a página de confirmação acessar
    localStorage.setItem("currentOrderId", orderId);
    
    showNotification("Pagamento realizado com sucesso! Redirecionando...");
    
    console.log("Payment successful, redirecting to:", `confirmation.html?order=${orderId}`);
    
    // Redirecionar imediatamente para a página de confirmação
    setTimeout(() => {
      window.location.href = `confirmation.html?order=${orderId}`;
    }, 1000);
  } else {
    showNotification("Erro no processamento do pagamento. Tente novamente.");
    finishButton.disabled = false;
    finishButton.innerHTML = '<i class="fa-solid fa-lock"></i> Finalizar Pagamento';
  }
}

function showNotification(msg) {
  let notification = document.querySelector(".notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification";
    document.body.appendChild(notification);
  }
  notification.textContent = msg;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function fillAddressFields() {
  const address = getSavedAddress();
  document.getElementById("address-name").value = address.name || "";
  document.getElementById("address-street").value = address.street || "";
  document.getElementById("address-number").value = address.number || "";
  document.getElementById("address-complement").value = address.complement || "";
  document.getElementById("address-neighborhood").value = address.neighborhood || "";
  document.getElementById("address-city").value = address.city || "";
  document.getElementById("address-state").value = address.state || "";
  document.getElementById("address-zip").value = address.zipCode || "";
}

function saveAddressFromFields() {
  const address = {
    name: document.getElementById("address-name").value.trim(),
    street: document.getElementById("address-street").value.trim(),
    number: document.getElementById("address-number").value.trim(),
    complement: document.getElementById("address-complement").value.trim(),
    neighborhood: document.getElementById("address-neighborhood").value.trim(),
    city: document.getElementById("address-city").value.trim(),
    state: document.getElementById("address-state").value.trim(),
    zipCode: document.getElementById("address-zip").value.trim()
  };
  localStorage.setItem("checkoutAddress", JSON.stringify(address));
}

function getSavedAddress() {
  return JSON.parse(localStorage.getItem("checkoutAddress") || "{}")
}

function displaySavedAddress() {
  const address = getSavedAddress();
  document.getElementById("address-name").textContent = address.name || "Nome não informado";
  document.getElementById("address-street").textContent = address.street && address.number ? `${address.street}, ${address.number}${address.complement ? ' - ' + address.complement : ''}` : "Rua não informada";
  document.getElementById("address-city").textContent = address.neighborhood && address.city && address.state ? `${address.neighborhood} - ${address.city}/${address.state}` : "Cidade não informada";
  document.getElementById("address-zip").textContent = address.zipCode ? `CEP: ${address.zipCode}` : "CEP não informado";
}

// Função para configurar a busca automática por CEP
function setupCepSearch() {
  const cepInput = document.getElementById('address-zip');
  if (cepInput) {
    // Formatar o CEP ao digitar (99999-999)
    cepInput.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
      }
      this.value = value;
      
      // Se tiver 8 dígitos, buscar o CEP
      if (value.replace(/\D/g, '').length === 8) {
        searchAddressByCep(value);
      }
    });
    
    // Buscar também ao perder o foco
    cepInput.addEventListener('blur', function() {
      const cep = this.value.replace(/\D/g, '');
      if (cep.length === 8) {
        searchAddressByCep(cep);
      }
    });
  }
}

// Função para buscar endereço pelo CEP na API ViaCEP
function searchAddressByCep(cep) {
  // Remover caracteres não numéricos
  cep = cep.replace(/\D/g, '');
  
  // Validar o CEP básico
  if (cep.length !== 8) return;
  
  // Mostrar indicador de carregamento
  document.getElementById('address-street').value = 'Carregando...';
  
  // Fazer requisição à API ViaCEP
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        // Preencher os campos com os dados retornados
        document.getElementById('address-street').value = data.logradouro || '';
        document.getElementById('address-neighborhood').value = data.bairro || '';
        document.getElementById('address-city').value = data.localidade || '';
        document.getElementById('address-state').value = data.uf || '';
        
        // Focar no campo número, que precisa ser preenchido pelo usuário
        document.getElementById('address-number').focus();
        
        // Salvar os dados preenchidos
        saveAddressFromFields();
        
        // Mostrar notificação
        showNotification('Endereço encontrado! Complete o número.');
      } else {
        showNotification('CEP não encontrado. Verifique o número informado.');
        document.getElementById('address-street').value = '';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar CEP:', error);
      showNotification('Erro ao buscar o CEP. Tente novamente.');
      document.getElementById('address-street').value = '';
    });
}

// Configurar formatação de campos de cartão de crédito
function setupCreditCardFormatting() {
  // Formatação do número do cartão: XXXX XXXX XXXX XXXX
  const cardNumber = document.getElementById('card-number');
  if (cardNumber) {
    cardNumber.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, ''); // Remove tudo que não é número
      // Limita a 16 dígitos para a maioria dos cartões
      if (value.length > 16) value = value.substring(0, 16);
      
      // Formata com espaços a cada 4 dígitos
      let formattedValue = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      
      this.value = formattedValue;
    });
  }
  
  // Formatação da data de validade: MM/AA
  const cardExpiry = document.getElementById('card-expiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      // Limita a 4 dígitos (MMAA)
      if (value.length > 4) value = value.substring(0, 4);
      
      // Formata como MM/AA
      if (value.length > 2) {
        // Limita mês entre 01-12
        let month = parseInt(value.substring(0, 2));
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        month = month.toString().padStart(2, '0');
        
        value = month + value.substring(2);
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      
      this.value = value;
    });
    
    // Corrige formatação quando perde o foco
    cardExpiry.addEventListener('blur', function() {
      const value = this.value.replace(/\D/g, '');
      if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2));
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        month = month.toString().padStart(2, '0');
        
        let year = value.length > 2 ? value.substring(2) : '';
        year = year.padEnd(2, '0');
        
        this.value = month + '/' + year;
      }
    });
  }
  
  // Formatação do CVV: apenas números, 3-4 dígitos
  const cardCvv = document.getElementById('card-cvv');
  if (cardCvv) {
    cardCvv.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      // Limita a 4 dígitos
      if (value.length > 4) value = value.substring(0, 4);
      this.value = value;
    });
  }
} 