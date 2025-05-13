// Atribuir a base de dados ao objeto window para que seja acessível globalmente
window.productsDatabase = {
  "hydration-kit": {
    id: "hydration-kit",
    name: "Kit Hidratação Profunda",
    image: "./assets/img/Produto4.jpeg",
    price: 97.00,
    rating: 4.8,
    stock: 12,
    tags: ["hidratação", "kit", "vegano"],
    featured: true,
    bestseller: true,
    description: "Kit completo para hidratação profunda da pele com produtos veganos e sustentáveis.",
    category: "skincare"
  },
  "skincare-kit": {
    id: "skincare-kit",
    name: "Mini Kit Completo Skincare",
    image: "./assets/img/Produto1.jpeg",
    price: 146.00,
    originalPrice: 227.00,
    rating: 4.8,
    stock: 9,
    tags: ["skincare", "kit"],
    featured: true,
    description: "Kit completo para cuidados com a pele, contendo produtos para limpeza, tonificação e hidratação.",
    category: "skincare"
  },
  "body-lotion": {
    id: "body-lotion",
    name: "Loção Corporal - Skin Veg",
    image: "./assets/img/Produto3.jpeg",
    price: 99.00,
    originalPrice: 110.00,
    rating: 4.7,
    stock: 10,
    bestseller: true,
    description: "Loção corporal vegana para hidratação intensa da pele, com ingredientes naturais e sustentáveis.",
    category: "corpo",
    tags: ["corpo", "hidratação", "vegano"]
  },
  "facial-cream": {
    id: "facial-cream",
    name: "Creme Facial Vegano",
    image: "./assets/img/Produto2.jpeg",
    price: 98.00,
    rating: 4.6,
    stock: 7,
    tags: ["facial", "creme", "vegano"],
    featured: true,
    description: "Creme facial vegano para hidratação e nutrição da pele do rosto, com ingredientes naturais.",
    category: "rosto"
  },
  "lip-balm": {
    id: "lip-balm",
    name: "Lip Balm Hidratante",
    image: "./assets/img/Produto5.jpeg",
    price: 35.00,
    rating: 4.5,
    stock: 20,
    tags: ["labial", "bálsamo"],
    bestseller: true,
    description: "Bálsamo labial hidratante para lábios ressecados, com ingredientes naturais e sustentáveis.",
    category: "rosto"
  },
  "oil-moisturizer": {
    id: "oil-moisturizer",
    name: "Óleo para Massagem",
    image: "./assets/img/Produto6.jpeg",
    price: 85.00,
    rating: 4.4,
    stock: 6,
    bestseller: true,
    description: "Óleo para massagem corporal, com propriedades relaxantes e hidratantes para a pele.",
    category: "corpo",
    tags: ["óleo", "massagem", "relaxante"]
  },
  "perfume": {
    id: "perfume",
    name: "Perfume Natural Spray",
    image: "./assets/img/Produto7.jpeg",
    price: 120.00,
    rating: 4.7,
    stock: 8,
    tags: ["perfume", "natural"],
    featured: true,
    description: "Perfume natural em spray, com fragrância suave e duradoura, feito com ingredientes sustentáveis.",
    category: "perfumaria"
  },
  "cleaning-kit": {
    id: "cleaning-kit",
    name: "Kit de Limpeza Zero Resíduos",
    image: "./assets/img/Produto8.jpeg",
    price: 180.00,
    originalPrice: 300.00,
    rating: 4.9,
    stock: 10,
    tags: ["limpeza", "sustentável"],
    bestseller: true,
    description: "Kit completo de limpeza zero resíduos, com produtos sustentáveis para uma casa mais ecológica.",
    category: "casa"
  }
};

