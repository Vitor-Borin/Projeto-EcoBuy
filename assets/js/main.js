// Dados de produtos (simulando um banco de dados no front-end)
const productsDatabase = {
  "skincare-kit": {
    id: "skincare-kit",
    name: "Mini Kit Completo Skincare",
    price: 146.0,
    originalPrice: 227.0,
    image: "./assets/img/Produto1.jpeg",
    discount: 35,
    description: "Kit completo para cuidados com a pele, contendo produtos veganos e sustentáveis.",
    category: "skincare",
    rating: 4.8,
    stock: 15,
    tags: ["vegano", "sustentável", "skincare"],
  },
  "facial-cream": {
    id: "facial-cream",
    name: "Creme Facial Vegano",
    price: 98.0,
    originalPrice: 120.0,
    image: "./assets/img/Produto2.jpeg",
    discount: 18,
    description: "Creme facial vegano com ingredientes naturais para hidratação profunda.",
    category: "skincare",
    rating: 4.5,
    stock: 20,
    tags: ["vegano", "hidratante", "facial"],
  },
  "body-lotion": {
    id: "body-lotion",
    name: "Loção Corporal - Skin Veg",
    price: 99.0,
    originalPrice: 110.0,
    image: "./assets/img/Produto3.jpeg",
    discount: 10,
    description: "Loção corporal vegana para hidratação intensa da pele.",
    category: "corpo",
    rating: 4.7,
    stock: 18,
    tags: ["vegano", "hidratante", "corporal"],
  },
  "cleaning-kit": {
    id: "cleaning-kit",
    name: "Kit de Limpeza Zero Resíduos",
    price: 180.0,
    originalPrice: 300.0,
    image: "./assets/img/Produto4.jpeg",
    discount: 40,
    description:
      "O trio perfeito para uma pele radiante e sustentável! Nosso Kit de Limpeza Zero Resíduos vem com sérum facial, protetor solar e loção corporal.",
    category: "limpeza",
    rating: 4.9,
    stock: 10,
    tags: ["zero resíduos", "sustentável", "kit"],
  },
  "oil-moisturizer": {
    id: "oil-moisturizer",
    name: "Óleo para massagem",
    price: 85.0,
    originalPrice: null,
    image: "./assets/img/Produto1.jpeg",
    discount: null,
    description: "Óleo natural para massagem corporal, com propriedades relaxantes.",
    category: "corpo",
    rating: 4.6,
    stock: 25,
    tags: ["óleo", "massagem", "relaxante"],
  },
  perfume: {
    id: "perfume",
    name: "Perfume natural spray",
    price: 120.0,
    originalPrice: null,
    image: "./assets/img/Produto2.jpeg",
    discount: null,
    description: "Perfume natural em spray com fragrância duradoura e ingredientes sustentáveis.",
    category: "perfumaria",
    rating: 4.4,
    stock: 30,
    tags: ["perfume", "natural", "spray"],
  },
  "lip-balm": {
    id: "lip-balm",
    name: "Lip Balm Hidratante",
    price: 35.0,
    originalPrice: null,
    image: "./assets/img/Produto3.jpeg",
    discount: null,
    description: "Hidratante labial com ingredientes naturais para lábios macios e protegidos.",
    category: "lábios",
    rating: 4.7,
    stock: 40,
    tags: ["lip balm", "hidratante", "lábios"],
  },
  "hydration-kit": {
    id: "hydration-kit",
    name: "Kit hidratação profunda",
    price: 97.0,
    originalPrice: null,
    image: "./assets/img/Produto4.jpeg",
    discount: null,
    description: "Kit completo para hidratação profunda da pele, com produtos veganos e naturais.",
    category: "hidratação",
    rating: 4.8,
    stock: 12,
    tags: ["hidratação", "kit", "vegano"],
  },
}

