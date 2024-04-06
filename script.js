const menu = document.getElementById("menu");
const modal = document.getElementById("modal");
const modalBotaoFechar = document.getElementById("modal-botao-fechar");
const modalBotaoFinalizar = document.getElementById("modal-botao-finalizar");
const carrinhoBotao = document.getElementById("carrinho-botao");
const modalProdutos = document.getElementById("modal-produtos");
const cardTotal = document.getElementById("card-total");
const totalCarrinho = document.getElementById("total-carrinho");
const endereco = document.getElementById("endereco");
const enderecoNaoInformado = document.getElementById("endereco-nao-informado");
const dateSpan = document.getElementById("date-span");

let carrinhoArray = [];

function verificarRestauranteAberto() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <= 0;
}

if (!verificarRestauranteAberto()) {
    dateSpan.classList.remove("bg-green-600");
    dateSpan.classList.add("bg-red-600");
} else {
    dateSpan.classList.add("bg-green-600");
    dateSpan.classList.remove("bg-red-600");
}

carrinhoBotao.addEventListener("click", function() {
    atualizarCarrinho();
    modal.style.display = "flex";
});

modalBotaoFechar.addEventListener("click", function() {
    modal.style.display = "none";
});

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const nomeProduto = parentButton.getAttribute("data-name");
        const precoProduto = parseFloat(parentButton.getAttribute("data-price"));
        adicionarCarrinho(nomeProduto, precoProduto);
    }
});

function adicionarCarrinho(nome, preco) {
    const existeItemDuplicado = carrinhoArray.find(item => item.nome === nome);

    if (existeItemDuplicado) {
        existeItemDuplicado.quantidade += 1;
    } else {
        carrinhoArray.push({
            nome,
            preco, 
            quantidade: 1
        });
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    modalProdutos.innerHTML = "";
    let total = 0;
    carrinhoArray.forEach(item => {
        const carinhoElemento = document.createElement("div");
        carinhoElemento.innerHTML = `
            <div class="flex items-center justify-between">

                <div class="mt-4">
                    <p class="font-medium">Produto: ${item.nome}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                    <p class="font-medium">R$ ${item.preco.toFixed(2)}</p>
                </div>

                <div>
                    <button data-name="${item.nome}" class="remove-from-cart-btn">
                        Remover
                    </button>
                </div>

            </div>
        `;

        total += item.preco * item.quantidade;
        modalProdutos.appendChild(carinhoElemento);
    });
    cardTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    totalCarrinho.innerText = carrinhoArray.length;
}

modalProdutos.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const nome = event.target.getAttribute("data-name");
        removerProduto(nome);
    }
});

function removerProduto(parametro) {
    const index = carrinhoArray.findIndex(item => item.nome = item.nome);
    if (index !== -1) {
        const item = carrinhoArray[index];
        if (item.quantidade > 1) {
            item.quantidade -= 1;
            atualizarCarrinho();
            return;
        }
        carrinhoArray.splice(index, 1);
        atualizarCarrinho();
    }
}

endereco.addEventListener("input", function(event) {
    let enderecoInput = event.target.value;
    if (enderecoInput !== "") {
        enderecoNaoInformado.classList.add("hidden");
        endereco.classList.remove("border-red-500");
    }
});

modalBotaoFinalizar.addEventListener("click", function(event) {
    if (carrinhoArray.length === 0) return;

    if (!verificarRestauranteAberto()) {
        Toastify({
            text: "O restaurante está fechado",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#f50019",
            },
          }).showToast();
          return;
    }

    if (endereco.value === "") {
        enderecoNaoInformado.classList.remove("hidden");
        endereco.classList.add("border-red-500");
        return;
    }

    const carrinhoList = carrinhoArray.map((item) => {
        return (
            `${item.nome} - ${item.quantidade} - ${item.preco}`
        )
    }).join("");

    const mensagem = encodeURIComponent(carrinhoList);
    const telefone = "61996196506";

    window.open(`https://wa.me/${telefone}?text=${mensagem} Endereço: ${endereco.value}`, "_blank");

    modal.style.display = "none";

    carrinhoArray = [];
    atualizarCarrinho();
});