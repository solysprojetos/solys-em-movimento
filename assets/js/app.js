/* ============================================================
   Solys em Movimento — lógica da página
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.APP_CONFIG || {};
  var TAMANHOS = ["PP", "P", "M", "G", "GG", "XXG", "XXXG"];

  /* ---------- ano no rodapé ---------- */
  var anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------- navbar: sombra ao rolar ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ao rolar ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- monta os botões de tamanho ---------- */
  var sizesEl = document.getElementById("sizes");
  TAMANHOS.forEach(function (t) {
    var lab = document.createElement("label");
    lab.className = "size";
    lab.innerHTML =
      '<input type="radio" name="tamanho" value="' + t + '"><span>' + t + "</span>";
    sizesEl.appendChild(lab);
  });

  var form = document.getElementById("form");
  var btn = document.getElementById("btn");
  var formmsg = document.getElementById("formmsg");
  var telefone = document.getElementById("telefone");

  /* ---------- máscara de telefone BR ---------- */
  telefone.addEventListener("input", function () {
    var d = this.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) {
      var corte = d.length > 10 ? 7 : 6;
      out = "(" + d.slice(0, 2) + ") " + d.slice(2, corte) + "-" + d.slice(corte);
    }
    this.value = out;
  });

  function setErro(id, mostrar) {
    var box = document.getElementById("err-" + id);
    var inp = document.getElementById(id);
    if (box) box.classList.toggle("show", mostrar);
    if (inp) inp.setAttribute("aria-invalid", mostrar ? "true" : "false");
  }

  function aviso(texto) {
    formmsg.textContent = texto;
    formmsg.classList.add("show");
  }

  ["nome", "email", "telefone"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      setErro(id, false);
      formmsg.classList.remove("show");
    });
  });
  sizesEl.addEventListener("change", function () {
    setErro("tamanho", false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formmsg.classList.remove("show");

    var nome = document.getElementById("nome").value.trim().replace(/\s+/g, " ");
    var email = document.getElementById("email").value.trim().toLowerCase();
    var tel = telefone.value.replace(/\D/g, "");
    var tamEl = form.querySelector('input[name="tamanho"]:checked');
    var tamanho = tamEl ? tamEl.value : "";
    var consent = document.getElementById("consent").checked;

    var ok = true;
    if (nome.length < 3 || nome.indexOf(" ") === -1) { setErro("nome", true); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) { setErro("email", true); ok = false; }
    if (tel.length < 10 || tel.length > 11) { setErro("telefone", true); ok = false; }
    if (!tamanho) { setErro("tamanho", true); ok = false; }
    if (!ok) {
      var primeiro = form.querySelector('[aria-invalid="true"]');
      if (primeiro) primeiro.focus();
      return;
    }
    if (!consent) { aviso("É preciso autorizar o uso dos dados para concluir."); return; }

    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) {
      aviso("Configuração do servidor indisponível. Tente novamente mais tarde.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Enviando...";

    var registro = {
      nome_completo: nome,
      email: email,
      telefone: tel,
      tamanho_camisa: tamanho,
    };

    fetch(CFG.SUPABASE_URL + "/rest/v1/" + CFG.SUPABASE_TABLE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + CFG.SUPABASE_ANON_KEY,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(registro),
    })
      .then(function (r) {
        if (r.ok) return null;
        return r.text().then(function (t) { throw new Error(t || "HTTP " + r.status); });
      })
      .then(function () {
        mostrarSucesso(nome, email, telefone.value, tamanho);
      })
      .catch(function (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = "Confirmar inscrição";
        aviso("Não conseguimos enviar sua inscrição agora. Verifique sua conexão e tente de novo.");
      });
  });

  function mostrarSucesso(nome, email, tel, tamanho) {
    document.getElementById("resumo").innerHTML =
      "<div><span>Nome</span><b>" + esc(nome) + "</b></div>" +
      "<div><span>E-mail</span><b>" + esc(email) + "</b></div>" +
      "<div><span>Telefone</span><b>" + esc(tel) + "</b></div>" +
      "<div><span>Camisa</span><b>" + esc(tamanho) + "</b></div>";
    form.style.display = "none";
    document.getElementById("sucesso").classList.add("show");
    var card = document.getElementById("inscricao");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  document.getElementById("novo").addEventListener("click", function () {
    form.reset();
    form.style.display = "";
    document.getElementById("sucesso").classList.remove("show");
    btn.disabled = false;
    btn.textContent = "Confirmar inscrição";
    document.getElementById("nome").focus();
  });
})();
