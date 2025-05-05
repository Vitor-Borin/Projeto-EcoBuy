document.addEventListener("DOMContentLoaded", () => {
  // Obter ID do produto da URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (productId) {
    loadProductDetails(productId)
    loadRecommendedProducts(productId)
  }

  // Funcionalidade para trocar imagens na galeria
  setupImageGallery()

  // Funcionalidade para calcular frete
  setupShippingCalculator()

  // Inicializar avaliações
  setupRatings()

  // Verificar se o produto está na lista de desejos
  checkWishlistStatus(productId)
})

function loadProductDetails(productId) {
  // Verificar se temos o produto no "banco de dados" do front-end
  if (window.productsDatabase && window.productsDatabase[productId]) {
    const product = window.productsDatabase[productId]

    // Atualizar título da página
    document.title = `${product.name} - ecobuy`

    // Atualizar elementos da página com os dados do produto
    document.querySelector("h1").textContent = product.name
    document.querySelector(".product-description").textContent = product.description
    document.querySelector(".current-price").textContent = `R$ ${product.price.toFixed(2)}`

    if (product.originalPrice) {
      document.querySelector(".original-price").textContent = `R$ ${product.originalPrice.toFixed(2)}`
    } else {
      // Se não houver preço original, remover o elemento
      const originalPriceElement = document.querySelector(".original-price")
      if (originalPriceElement) {
        originalPriceElement.remove()
      }
    }

    // Atualizar badge de desconto
    const discountBadge = document.querySelector(".discount-badge")
    if (discountBadge) {
      if (product.discount) {
        discountBadge.textContent = `-${product.discount}%`
      } else {
        discountBadge.style.display = "none"
      }
    }

    // Atualizar informação de parcelas
    const installmentInfo = document.querySelector(".installment-info")
    if (installmentInfo) {
      const installmentValue = (product.price / 2).toFixed(2)
      installmentInfo.textContent = `2 x de R$ ${installmentValue}`
    }

    // Atualizar imagem principal
    const mainImage = document.getElementById("main-product-image")
    if (mainImage) {
      mainImage.src = product.image
      mainImage.alt = product.name
    }

    // Atualizar tags do produto
    const tagsContainer = document.querySelector(".product-tags")
    if (tagsContainer && product.tags) {
      tagsContainer.innerHTML = ""
      product.tags.forEach((tag) => {
        const tagElement = document.createElement("span")
        tagElement.className = "tag"
        tagElement.textContent = tag
        tagsContainer.appendChild(tagElement)
      })
    }

    // Adicionar avaliações
    const ratingContainer = document.createElement("div")
    ratingContainer.className = "product-rating"
    ratingContainer.innerHTML = `
      ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
      <span class="rating-value">${product.rating.toFixed(1)}</span>
      <span class="rating-count">(${Math.floor(product.rating * 10)} avaliações)</span>
    `

    // Inserir após a descrição do produto
    const descriptionElement = document.querySelector(".product-description")
    if (descriptionElement) {
      descriptionElement.after(ratingContainer)
    }

    // Adicionar informação de estoque
    const stockInfo = document.createElement("div")
    stockInfo.className = "stock-info"

    if (product.stock > 10) {
      stockInfo.innerHTML = `<span class="in-stock">Em estoque</span>`
    } else if (product.stock > 0) {
      stockInfo.innerHTML = `<span class="low-stock">Apenas ${product.stock} em estoque</span>`
    } else {
      stockInfo.innerHTML = `<span class="out-of-stock">Fora de estoque</span>`
    }

    // Inserir após as tags do produto
    const tagsElement = document.querySelector(".product-tags")
    if (tagsElement) {
      tagsElement.after(stockInfo)
    }

    // Adicionar botão de favoritos
    const addToCartButton = document.querySelector(".btn-add-cart-large")
    if (addToCartButton) {
      const wishlistButton = document.createElement("button")
      wishlistButton.className = "btn btn-wishlist-large"
      wishlistButton.setAttribute("data-id", product.id)
      wishlistButton.textContent = "❤ Adicionar aos favoritos"
      wishlistButton.onclick = () => {
        toggleWishlist(product.id)
      }

      // Inserir após o botão de adicionar ao carrinho
      addToCartButton.after(wishlistButton)
    }

    // Simular carregamento de imagens adicionais
    const thumbnailGallery = document.querySelector(".thumbnail-gallery")
    if (thumbnailGallery) {
      thumbnailGallery.innerHTML = ""

      // Adicionar a imagem principal como primeira thumbnail
      const mainThumbnail = document.createElement("div")
      mainThumbnail.className = "thumbnail active"
      mainThumbnail.setAttribute("data-image", product.image)
      mainThumbnail.innerHTML = `<img src="${product.image}" alt="${product.name} - imagem 1">`
      thumbnailGallery.appendChild(mainThumbnail)

      // Adicionar mais 3 thumbnails simuladas
      for (let i = 2; i <= 4; i++) {
        const thumbnail = document.createElement("div")
        thumbnail.className = "thumbnail"
        thumbnail.setAttribute("data-image", product.image)
        thumbnail.innerHTML = `<img src="${product.image}" alt="${product.name} - imagem ${i}">`
        thumbnailGallery.appendChild(thumbnail)
      }

      // Adicionar event listeners para as thumbnails
      setupImageGallery()
    }
  }
}

