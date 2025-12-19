// ===============================
// CONFIGURAÇÃO
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbx2IMVWY690_UunhbAOCS7uCVx05O8T2Vyn2AtKrKV5X9Ywjfr23c03iDwr9eAqnpIFiw/exec"; // termina com /exec
const PRECO_TRADICIONAL = 3;
const PRECO_GOURMET = 4;
const LIMITE_SABORES = 2;

let totalAtual = 0;

// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnAdd").addEventListener("click", adicionarSabor);
  document.getElementById("btnCalcular").addEventListener("click", calcularPedido);
  document.getElementById("btnCopiar").addEventListener("click", copiarPix);
  document.getElementById("btnPagar").addEventListener("click", finalizarPedido);
});

// ===============================
// ADICIONAR SABOR
// ===============================
function adicionarSabor() {
  const container = document.getElementById("itens");
  const itens = container.querySelectorAll(".item");

  if (itens.length >= LIMITE_SABORES) {
    alert("Você pode escolher no máximo 2 sabores 😊");
    return;
  }

  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <div class="item-row">
      <select class="sabor">
        <option value="">Escolha o sabor</option>
        <option value="Tradicional">Tradicional — R$3</option>
        <option value="Gourmet">Gourmet — R$4</option>
      </select>
      <button type="button" class="btn-remove">✕</button>
    </div>
    <input type="number" class="quantidade" min="1" value="1">
  `;

  div.querySelector(".btn-remove").addEventListener("click", () => {
    div.remove();
  });

  container.appendChild(div);
}

// ===============================
// CALCULAR
// ===============================
function calcularPedido() {
  const nome = document.getElementById("nome").value.trim();
  const itens = document.querySelectorAll(".item");

  if (!nome || itens.length === 0) {
    alert("Preencha os dados para continuar");
    return;
  }

  let total = 0;

  for (let item of itens) {
    const sabor = item.querySelector(".sabor").value;
    const quantidade = Number(item.querySelector(".quantidade").value);

    if (!sabor || quantidade <= 0) {
      alert("Preencha os dados para continuar");
      return;
    }

    const valorUnitario =
      sabor === "Gourmet" ? PRECO_GOURMET : PRECO_TRADICIONAL;

    total += valorUnitario * quantidade;
  }

  totalAtual = total;
  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("resumo").classList.remove("hidden");
}

// ===============================
// COPIAR PIX
// ===============================
function copiarPix() {
  const chave = document.getElementById("pix").innerText;
  navigator.clipboard.writeText(chave);
  alert("Chave PIX copiada 💖");
}

// ===============================
// FINALIZAR PEDIDO (JÁ PAGUEI)
// ===============================
async function finalizarPedido() {
  const nome = document.getElementById("nome").value.trim();
  const itensDOM = document.querySelectorAll(".item");

  if (!nome || itensDOM.length === 0) {
    alert("Preencha os dados para continuar");
    return;
  }

  const itens = [];
  let total = 0;

  itensDOM.forEach(item => {
    const sabor = item.querySelector(".sabor").value;
    const quantidade = Number(item.querySelector(".quantidade").value);
    const valorUnitario =
      sabor === "Gourmet" ? PRECO_GOURMET : PRECO_TRADICIONAL;

    const totalItem = valorUnitario * quantidade;

    itens.push({
      sabor,
      quantidade
    });

    total += totalItem;
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        itens,
        total
      })
    });

    // Feedback rápido
    setTimeout(() => {
      document.getElementById("resumo").classList.add("hidden");
      document.getElementById("thanks").classList.remove("hidden");
    }, 200);

    // Reset após 5 segundos
    setTimeout(() => {
      location.reload();
    }, 4000);

  } catch (erro) {
    alert("Erro ao registrar pedido. Tente novamente.");
    console.error(erro);
  }
}