// Funções comuns para todas as páginas
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o carrinho se não existir
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]))
  }

  // Inicializar a lista de favoritos se não existir
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]))
  }

  // Atualizar contador do carrinho no ícone
  updateCartCount()

  // Carregar produtos na página inicial
  if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
    loadFeaturedProducts()
    loadBestSellingProducts()

    // Inicializar o carrossel de categorias infinito
    setupInfiniteCarousel()
  }

  // Adicionar event listeners para botões de adicionar ao carrinho
  document.addEventListener("click", (e) => {
    // Delegação de eventos para botões de adicionar ao carrinho
    if (e.target.classList.contains("btn-add-cart") || e.target.classList.contains("btn-add-cart-large")) {
      e.preventDefault()
      const productCard = e.target.closest(".product-card") || e.target.closest(".product-info-detail")

      if (productCard) {
        let productId

        // Verificar se estamos na página de produto
        if (window.location.pathname.includes("product.html")) {
          const urlParams = new URLSearchParams(window.location.search)
          productId = urlParams.get("id")
        } else {
          // Estamos na página inicial ou outra página com cards de produto
          const productLink = productCard.querySelector("a")
          if (productLink && productLink.href) {
            const url = new URL(productLink.href)
            const searchParams = new URLSearchParams(url.search)
            productId = searchParams.get("id")
          }
        }

        if (productId && productsDatabase[productId]) {
          const product = productsDatabase[productId]

          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          })

          showNotification(`${product.name} adicionado ao carrinho!`)
        }
      }
    }
  })

  // Adicionar funcionalidade de busca
  const searchInput = document.querySelector(".search-box input")
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        const searchTerm = this.value.trim().toLowerCase()
        if (searchTerm) {
          // Salvar termo de busca no localStorage
          localStorage.setItem("searchTerm", searchTerm)
          // Redirecionar para a página de resultados (que seria a página inicial com filtro)
          window.location.href = "index.html?search=" + encodeURIComponent(searchTerm)
        }
      }
    })

    // Verificar se há um termo de busca na URL
    const urlParams = new URLSearchParams(window.location.search)
    const searchTerm = urlParams.get("search")
    if (searchTerm) {
      searchInput.value = searchTerm
      // Se estamos na página inicial, filtrar os produtos
      if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
        filterProductsBySearch(searchTerm)
      }
    }
  }

  // Verificar se há cupom aplicado
  checkAppliedCoupon()
})

// Configurar o carrossel infinito
function setupInfiniteCarousel() {
  const slider = document.querySelector(".categories-slider")
  if (!slider) return

  // Duplicar os itens para criar o efeito infinito
  const items = slider.querySelectorAll(".category-card")
  const itemsArray = Array.from(items)

  // Clonar os itens e adicionar ao final
  itemsArray.forEach((item) => {
    const clone = item.cloneNode(true)
    slider.appendChild(clone)
  })
}

// Funções auxiliares
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  // Verificar se o produto já está no carrinho
  const existingProductIndex = cart.findIndex((item) => item.id === product.id)

  if (existingProductIndex >= 0) {
    // Atualizar quantidade se o produto já existir
    cart[existingProductIndex].quantity += product.quantity
  } else {
    // Adicionar novo produto
    cart.push(product)
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
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

function loadFeaturedProducts() {
  const featuredProductsGrid = document.querySelector(".products-section:first-of-type .product-grid")
  if (!featuredProductsGrid) return

  // Selecionar 4 produtos aleatórios para destaque
  const featuredProducts = Object.values(productsDatabase)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)

  // Limpar grid
  featuredProductsGrid.innerHTML = ""

  // Adicionar produtos
  featuredProducts.forEach((product) => {
    featuredProductsGrid.appendChild(createProductCard(product))
  })
}

function loadBestSellingProducts() {
  const bestSellingGrid = document.querySelector(".products-section:last-of-type .product-grid")
  if (!bestSellingGrid) return

  // Selecionar produtos com maior rating para "mais vendidos"
  const bestSellingProducts = Object.values(productsDatabase)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  // Limpar grid
  bestSellingGrid.innerHTML = ""

  // Adicionar produtos
  bestSellingProducts.forEach((product) => {
    bestSellingGrid.appendChild(createProductCard(product))
  })
}

