// ===============================
// CONFIGURAÇÃO
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbwgpIU1eAYLnbJmVTbcNf4a0uVEe6wdWBszgey-YMAc2AqnnDe6GRSGwb0J0htnnEDukw/exec";
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

  div.querySelector(".btn-remove").onclick = () => div.remove();
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

  for (const item of itens) {
    const sabor = item.querySelector(".sabor").value;
    const quantidade = Number(item.querySelector(".quantidade").value);

    if (!sabor || quantidade <= 0) {
      alert("Preencha os dados para continuar");
      return;
    }

    const valor =
      sabor === "Gourmet" ? PRECO_GOURMET : PRECO_TRADICIONAL;

    total += valor * quantidade;
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
// FINALIZAR PEDIDO
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

  for (const item of itensDOM) {
    const sabor = item.querySelector(".sabor").value;
    const quantidade = Number(item.querySelector(".quantidade").value);

    if (!sabor || quantidade <= 0) {
      alert("Preencha os dados para continuar");
      return;
    }

    const valorUnitario =
      sabor === "Gourmet" ? PRECO_GOURMET : PRECO_TRADICIONAL;

    total += valorUnitario * quantidade;
    itens.push({ sabor, quantidade });
  }

  // ENVIA E NÃO ESPERA RESPOSTA
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ nome, itens, total })
  });

  // UX IMEDIATA (SEM ERRO)
  setTimeout(() => {
    document.getElementById("resumo").classList.add("hidden");
    document.getElementById("thanks").classList.remove("hidden");
  }, 1000);

  setTimeout(() => {
    location.reload();
  }, 3000);
}