// Função para carregar produtos em destaque
function loadFeaturedProducts() {
  const container = document.querySelector("#featured-products");
  if (!container) return;
  container.innerHTML = "";

  Object.values(window.productsDatabase)
    .filter((p) => p.featured)
    .slice(0, 4)
    .forEach((product) => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
}

// Função para carregar produtos mais vendidos
function loadBestSellingProducts() {
  const container = document.querySelector("#best-sellers");
  if (!container) return;
  container.innerHTML = "";

  Object.values(window.productsDatabase)
    .filter(p => p.bestseller)
    .slice(0, 4)
    .forEach((product) => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
}

// Função para criar card de produto
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

  wishlistButton.innerHTML = isInWishlist
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

  if (isInWishlist) {
    wishlistButton.classList.add("active");
  }

  wishlistButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  });

  productCard.appendChild(wishlistButton);

  // Adicionar conteúdo do card
  const productContent = document.createElement("div");
  productContent.innerHTML = `
    <a href="produto.html?id=${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='./assets/img/placeholder.jpg'">
      </div>
    </a>
    <div class="product-info">
      <h3>${product.name}</h3>
      <div class="product-price">
        <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
        ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ""}
      </div>
      <div class="product-rating">
        ${generateStarRating(product.rating)}
        <span class="rating-value">${product.rating.toFixed(1)}</span>
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
        addToCart(product.id);
      });
    }
  }, 0);

  return productCard;
}

// Função para gerar classificação por estrelas
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = "";

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }

  // Half star
  if (halfStar) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></path><path d="M12 2L12 17.77" fill="none"></path></svg>`;
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }

  return starsHTML;
}

// Função para filtrar produtos por termo de busca
function filterProductsBySearch(searchTerm) {
  searchTerm = searchTerm.toLowerCase();

  // Filtrar produtos que correspondem ao termo de busca
  const filteredProducts = Object.values(window.productsDatabase).filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      (product.category && product.category.toLowerCase().includes(searchTerm)) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  });

  // Atualizar a exibição dos produtos
  updateProductDisplay(filteredProducts);
}

// Função para atualizar a exibição dos produtos
function updateProductDisplay(products) {
  // Encontrar todas as seções de produtos
  const productGrids = document.querySelectorAll(".product-grid");

  if (products.length === 0) {
    // Não encontrou produtos
    const container = document.querySelector(".container");

    // Verificar se já existe uma mensagem de "nenhum produto encontrado"
    let noProductsMessage = document.querySelector(".no-products-message");

    if (!noProductsMessage) {
      noProductsMessage = document.createElement("div");
      noProductsMessage.className = "no-products-message";
      noProductsMessage.innerHTML = `
        <h2>Nenhum produto encontrado</h2>
        <p>Tente buscar por outros termos ou categorias.</p>
        <button class="btn btn-outline" onclick="window.location.href='index.html'">Ver todos os produtos</button>
      `;

      // Inserir após a primeira seção de produtos
      if (productGrids.length > 0) {
        productGrids[0].parentNode.insertBefore(noProductsMessage, productGrids[0].nextSibling);
      } else if (container) {
        container.appendChild(noProductsMessage);
      }
    }

    // Esconder as seções de produtos
    productGrids.forEach((grid) => {
      if (grid.parentNode) {
        grid.parentNode.style.display = "none";
      }
    });

    return;
  }

  // Mostrar as seções de produtos
  productGrids.forEach((grid) => {
    if (grid.parentNode) {
      grid.parentNode.style.display = "block";
    }
  });

  // Remover mensagem de "nenhum produto encontrado" se existir
  const noProductsMessage = document.querySelector(".no-products-message");
  if (noProductsMessage) {
    noProductsMessage.remove();
  }

  // Atualizar a primeira seção de produtos com os resultados da busca
  if (productGrids.length > 0) {
    const firstGrid = productGrids[0];
    firstGrid.innerHTML = "";

    // Atualizar o título da seção
    const sectionHeader = firstGrid.previousElementSibling;
    if (sectionHeader && sectionHeader.querySelector("h2")) {
      sectionHeader.querySelector("h2").textContent = "RESULTADOS DA BUSCA";
    }

    // Adicionar os produtos filtrados
    products.forEach((product) => {
      const productCard = createProductCard(product);
      firstGrid.appendChild(productCard);
    });
  }
}

// Função para adicionar/remover produto da lista de desejos
function toggleWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  // Verificar se o produto já está na lista de desejos
  const index = wishlist.indexOf(productId);

  if (index === -1) {
    // Adicionar à lista de desejos
    wishlist.push(productId);
    showNotification("Produto adicionado aos favoritos!");
  } else {
    // Remover da lista de desejos
    wishlist.splice(index, 1);
    showNotification("Produto removido dos favoritos!");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Atualizar o botão de favoritos
  checkWishlistStatus(productId);
}