function loadRecommendedProducts(currentProductId) {
  if (!window.productsDatabase) return

  // Obter produtos recomendados (excluindo o produto atual)
  const allProducts = Object.values(window.productsDatabase)
  const currentProduct = window.productsDatabase[currentProductId]

  // Filtrar produtos da mesma categoria
  let recommendedProducts = allProducts.filter(
    (product) => product.id !== currentProductId && product.category === currentProduct.category,
  )

  // Se não houver produtos suficientes da mesma categoria, adicionar outros
  if (recommendedProducts.length < 2) {
    const otherProducts = allProducts.filter(
      (product) => product.id !== currentProductId && product.category !== currentProduct.category,
    )

    // Adicionar produtos aleatórios até ter 2 recomendações
    while (recommendedProducts.length < 2 && otherProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherProducts.length)
      recommendedProducts.push(otherProducts[randomIndex])
      otherProducts.splice(randomIndex, 1)
    }
  }

  // Limitar a 2 produtos recomendados
  recommendedProducts = recommendedProducts.slice(0, 2)

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

function setupImageGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImage = document.getElementById("main-product-image")

  if (!mainImage || thumbnails.length === 0) return

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Remover classe active de todas as thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"))

      // Adicionar classe active à thumbnail clicada
      this.classList.add("active")

      // Atualizar imagem principal
      const imageUrl = this.getAttribute("data-image")

      // Adicionar efeito de fade
      mainImage.style.opacity = "0"

      setTimeout(() => {
        mainImage.src = imageUrl
        mainImage.style.opacity = "1"
      }, 300)
    })
  })
}

function setupShippingCalculator() {
  const shippingForm = document.querySelector(".shipping-form")

  if (!shippingForm) return

  shippingForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const cepInput = this.querySelector("input")
    const cep = cepInput.value.replace(/\D/g, "")

    if (cep.length !== 8) {
      showNotification("Por favor, digite um CEP válido.")
      return
    }

    // Simular cálculo de frete
    calculateShipping(cep)
  })

  // Adicionar event listener para o botão de busca
  const shippingButton = document.querySelector(".btn-shipping")
  if (shippingButton) {
    shippingButton.addEventListener("click", (e) => {
      e.preventDefault()

      const cepInput = document.querySelector(".shipping-form input")
      const cep = cepInput.value.replace(/\D/g, "")

      if (cep.length !== 8) {
        showNotification("Por favor, digite um CEP válido.")
        return
      }

      // Simular cálculo de frete
      calculateShipping(cep)
    })
  }
}

// Atualizar a função de cálculo de frete para usar os novos estilos
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

      // Inserir após o formulário de frete
      const shippingCalculator = document.querySelector(".shipping-calculator")
      if (shippingCalculator) {
        shippingCalculator.appendChild(shippingTable)
      }
    }

    // Gerar opções de frete aleatórias
    const shippingOptions = [
      {
        name: "Econômico",
        price: Math.random() * 15 + 5, // Entre R$ 5 e R$ 20
        days: Math.floor(Math.random() * 5) + 6, // Entre 6 e 10 dias
      },
      {
        name: "Padrão",
        price: Math.random() * 20 + 15, // Entre R$ 15 e R$ 35
        days: Math.floor(Math.random() * 3) + 3, // Entre 3 e 5 dias
      },
      {
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
            <input type="radio" name="shipping" value="${option.name.toLowerCase()}">
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
  }, 1000)
}