function createProductCard(product) {
  const productCard = document.createElement("div")
  productCard.className = "product-card"

  // Adicionar badge de desconto se houver
  if (product.discount) {
    const discountBadge = document.createElement("div")
    discountBadge.className = "discount-badge"
    discountBadge.textContent = `-${product.discount}%`
    productCard.appendChild(discountBadge)
  }

  // Adicionar botão de favoritos
  const wishlistButton = document.createElement("button")
  wishlistButton.className = "btn-wishlist"
  wishlistButton.setAttribute("data-id", product.id)

  // Verificar se o produto está na lista de desejos
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const isInWishlist = wishlist.includes(product.id)

  wishlistButton.innerHTML = isInWishlist
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`

  if (isInWishlist) {
    wishlistButton.classList.add("active")
  }

  wishlistButton.addEventListener("click", () => {
    toggleWishlist(product.id)
  })

  productCard.appendChild(wishlistButton)

  productCard.innerHTML += `
    <a href="product.html?id=${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
    </a>
    <div class="product-info">
      <h3>${product.name}</h3>
      <div class="product-price">
        <span class="current-price">R$ ${product.price.toFixed(2)}</span>
        ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>` : ""}
      </div>
      <div class="product-rating">
        ${generateStarRating(product.rating)}
        <span class="rating-value">${product.rating.toFixed(1)}</span>
      </div>
      <button class="btn btn-add-cart">Adicionar ao carrinho</button>
    </div>
  `

  return productCard
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  let starsHTML = ""

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
  }

  // Half star
  if (halfStar) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></path><path d="M12 2L12 17.77" fill="none"></path></svg>`
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
  }

  return starsHTML
}

function filterProductsBySearch(searchTerm) {
  searchTerm = searchTerm.toLowerCase()

  // Filtrar produtos que correspondem ao termo de busca
  const filteredProducts = Object.values(productsDatabase).filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    )
  })

  // Atualizar a exibição dos produtos
  updateProductDisplay(filteredProducts)
}

function updateProductDisplay(products) {
  // Encontrar todas as seções de produtos
  const productGrids = document.querySelectorAll(".product-grid")

  if (products.length === 0) {
    // Não encontrou produtos
    const container = document.querySelector(".container")

    // Verificar se já existe uma mensagem de "nenhum produto encontrado"
    let noProductsMessage = document.querySelector(".no-products-message")

    if (!noProductsMessage) {
      noProductsMessage = document.createElement("div")
      noProductsMessage.className = "no-products-message"
      noProductsMessage.innerHTML = `
        <h2>Nenhum produto encontrado</h2>
        <p>Tente buscar por outros termos ou categorias.</p>
        <button class="btn btn-outline" onclick="window.location.href='index.html'">Ver todos os produtos</button>
      `

      // Inserir após a primeira seção de produtos
      if (productGrids.length > 0) {
        productGrids[0].parentNode.insertBefore(noProductsMessage, productGrids[0].nextSibling)
      } else {
        container.appendChild(noProductsMessage)
      }
    }

    // Esconder as seções de produtos
    productGrids.forEach((grid) => {
      grid.parentNode.style.display = "none"
    })

    return
  }

  // Mostrar as seções de produtos
  productGrids.forEach((grid) => {
    grid.parentNode.style.display = "block"
  })

  // Remover mensagem de "nenhum produto encontrado" se existir
  const noProductsMessage = document.querySelector(".no-products-message")
  if (noProductsMessage) {
    noProductsMessage.remove()
  }

  // Atualizar a primeira seção de produtos com os resultados da busca
  if (productGrids.length > 0) {
    const firstGrid = productGrids[0]
    firstGrid.innerHTML = ""

    // Atualizar o título da seção
    const sectionHeader = firstGrid.previousElementSibling
    if (sectionHeader && sectionHeader.querySelector("h2")) {
      sectionHeader.querySelector("h2").textContent = "RESULTADOS DA BUSCA"
    }

    // Adicionar os produtos filtrados
    products.forEach((product) => {
      const productCard = createProductCard(product)
      firstGrid.appendChild(productCard)
    })
  }
}

function checkAppliedCoupon() {
  const appliedCoupon = localStorage.getItem("appliedCoupon")

  if (appliedCoupon) {
    // Mostrar banner de cupom aplicado
    const couponBanner = document.querySelector(".coupon-banner")
    if (couponBanner) {
      couponBanner.innerHTML = `<p>Cupom <strong>${appliedCoupon}</strong> aplicado! Ganhe 3% OFF em sua compra.</p>`
      couponBanner.classList.add("coupon-applied")
    }
  }
}

// Adicionar ao escopo global para uso em HTML
window.applyFilter = (category) => {
  // Filtrar produtos por categoria
  const filteredProducts = Object.values(productsDatabase).filter((product) => {
    return product.category.toLowerCase() === category.toLowerCase()
  })

  // Atualizar a exibição dos produtos
  updateProductDisplay(filteredProducts)

  // Atualizar classe ativa no menu
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.textContent.toLowerCase() === category.toLowerCase()) {
      link.classList.add("active")
    }
  })
}

window.clearFilters = () => {
  // Recarregar a página para limpar os filtros
  window.location.href = "index.html"
}

function toggleWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

  // Verificar se o produto já está na lista de desejos
  const index = wishlist.indexOf(productId)

  if (index === -1) {
    // Adicionar à lista de desejos
    wishlist.push(productId)
    showNotification("Produto adicionado aos favoritos!")
  } else {
    // Remover da lista de desejos
    wishlist.splice(index, 1)
    showNotification("Produto removido dos favoritos!")
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))

  // Atualizar o botão de favoritos
  const wishlistButtons = document.querySelectorAll(`.btn-wishlist[data-id="${productId}"]`)
  wishlistButtons.forEach((button) => {
    if (index === -1) {
      button.classList.add("active")
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
    } else {
      button.classList.remove("active")
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
    }
  })
}

// Expor funções para uso global
window.toggleWishlist = toggleWishlist