// Função para verificar status da lista de desejos
function checkWishlistStatus(productId) {
  if (!productId) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const isInWishlist = wishlist.includes(productId);

  // Atualizar botões de favoritos na página
  const wishlistButtons = document.querySelectorAll(`.btn-wishlist[data-id="${productId}"]`);
  wishlistButtons.forEach((button) => {
    if (isInWishlist) {
      button.classList.add("active");
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    } else {
      button.classList.remove("active");
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    }
  });

  // Atualizar botão grande de favoritos na página de detalhes do produto
  const wishlistButtonLarge = document.querySelector(`.btn-wishlist-large[data-id="${productId}"]`);
  if (wishlistButtonLarge) {
    if (isInWishlist) {
      wishlistButtonLarge.classList.add("active");
      wishlistButtonLarge.textContent = "❤️ Remover dos favoritos";
    } else {
      wishlistButtonLarge.classList.remove("active");
      wishlistButtonLarge.textContent = "❤ Adicionar aos favoritos";
    }
  }
}

// Função para carregar detalhes do produto
function loadProductDetails(productId) {
  // Verificar se temos o produto no "banco de dados" do front-end
  if (window.productsDatabase && window.productsDatabase[productId]) {
    const product = window.productsDatabase[productId];

    // Atualizar título da página
    document.title = `${product.name} - ecobuy`;

    // Atualizar elementos da página com os dados do produto
    const titleElement = document.querySelector("h1");
    if (titleElement) {
      titleElement.textContent = product.name;
    }

    const descriptionElement = document.querySelector(".product-description");
    if (descriptionElement && product.description) {
      descriptionElement.textContent = product.description;
    }

    const currentPriceElement = document.querySelector(".current-price");
    if (currentPriceElement) {
      currentPriceElement.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    }

    const originalPriceElement = document.querySelector(".original-price");
    if (originalPriceElement) {
      if (product.originalPrice) {
        originalPriceElement.textContent = `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`;
        originalPriceElement.style.display = "inline";
      } else {
        originalPriceElement.style.display = "none";
      }
    }

    // Atualizar badge de desconto
    const discountBadge = document.querySelector(".discount-badge");
    if (discountBadge) {
      if (product.originalPrice) {
        const discount = Math.round(100 - (product.price / product.originalPrice * 100));
        discountBadge.textContent = `-${discount}%`;
        discountBadge.style.display = "block";
      } else {
        discountBadge.style.display = "none";
      }
    }

    // Atualizar informação de parcelas
    const installmentInfo = document.querySelector(".installment-info");
    if (installmentInfo) {
      const installmentValue = (product.price / 2).toFixed(2).replace('.', ',');
      installmentInfo.textContent = `2 x de R$ ${installmentValue}`;
    }

    // Atualizar imagem principal
    const mainImage = document.getElementById("main-product-image");
    if (mainImage) {
      mainImage.src = product.image;
      mainImage.alt = product.name;
    }

    // Atualizar tags do produto
    const tagsContainer = document.querySelector(".product-tags");
    if (tagsContainer && product.tags) {
      tagsContainer.innerHTML = "";
      product.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }

    // Adicionar avaliações
    const ratingContainer = document.querySelector(".product-rating");
    if (ratingContainer) {
      ratingContainer.innerHTML = `
        ${generateStarRating(product.rating)}
        <span class="rating-value">${product.rating.toFixed(1)}</span>
        <span class="rating-count">(${Math.floor(product.rating * 10)} avaliações)</span>
      `;
    } else {
      const newRatingContainer = document.createElement("div");
      newRatingContainer.className = "product-rating";
      newRatingContainer.innerHTML = `
        ${generateStarRating(product.rating)}
        <span class="rating-value">${product.rating.toFixed(1)}</span>
        <span class="rating-count">(${Math.floor(product.rating * 10)} avaliações)</span>
      `;

      // Inserir após a descrição do produto
      if (descriptionElement) {
        descriptionElement.after(newRatingContainer);
      }
    }

    // Adicionar informação de estoque
    const stockInfo = document.querySelector(".stock-info");
    if (stockInfo) {
      if (product.stock > 10) {
        stockInfo.innerHTML = `<span class="in-stock">Em estoque</span>`;
      } else if (product.stock > 0) {
        stockInfo.innerHTML = `<span class="low-stock">Apenas ${product.stock} em estoque</span>`;
      } else {
        stockInfo.innerHTML = `<span class="out-of-stock">Fora de estoque</span>`;
      }
    } else {
      const newStockInfo = document.createElement("div");
      newStockInfo.className = "stock-info";

      if (product.stock > 10) {
        newStockInfo.innerHTML = `<span class="in-stock">Em estoque</span>`;
      } else if (product.stock > 0) {
        newStockInfo.innerHTML = `<span class="low-stock">Apenas ${product.stock} em estoque</span>`;
      } else {
        newStockInfo.innerHTML = `<span class="out-of-stock">Fora de estoque</span>`;
      }

      // Inserir após as tags do produto
      if (tagsContainer) {
        tagsContainer.after(newStockInfo);
      }
    }

    // Adicionar botão de favoritos
    const addToCartButton = document.querySelector(".btn-add-cart-large");
    if (addToCartButton) {
      let wishlistButton = document.querySelector(".btn-wishlist-large");
      
      if (!wishlistButton) {
        wishlistButton = document.createElement("button");
        wishlistButton.className = "btn btn-wishlist-large";
        wishlistButton.setAttribute("data-id", product.id);
        wishlistButton.textContent = "❤ Adicionar aos favoritos";
        wishlistButton.onclick = () => {
          toggleWishlist(product.id);
        };

        // Inserir após o botão de adicionar ao carrinho
        addToCartButton.after(wishlistButton);
      }
      
      // Verificar status da lista de desejos
      checkWishlistStatus(product.id);
    }

    // Configurar galeria de imagens
    setupImageGallery();

    // Carregar produtos recomendados
    loadRecommendedProducts(productId);
  }
}

