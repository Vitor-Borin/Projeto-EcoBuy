document.addEventListener("DOMContentLoaded", () => {
    // Carregar produtos na página
    loadProducts()
  
    // Adicionar event listeners para filtros
    setupFilters()
  
    // Adicionar event listener para ordenação
    setupSorting()
  })
  
  // Mock productsDatabase (replace with actual data loading if needed)
  const productsDatabase = {}
  
  function loadProducts() {
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search)
    const categoria = urlParams.get("categoria")
    const sort = urlParams.get("sort")
  
    // Filtrar produtos por categoria se especificado
    let filteredProducts = Object.values(productsDatabase)
  
    if (categoria) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === categoria.toLowerCase() ||
          (product.tags && product.tags.includes(categoria.toLowerCase())),
      )
  
      // Atualizar título da página
      updateCategoryTitle(categoria)
    }
  
    // Ordenar produtos se especificado
    if (sort) {
      sortProducts(filteredProducts, sort)
    }
  
    // Renderizar produtos
    renderProducts(filteredProducts)
  }
  
  function updateCategoryTitle(categoria) {
    const categoryTitle = document.getElementById("category-title")
    if (categoryTitle) {
      // Formatar o nome da categoria (primeira letra maiúscula)
      const formattedCategory = categoria.charAt(0).toUpperCase() + categoria.slice(1)
      categoryTitle.textContent = formattedCategory
    }
  }
  
  function sortProducts(products, sortType) {
    switch (sortType) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        products.sort((a, b) => b.price - a.price)
        break
      case "rating":
        products.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // Simulando produtos mais recentes (aleatório para este exemplo)
        products.sort(() => Math.random() - 0.5)
        break
      case "bestseller":
        products.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Relevância (padrão)
        break
    }
  
    // Atualizar select de ordenação
    const sortSelect = document.getElementById("sort-select")
    if (sortSelect && sortType) {
      sortSelect.value = sortType
    }
  }
  
  function renderProducts(products) {
    const productsGrid = document.getElementById("products-grid")
    if (!productsGrid) return
  
    // Limpar grid
    productsGrid.innerHTML = ""
  
    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products-message">
          <h2>Nenhum produto encontrado</h2>
          <p>Tente buscar por outros termos ou categorias.</p>
          <a href="produtos.html" class="btn btn-outline-green">Ver todos os produtos</a>
        </div>
      `
      return
    }
  
    // Adicionar produtos
    products.forEach((product) => {
      productsGrid.appendChild(createProductCard(product))
    })
  }
  
  // Mock toggleWishlist function (replace with actual implementation)
  function toggleWishlist(productId) {
    console.log(`Toggle wishlist for product ID: ${productId}`)
    // Implement your wishlist logic here
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
  
    // Adicionar conteúdo do card
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
        <button class="btn btn-add-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Adicionar ao carrinho
        </button>
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
  
  function setupFilters() {
    // Adicionar event listener para botão de aplicar filtros
    const applyFilterButton = document.querySelector(".btn-outline-green.filter-button")
    if (applyFilterButton) {
      applyFilterButton.addEventListener("click", applyFilters)
    }
  
    // Adicionar event listener para botão de limpar filtros
    const clearFilterButton = document.querySelector(".btn-outline.filter-button")
    if (clearFilterButton) {
      clearFilterButton.addEventListener("click", () => {
        window.location.href = "produtos.html"
      })
    }
  
    // Marcar filtros ativos com base na URL
    markActiveFilters()
  }
  
  function markActiveFilters() {
    const urlParams = new URLSearchParams(window.location.search)
    const categoria = urlParams.get("categoria")
  
    if (categoria) {
      // Marcar link de categoria ativo
      const categoryLinks = document.querySelectorAll(".filter-link")
      categoryLinks.forEach((link) => {
        const href = new URL(link.href)
        const linkCategoria = new URLSearchParams(href.search).get("categoria")
  
        if (linkCategoria && linkCategoria.toLowerCase() === categoria.toLowerCase()) {
          link.classList.add("active")
        }
      })
    }
  }
  
  function applyFilters() {
    // Obter valores dos filtros de preço
    const priceFilters = document.querySelectorAll('input[name="price"]:checked')
    const priceRanges = Array.from(priceFilters).map((input) => input.value)
  
    // Obter valores dos filtros de características
    const featureFilters = document.querySelectorAll('input[name="feature"]:checked')
    const features = Array.from(featureFilters).map((input) => input.value)
  
    // Obter categoria atual da URL
    const urlParams = new URLSearchParams(window.location.search)
    const categoria = urlParams.get("categoria")
  
    // Construir nova URL com filtros
    const newUrl = new URL(window.location.href)
    const newParams = new URLSearchParams()
  
    if (categoria) {
      newParams.set("categoria", categoria)
    }
  
    if (priceRanges.length > 0) {
      newParams.set("price", priceRanges.join(","))
    }
  
    if (features.length > 0) {
      newParams.set("features", features.join(","))
    }
  
    // Atualizar URL e recarregar
    newUrl.search = newParams.toString()
    window.location.href = newUrl.toString()
  }
  
  function setupSorting() {
    const sortSelect = document.getElementById("sort-select")
    if (sortSelect) {
      // Definir valor inicial com base na URL
      const urlParams = new URLSearchParams(window.location.search)
      const sort = urlParams.get("sort")
      if (sort) {
        sortSelect.value = sort
      }
  
      // Adicionar event listener para mudança de ordenação
      sortSelect.addEventListener("change", () => {
        const newUrl = new URL(window.location.href)
        const newParams = new URLSearchParams(newUrl.search)
  
        newParams.set("sort", sortSelect.value)
        newUrl.search = newParams.toString()
  
        window.location.href = newUrl.toString()
      })
    }
  }
  
  // Adicionar novos produtos ao banco de dados
  const newProducts = {
    "shampoo-bar": {
      id: "shampoo-bar",
      name: "Shampoo em Barra Natural",
      price: 35.0,
      originalPrice: 45.0,
      image: "images/placeholder.jpg",
      discount: 22,
      description: "Shampoo em barra 100% natural, sem sulfatos e sem plástico. Ideal para cabelos normais a secos.",
      category: "cabelo",
      rating: 4.7,
      stock: 30,
      tags: ["cabelo", "zero waste", "vegano", "natural"],
    },
    "conditioner-bar": {
      id: "conditioner-bar",
      name: "Condicionador em Barra",
      price: 38.0,
      originalPrice: 48.0,
      image: "images/placeholder.jpg",
      discount: 20,
      description: "Condicionador em barra que hidrata profundamente os cabelos sem deixar resíduos.",
      category: "cabelo",
      rating: 4.6,
      stock: 25,
      tags: ["cabelo", "zero waste", "vegano", "natural"],
    },
    "face-serum": {
      id: "face-serum",
      name: "Sérum Facial Vitamina C",
      price: 89.0,
      originalPrice: 110.0,
      image: "images/placeholder.jpg",
      discount: 19,
      description:
        "Sérum facial com vitamina C que ilumina, uniformiza o tom da pele e combate os sinais de envelhecimento.",
      category: "rosto",
      rating: 4.9,
      stock: 15,
      tags: ["rosto", "skincare", "vegano"],
    },
    "bamboo-toothbrush": {
      id: "bamboo-toothbrush",
      name: "Escova de Dentes de Bambu",
      price: 15.0,
      originalPrice: null,
      image: "images/placeholder.jpg",
      discount: null,
      description: "Escova de dentes sustentável feita de bambu biodegradável com cerdas macias.",
      category: "casa",
      rating: 4.5,
      stock: 50,
      tags: ["casa", "zero waste", "sustentável"],
    },
    "coconut-soap": {
      id: "coconut-soap",
      name: "Sabonete de Coco Orgânico",
      price: 18.0,
      originalPrice: 22.0,
      image: "images/placeholder.jpg",
      discount: 18,
      description: "Sabonete artesanal feito com óleo de coco orgânico, ideal para peles sensíveis.",
      category: "corpo",
      rating: 4.8,
      stock: 40,
      tags: ["corpo", "organico", "vegano"],
    },
    "makeup-remover": {
      id: "makeup-remover",
      name: "Demaquilante Natural",
      price: 45.0,
      originalPrice: null,
      image: "images/placeholder.jpg",
      discount: null,
      description:
        "Demaquilante suave e eficaz feito com ingredientes naturais que removem até maquiagem à prova d'água.",
      category: "maquiagem",
      rating: 4.7,
      stock: 20,
      tags: ["maquiagem", "rosto", "vegano"],
    },
    "lip-tint": {
      id: "lip-tint",
      name: "Lip Tint Natural",
      price: 32.0,
      originalPrice: null,
      image: "images/placeholder.jpg",
      discount: null,
      description: "Lip tint natural com pigmentos de frutas que hidrata e dá cor aos lábios.",
      category: "maquiagem",
      rating: 4.6,
      stock: 35,
      tags: ["maquiagem", "vegano", "natural"],
    },
    "reusable-pads": {
      id: "reusable-pads",
      name: "Discos Desmaquilantes Reutilizáveis",
      price: 28.0,
      originalPrice: 35.0,
      image: "images/placeholder.jpg",
      discount: 20,
      description: "Conjunto com 6 discos desmaquilantes reutilizáveis e laváveis, feitos de algodão orgânico.",
      category: "casa",
      rating: 4.8,
      stock: 30,
      tags: ["casa", "zero waste", "sustentável"],
    },
    "hair-oil": {
      id: "hair-oil",
      name: "Óleo Capilar Nutritivo",
      price: 65.0,
      originalPrice: null,
      image: "images/placeholder.jpg",
      discount: null,
      description: "Óleo capilar com blend de óleos vegetais que nutre, fortalece e dá brilho aos cabelos.",
      category: "cabelo",
      rating: 4.9,
      stock: 18,
      tags: ["cabelo", "vegano", "natural"],
    },
    "face-mask": {
      id: "face-mask",
      name: "Máscara Facial de Argila Verde",
      price: 42.0,
      originalPrice: 55.0,
      image: "images/placeholder.jpg",
      discount: 24,
      description: "Máscara facial de argila verde que purifica, controla a oleosidade e minimiza os poros.",
      category: "rosto",
      rating: 4.7,
      stock: 25,
      tags: ["rosto", "skincare", "natural"],
    },
    "gift-box": {
      id: "gift-box",
      name: "Kit Presente Eco Spa",
      price: 180.0,
      originalPrice: 220.0,
      image: "images/placeholder.jpg",
      discount: 18,
      description:
        "Kit presente com produtos sustentáveis para um spa day em casa: sabonete, máscara facial, óleo corporal e vela aromática.",
      category: "kits",
      rating: 4.9,
      stock: 10,
      tags: ["kits", "presente", "sustentável"],
    },
    "solid-perfume": {
      id: "solid-perfume",
      name: "Perfume Sólido Floral",
      price: 55.0,
      originalPrice: null,
      image: "images/placeholder.jpg",
      discount: null,
      description: "Perfume sólido com notas florais, fácil de transportar e com longa duração.",
      category: "perfumaria",
      rating: 4.6,
      stock: 20,
      tags: ["perfumaria", "zero waste", "vegano"],
    },
  }
  
  // Adicionar novos produtos ao banco de dados existente
  Object.assign(productsDatabase, newProducts)
  