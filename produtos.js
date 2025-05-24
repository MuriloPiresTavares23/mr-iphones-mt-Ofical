
// Configuração do Firebase (Troque pelas suas credenciais)
const firebaseConfig = {
  const firebaseConfig = {
  apiKey: "AIzaSyDsIWsBTtP7YiIYw0a1Reru3XFA9wajP9k",
  authDomain: "mr-iphones-mt-catalogo.firebaseapp.com",
  projectId: "mr-iphones-mt-catalogo",
  storageBucket: "mr-iphones-mt-catalogo.firebasestorage.app",
  messagingSenderId: "231517888492",
  appId: "1:231517888492:web:b12539a232484248e52ac9",
  measurementId: "G-4ZVCJET8BY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

function verificarSenha() {
  const senha = document.getElementById("senha").value;
  if (senha === "1234") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("painel").style.display = "block";
    carregarProdutos();
  } else {
    alert("Senha incorreta!");
  }
}

function mudarAba(aba) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
  document.querySelector(`[onclick="mudarAba('${aba}')"]`).classList.add("active");
  document.getElementById(aba).classList.add("active");
}

document.getElementById("imagem").addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("preview").src = e.target.result;
    document.getElementById("preview").style.display = "block";
  };
  reader.readAsDataURL(this.files[0]);
});

function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value;
  const imagem = document.getElementById("imagem").files[0];

  if (!nome || !descricao || !imagem) return alert("Preencha todos os campos.");

  const nomeImagem = Date.now() + "_" + imagem.name;
  const uploadTask = storage.ref("produtos/" + nomeImagem).put(imagem);

  uploadTask.on("state_changed", null, null, function () {
    uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
      const novoProduto = { nome, categoria, descricao, imagem: url };
      db.ref("produtos").push(novoProduto);
      alert("Produto salvo!");
      document.getElementById("nome").value = "";
      document.getElementById("descricao").value = "";
      document.getElementById("categoria").value = "";
      document.getElementById("imagem").value = "";
      document.getElementById("preview").style.display = "none";
      carregarProdutos();
    });
  });
}

function carregarProdutos() {
  const container = document.getElementById("gerenciar") || document.getElementById("listaProdutos");
  if (!container) return;
  container.innerHTML = "";

  db.ref("produtos").once("value", function (snapshot) {
    snapshot.forEach(function (child) {
      const key = child.key;
      const prod = child.val();
      const div = document.createElement("div");
      div.className = container.id === "gerenciar" ? "produto-item" : "produto";
      div.innerHTML = \`
        <img src="\${prod.imagem}" alt="\${prod.nome}" />
        <h3>\${prod.nome}</h3>
        <p>\${prod.categoria || ""}</p>
        <p>\${prod.descricao}</p>
        \${container.id === "listaProdutos" ? '<a href="https://wa.me/SEUNUMERO?text=Tenho%20interesse%20no%20produto%20' + encodeURIComponent(prod.nome) + '" target="_blank"><button>Falar no WhatsApp</button></a>' : '<button onclick="removerProduto(\'\${key}\')">Excluir</button>'}
      \`;
      container.appendChild(div);
    });
  });
}

function removerProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    db.ref("produtos/" + id).remove().then(carregarProdutos);
  }
}