// Função para configurar a galeria de imagens
function setupImageGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-product-image");
  
  if (!thumbnails.length || !mainImage) return;
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", () => {
      // Remover classe active de todas as thumbnails
      thumbnails.forEach(t => t.classList.remove("active"));
      
      // Adicionar classe active à thumbnail clicada
      thumbnail.classList.add("active");
      
      // Atualizar imagem principal
      const imageUrl = thumbnail.getAttribute("data-image");
      if (imageUrl) {
        mainImage.src = imageUrl;
      }
    });
  });
}

// Função para carregar produtos recomendados
function loadRecommendedProducts(currentProductId) {
  if (!window.productsDatabase || !currentProductId) return;

  // Obter produtos recomendados (excluindo o produto atual)
  const allProducts = Object.values(window.productsDatabase);
  const currentProduct = window.productsDatabase[currentProductId];
  
  if (!currentProduct) return;

  // Filtrar produtos da mesma categoria
  let recommendedProducts = allProducts.filter(
    (product) => product.id !== currentProductId && 
    product.category === currentProduct.category
  );

  // Se não houver produtos suficientes da mesma categoria, adicionar outros
  if (recommendedProducts.length < 2) {
    const otherProducts = allProducts.filter(
      (product) => product.id !== currentProductId && 
      (!currentProduct.category || product.category !== currentProduct.category)
    );

    // Adicionar produtos aleatórios até ter 2 recomendações
    while (recommendedProducts.length < 2 && otherProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherProducts.length);
      recommendedProducts.push(otherProducts[randomIndex]);
      otherProducts.splice(randomIndex, 1);
    }
  }

  // Limitar a 2 produtos recomendados
  recommendedProducts = recommendedProducts.slice(0, 2);

  // Atualizar a seção de produtos recomendados
  const bundleProducts = document.querySelectorAll(".bundle-product");

  if (bundleProducts.length >= 2 && recommendedProducts.length >= 2) {
    // Atualizar primeiro produto recomendado
    updateBundleProduct(bundleProducts[0], recommendedProducts[0]);

    // Atualizar segundo produto recomendado
    updateBundleProduct(bundleProducts[1], recommendedProducts[1]);

    // Atualizar preço total
    const totalPrice = currentProduct.price + recommendedProducts[0].price + recommendedProducts[1].price;
    const bundleTotalPrice = document.querySelector(".bundle-total-price");
    if (bundleTotalPrice) {
      bundleTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    }
  }
}

