// Dados dos produtos
const produtos = [
  {
    id: 1,
    nome: "Creme Facial Vegano",
    preco: 89.9,
    imagem: "./assets/img/Produto1.jpeg",
    categoria: "skincare",
    descricao: "Creme facial vegano com ingredientes naturais para hidratação profunda.",
    destaque: true,
    maisVendido: true,
    estoque: 15,
  },
  {
    id: 2,
    nome: "Kit Skincare Completo",
    preco: 199.9,
    imagem: "./assets/img/Produto2.jpeg",
    categoria: "kits",
    descricao: "Kit completo com produtos para cuidados com a pele, 100% vegano e sustentável.",
    destaque: true,
    maisVendido: true,
    estoque: 8,
  },
  {
    id: 3,
    nome: "Kit Limpeza Facial",
    preco: 129.9,
    imagem: "./assets/img/Produto3.jpeg",
    categoria: "skincare",
    descricao: "Kit com produtos para limpeza facial profunda, livre de parabenos.",
    destaque: true,
    maisVendido: false,
    estoque: 12,
  },
  {
    id: 4,
    nome: "Loção Corporal Hidratante",
    preco: 69.9,
    imagem: "./assets/img/Produto4.jpeg",
    categoria: "corpo",
    descricao: "Loção corporal hidratante com ingredientes naturais e fragrância suave.",
    destaque: true,
    maisVendido: true,
    estoque: 20,
  },
]

// Função para exibir os produtos na página
function exibirProdutos(produtosParaExibir) {
  const produtosContainer = document.querySelector(".product-grid")

  if (!produtosContainer) {
    console.error("Container de produtos não encontrado")
    return
  }

  produtosContainer.innerHTML = ""

  if (produtosParaExibir.length === 0) {
    produtosContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>'
    return
  }

  produtosParaExibir.forEach((produto) => {
    const produtoElement = document.createElement("div")
    produtoElement.className = "product-card"

    const precoFormatado = produto.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    produtoElement.innerHTML = `
      <div class="product-image">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="product-actions">
          <button class="action-btn add-to-cart" data-id="${produto.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
          <button class="action-btn add-to-wishlist" data-id="${produto.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${produto.nome}</h3>
        <p class="product-price">${precoFormatado}</p>
        <a href="product.html?id=${produto.id}" class="btn btn-outline">Ver detalhes</a>
      </div>
    `

    produtosContainer.appendChild(produtoElement)
  })

  // Adicionar eventos aos botões
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const produtoId = Number.parseInt(this.getAttribute("data-id"))
      adicionarAoCarrinho(produtoId)
    })
  })

  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const produtoId = Number.parseInt(this.getAttribute("data-id"))
      adicionarAosFavoritos(produtoId)
    })
  })
}

// Função para filtrar produtos por categoria
function filtrarProdutosPorCategoria(categoria) {
  if (!categoria || categoria === "todos") {
    return produtos
  }

  return produtos.filter((produto) => produto.categoria === categoria)
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
  // Buscar o produto pelo ID
  const produto = produtos.find((p) => p.id === produtoId)

  if (!produto) {
    console.error("Produto não encontrado")
    return
  }

  // Obter o carrinho atual do localStorage ou criar um novo
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

  // Verificar se o produto já está no carrinho
  const produtoNoCarrinho = carrinho.find((item) => item.id === produtoId)

  if (produtoNoCarrinho) {
    // Se já estiver, aumentar a quantidade
    produtoNoCarrinho.quantidade += 1
  } else {
    // Se não estiver, adicionar ao carrinho
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1,
    })
  }

  // Salvar o carrinho atualizado no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho))

  // Atualizar o contador do carrinho
  atualizarContadorCarrinho()

  // Mostrar mensagem de sucesso
  alert(`${produto.nome} adicionado ao carrinho!`)
}

// Função para adicionar produto aos favoritos
function adicionarAosFavoritos(produtoId) {
  // Buscar o produto pelo ID
  const produto = produtos.find((p) => p.id === produtoId)

  if (!produto) {
    console.error("Produto não encontrado")
    return
  }

  // Obter a lista de favoritos atual do localStorage ou criar uma nova
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

  // Verificar se o produto já está nos favoritos
  const produtoNosFavoritos = favoritos.find((item) => item.id === produtoId)

  if (produtoNosFavoritos) {
    // Se já estiver, remover dos favoritos
    favoritos = favoritos.filter((item) => item.id !== produtoId)
    alert(`${produto.nome} removido dos favoritos!`)
  } else {
    // Se não estiver, adicionar aos favoritos
    favoritos.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
    })
    alert(`${produto.nome} adicionado aos favoritos!`)
  }

  // Salvar a lista de favoritos atualizada no localStorage
  localStorage.setItem("favoritos", JSON.stringify(favoritos))
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
  const contador = document.querySelector(".cart-count")

  if (contador) {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0)
    contador.textContent = totalItens
  }
}

// Função para obter parâmetros da URL
function obterParametroURL(nome) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(nome)
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
  // Atualizar o contador do carrinho
  atualizarContadorCarrinho()

  // Verificar se estamos na página de produtos
  const isPaginaProdutos = window.location.pathname.includes("produtos.html")

  if (isPaginaProdutos) {
    // Obter a categoria da URL
    const categoriaURL = obterParametroURL("categoria")

    // Filtrar produtos pela categoria (se houver)
    const produtosFiltrados = filtrarProdutosPorCategoria(categoriaURL)

    // Exibir os produtos
    exibirProdutos(produtosFiltrados)

    // Destacar a categoria selecionada no menu
    if (categoriaURL) {
      const linkCategoria = document.querySelector(`.dropdown-content a[href*="categoria=${categoriaURL}"]`)
      if (linkCategoria) {
        linkCategoria.classList.add("active")
      }
    }
  }
})