function setupRatings() {
  // Adicionar seção de avaliações
  const productDetail = document.querySelector(".product-detail")

  if (!productDetail) return

  // Verificar se já existe uma seção de avaliações
  if (document.querySelector(".ratings-section")) return

  // Criar seção de avaliações
  const ratingsSection = document.createElement("section")
  ratingsSection.className = "ratings-section"

  // Gerar avaliações aleatórias
  const numReviews = Math.floor(Math.random() * 10) + 5 // Entre 5 e 14 avaliações
  const reviews = []

  const reviewers = [
    "Ana S.",
    "Carlos M.",
    "Juliana R.",
    "Pedro L.",
    "Mariana C.",
    "Rafael T.",
    "Fernanda B.",
    "Lucas G.",
    "Camila P.",
    "Bruno A.",
    "Larissa V.",
    "Gustavo H.",
    "Beatriz N.",
    "Daniel O.",
    "Isabela Q.",
  ]

  const reviewComments = [
    "Produto excelente! Superou minhas expectativas.",
    "Muito bom, recomendo a todos.",
    "Qualidade incrível, vale cada centavo.",
    "Adorei o produto, chegou antes do prazo.",
    "Ótimo custo-benefício, compraria novamente.",
    "Produto de qualidade, mas a entrega demorou um pouco.",
    "Muito satisfeita com a compra!",
    "Produto conforme descrito, recomendo.",
    "Superou minhas expectativas, excelente produto.",
    "Bom produto, mas esperava um pouco mais.",
    "Qualidade superior, estou muito satisfeito.",
    "Produto maravilhoso, já comprei várias vezes.",
    "Chegou em perfeito estado, muito bem embalado.",
    "Exatamente como descrito, recomendo a loja.",
    "Produto de primeira linha, vale o investimento.",
  ]

  // Gerar avaliações aleatórias
  for (let i = 0; i < numReviews; i++) {
    const rating = Math.floor(Math.random() * 2) + 4 // Entre 4 e 5 estrelas
    const reviewerIndex = Math.floor(Math.random() * reviewers.length)
    const commentIndex = Math.floor(Math.random() * reviewComments.length)

    reviews.push({
      reviewer: reviewers[reviewerIndex],
      rating: rating,
      comment: reviewComments[commentIndex],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Últimos 30 dias
    })
  }

  // Calcular média das avaliações
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  // Criar HTML da seção de avaliações
  ratingsSection.innerHTML = `
    <h2>Avaliações dos Clientes</h2>
    <div class="ratings-summary">
      <div class="average-rating">
        <div class="rating-number">${averageRating.toFixed(1)}</div>
        <div class="rating-stars">
          ${"★".repeat(Math.floor(averageRating))}${"☆".repeat(5 - Math.floor(averageRating))}
        </div>
        <div class="rating-count">${reviews.length} avaliações</div>
      </div>
      <div class="rating-distribution">
        <div class="rating-bar">
          <span class="rating-label">5 ★</span>
          <div class="bar-container">
            <div class="bar" style="width: ${(reviews.filter((r) => r.rating === 5).length / reviews.length) * 100}%"></div>
          </div>
          <span class="rating-count">${reviews.filter((r) => r.rating === 5).length}</span>
        </div>
        <div class="rating-bar">
          <span class="rating-label">4 ★</span>
          <div class="bar-container">
            <div class="bar" style="width: ${(reviews.filter((r) => r.rating === 4).length / reviews.length) * 100}%"></div>
          </div>
          <span class="rating-count">${reviews.filter((r) => r.rating === 4).length}</span>
        </div>
        <div class="rating-bar">
          <span class="rating-label">3 ★</span>
          <div class="bar-container">
            <div class="bar" style="width: ${(reviews.filter((r) => r.rating === 3).length / reviews.length) * 100}%"></div>
          </div>
          <span class="rating-count">${reviews.filter((r) => r.rating === 3).length}</span>
        </div>
        <div class="rating-bar">
          <span class="rating-label">2 ★</span>
          <div class="bar-container">
            <div class="bar" style="width: ${(reviews.filter((r) => r.rating === 2).length / reviews.length) * 100}%"></div>
          </div>
          <span class="rating-count">${reviews.filter((r) => r.rating === 2).length}</span>
        </div>
        <div class="rating-bar">
          <span class="rating-label">1 ★</span>
          <div class="bar-container">
            <div class="bar" style="width: ${(reviews.filter((r) => r.rating === 1).length / reviews.length) * 100}%"></div>
          </div>
          <span class="rating-count">${reviews.filter((r) => r.rating === 1).length}</span>
        </div>
      </div>
    </div>
    <div class="reviews-list">
      ${reviews
        .map(
          (review) => `
        <div class="review">
          <div class="review-header">
            <div class="reviewer-name">${review.reviewer}</div>
            <div class="review-date">${review.date.toLocaleDateString()}</div>
          </div>
          <div class="review-rating">
            ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
          </div>
          <div class="review-comment">${review.comment}</div>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="write-review">
      <h3>Deixe sua avaliação</h3>
      <div class="rating-input">
        <span>Sua avaliação:</span>
        <div class="star-input">
          <span class="star" data-rating="1">☆</span>
          <span class="star" data-rating="2">☆</span>
          <span class="star" data-rating="3">☆</span>
          <span class="star" data-rating="4">☆</span>
          <span class="star" data-rating="5">☆</span>
        </div>
      </div>
      <textarea placeholder="Escreva seu comentário aqui..."></textarea>
      <button class="btn btn-purple">Enviar Avaliação</button>
    </div>
  `

  // Inserir após a seção de produtos recomendados
  const recommendedSection = document.querySelector(".recommended-section")
  if (recommendedSection) {
    recommendedSection.after(ratingsSection)
  } else {
    // Inserir no final da página
    const main = document.querySelector("main")
    if (main) {
      main.appendChild(ratingsSection)
    }
  }

  // Adicionar event listeners para as estrelas de avaliação
  const stars = document.querySelectorAll(".star-input .star")
  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = Number.parseInt(this.getAttribute("data-rating"))

      // Destacar estrelas até a atual
      stars.forEach((s, index) => {
        if (index < rating) {
          s.textContent = "★"
        } else {
          s.textContent = "☆"
        }
      })
    })

    star.addEventListener("mouseout", () => {
      // Restaurar estado original
      const selectedRating = Number.parseInt(document.querySelector(".star-input").getAttribute("data-selected") || "0")

      stars.forEach((s, index) => {
        if (index < selectedRating) {
          s.textContent = "★"
        } else {
          s.textContent = "☆"
        }
      })
    })

    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.getAttribute("data-rating"))

      // Salvar avaliação selecionada
      document.querySelector(".star-input").setAttribute("data-selected", rating)

      // Destacar estrelas até a selecionada
      stars.forEach((s, index) => {
        if (index < rating) {
          s.textContent = "★"
        } else {
          s.textContent = "☆"
        }
      })
    })
  })

  // Adicionar event listener para o botão de enviar avaliação
  const submitButton = document.querySelector(".write-review .btn")
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      const selectedRating = Number.parseInt(document.querySelector(".star-input").getAttribute("data-selected") || "0")
      const comment = document.querySelector(".write-review textarea").value.trim()

      if (selectedRating === 0) {
        showNotification("Por favor, selecione uma avaliação de 1 a 5 estrelas.")
        return
      }

      if (comment === "") {
        showNotification("Por favor, escreva um comentário para sua avaliação.")
        return
      }

      // Simular envio da avaliação
      showNotification("Sua avaliação foi enviada com sucesso!")

      // Limpar formulário
      document.querySelector(".star-input").setAttribute("data-selected", "0")
      stars.forEach((s) => (s.textContent = "☆"))
      document.querySelector(".write-review textarea").value = ""
    })
  }
}

function checkWishlistStatus(productId) {
  if (!productId) return

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const isInWishlist = wishlist.includes(productId)

  // Atualizar botão de favoritos
  const wishlistButton = document.querySelector(`.btn-wishlist-large[data-id="${productId}"]`)
  if (wishlistButton) {
    if (isInWishlist) {
      wishlistButton.classList.add("active")
      wishlistButton.textContent = "❤️ Remover dos favoritos"
    } else {
      wishlistButton.classList.remove("active")
      wishlistButton.textContent = "❤ Adicionar aos favoritos"
    }
  }
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
  checkWishlistStatus(productId)
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