// Função para atualizar produto no bundle
function updateBundleProduct(bundleProductElement, product) {
  if (!bundleProductElement || !product) return;
  
  const image = bundleProductElement.querySelector("img");
  if (image) {
    image.src = product.image;
    image.alt = product.name;
  }
  
  const name = bundleProductElement.querySelector("h3");
  if (name) {
    name.textContent = product.name;
  }
  
  const price = bundleProductElement.querySelector(".bundle-price");
  if (price) {
    price.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  }
}

// Função para mostrar notificação
function showNotification(message) {
  // Verificar se já existe uma notificação
  let notification = document.querySelector(".notification");
  
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification";
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.classList.add("show");
  
  // Remover a notificação após 3 segundos
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Função para adicionar produto ao carrinho
function addToCart(productId) {
  // Obter carrinho atual do localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const product = window.productsDatabase[productId];
  if (!product) return;

  // Verificar se o produto já está no carrinho
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    // Incrementar quantidade
    existingItem.quantity += 1;
  } else {
    // Adicionar novo item com dados completos
    cart.push({
      id: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    });
  }

  // Salvar carrinho atualizado
  localStorage.setItem("cart", JSON.stringify(cart));

  // Atualizar contador do carrinho imediatamente
  if (typeof updateCartCount === 'function') updateCartCount();

  // Mostrar notificação
  showNotification("Produto adicionado ao carrinho!");

  // Se estiver na página do carrinho, recarregar os itens
  if (window.location.pathname.includes('cart.html')) {
    if (typeof loadCartItems === 'function') loadCartItems();
  }
}

// Função para atualizar contador do carrinho
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Função para renderizar lista de produtos
function renderProductList() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid || !window.productsDatabase) return;
  
  productGrid.innerHTML = "";
  
  // Obter parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoria = urlParams.get("categoria");
  const sort = urlParams.get("sort");
  
  // Filtrar produtos por categoria
  let products = Object.values(window.productsDatabase);
  
  if (categoria) {
    products = products.filter(product => 
      product.category === categoria || 
      (product.tags && product.tags.includes(categoria))
    );
  }
  
  // Ordenar produtos
  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "bestseller") {
    products = products.filter(product => product.bestseller);
  }
  
  // Renderizar produtos
  products.forEach(product => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
  
  // Atualizar título da seção se necessário
  if (categoria) {
    const sectionHeader = document.querySelector(".section-header h2");
    if (sectionHeader) {
      sectionHeader.textContent = categoria.toUpperCase();
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se estamos na página de detalhes do produto
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const productListView = document.getElementById("product-list");
  const productDetailView = document.getElementById("product-detail-view");

  if (productId) {
    // Estamos na página de detalhes do produto
    if (productListView) productListView.style.display = "none";
    if (productDetailView) productDetailView.style.display = "block";
    loadProductDetails(productId);
  } else {
    // Estamos na página de lista de produtos
    if (productListView) productListView.style.display = "flex";
    if (productDetailView) productDetailView.style.display = "none";
    renderProductList();
  }

  // Carregar produtos em destaque e mais vendidos (para a página inicial)
  loadFeaturedProducts();
  loadBestSellingProducts();
  
  // Atualizar contador do carrinho
  updateCartCount();
  
  // Configurar busca
  const searchForm = document.querySelector(".search-box");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector("input");
      if (searchInput && searchInput.value.trim()) {
        filterProductsBySearch(searchInput.value.trim());
      }
    });
  }
  
  // Configurar ordenação de produtos
  const sortSelect = document.getElementById("sort-products");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("sort", sortSelect.value);
      window.location.href = currentUrl.toString();
    });
    
    // Definir valor selecionado com base na URL
    const urlSort = urlParams.get("sort");
    if (urlSort) {
      sortSelect.value = urlSort;
    }
  }

  // Duplicar categorias para carrossel infinito
  const slider = document.querySelector('.categories-slider');
  if (slider && slider.children.length > 0) {
    slider.innerHTML += slider.innerHTML;
  }

  // FAVORITOS NO MENU
  const headerIcons = document.querySelectorAll('.header-icons .icon-link');
  if (headerIcons.length > 1) {
    const favIcon = headerIcons[1]; // O segundo ícone é o de favoritos
    favIcon.addEventListener('click', (e) => {
      e.preventDefault();
      showFavoritesModal();
    });
  }

  // Destacar menu ativo
  const path = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (
      (path === '' && href === 'index.html') ||
      (path === href) ||
      (path.startsWith('produtos') && href.startsWith('produtos')) ||
      (path.startsWith('parceiros') && href.startsWith('parceiros')) ||
      (path.startsWith('contato') && href.startsWith('contato')) ||
      (path.startsWith('sobre') && href.startsWith('sobre'))
    ) {
      link.classList.add('active');
    }
  });

  // Corrigir clique no menu Produtos para não recarregar a home
  const produtosDropdown = document.querySelector('.dropdown > .nav-link');
  if (produtosDropdown) {
    produtosDropdown.addEventListener('click', function(e) {
      // Se o link for apenas '#', previne o comportamento padrão
      if (this.getAttribute('href') === 'produtos.html') {
        // Se já está na página de produtos, não faz nada
        if (window.location.pathname.includes('produtos.html')) {
          e.preventDefault();
        }
      }
    });
  }
});

function showFavoritesModal() {
  // Remove modal antigo se existir
  const oldModal = document.getElementById('favorites-modal');
  if (oldModal) oldModal.remove();

  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const products = window.productsDatabase || {};

  // Cria modal
  const modal = document.createElement('div');
  modal.id = 'favorites-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.4)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  const content = document.createElement('div');
  content.style.background = '#fff';
  content.style.borderRadius = '12px';
  content.style.padding = '32px 24px 24px 24px';
  content.style.maxWidth = '95vw';
  content.style.width = '400px';
  content.style.maxHeight = '80vh';
  content.style.overflowY = 'auto';
  content.style.position = 'relative';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '16px';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => modal.remove());
  content.appendChild(closeBtn);

  const title = document.createElement('h2');
  title.textContent = 'Favoritos';
  title.style.marginBottom = '18px';
  title.style.fontSize = '1.3rem';
  title.style.textAlign = 'center';
  content.appendChild(title);

  if (!wishlist.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Nenhum produto favoritado.';
    empty.style.textAlign = 'center';
    content.appendChild(empty);
  } else {
    wishlist.forEach(id => {
      const p = products[id];
      if (!p) return;
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '12px';
      item.style.marginBottom = '18px';

      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.style.width = '56px';
      img.style.height = '56px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      item.appendChild(img);

      const info = document.createElement('div');
      info.style.flex = '1';
      info.innerHTML = `<strong>${p.name}</strong><br><span style='color:#4caf50;font-weight:600;'>R$ ${p.price.toFixed(2).replace('.', ',')}</span>`;
      item.appendChild(info);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remover';
      removeBtn.style.background = '#eee';
      removeBtn.style.border = 'none';
      removeBtn.style.borderRadius = '6px';
      removeBtn.style.padding = '6px 10px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.fontSize = '0.9rem';
      removeBtn.addEventListener('click', () => {
        toggleWishlist(p.id);
        modal.remove();
        showFavoritesModal();
      });
      item.appendChild(removeBtn);

      content.appendChild(item);
    });

    // Botão geral para comprar todos
    const buyAllBtn = document.createElement('button');
    buyAllBtn.textContent = 'Comprar todos';
    buyAllBtn.style.background = '#4caf50';
    buyAllBtn.style.color = '#fff';
    buyAllBtn.style.border = 'none';
    buyAllBtn.style.borderRadius = '8px';
    buyAllBtn.style.padding = '12px 0';
    buyAllBtn.style.width = '100%';
    buyAllBtn.style.fontSize = '1rem';
    buyAllBtn.style.marginTop = '10px';
    buyAllBtn.style.cursor = 'pointer';
    buyAllBtn.addEventListener('click', () => {
      wishlist.forEach(id => {
        if (products[id]) addToCart(id);
      });
      window.location.href = 'cart.html';
    });
    content.appendChild(buyAllBtn);
  }

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Fechar ao clicar fora do conteúdo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}