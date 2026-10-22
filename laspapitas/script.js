// ====== CONFIGURACIÓN ======
const IG_USER = "laspapitass_";

// Para agregar la foto de cada producto: poné la ruta en "img" (ej: "img/papas.jpg").
// Si img está vacío se muestra el emoji.
// Completá los precios (en pesos, solo el número).
const PRODUCTS = [
  { id: 1, name: "Papas fritas", img:"papas.png" , price: 0,
    desc: "Papas fritas con cualquier aderezo a elección(Aclarar en las notas del pedido) + cheddar." },
  { id: 2, name: "Bomba de papa",  img: "bombinis.png", price: 0,
    desc: "3 bombas de papa con cualquier aderezo a elección." },
  { id: 3, name: "Tortilla de papa",  img: "tortilla.png", price: 0,
    desc: "Tortilla de papa." },
  { id: 4, name: "Caritas", img: "caritas.png", price: 0,
    desc: "Caritas de papa en broche." }
];
// ===========================

const $ = id => document.getElementById(id);
const money = n => "$" + n.toLocaleString("es-AR");
const cart = {};

function visual(p) {
  return p.img ? `<img src="${p.img}" alt="${p.name}">` : p.emoji;
}

function renderGrid() {
  $("grid").innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="thumb">${visual(p)}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row">
        <span class="price">${money(p.price)}</span>
        <button class="add" data-id="${p.id}">Agregar</button>
      </div>
    </article>`).join("");
}

function renderCart() {
  const ids = Object.keys(cart);
  let total = 0, count = 0;
  $("items").innerHTML = ids.length ? ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id), q = cart[id];
    total += p.price * q; count += q;
    return `<div class="item">
      <div class="e">${p.img ? `<img src="${p.img}" alt="">` : (p.emoji || "🥔")}</div>
      <div class="n">${p.name}<small>${money(p.price)}</small></div>
      <div class="qty">
        <button data-act="minus" data-id="${id}">−</button>
        <span>${q}</span>
        <button data-act="plus" data-id="${id}">+</button>
      </div>
    </div>`;
  }).join("") : `<p class="empty">Tu carrito está vacío 🥔</p>`;
  $("total").textContent = money(total);
  $("count").textContent = count;
  $("send").disabled = !count;
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 2500);
}

function openDrawer(on) {
  $("drawer").classList.toggle("on", on);
  $("ov").classList.toggle("on", on);
}

$("grid").addEventListener("click", e => {
  const b = e.target.closest(".add");
  if (!b) return;
  cart[b.dataset.id] = (cart[b.dataset.id] || 0) + 1;
  renderCart();
  toast("Agregado al carrito 🥔");
});

$("items").addEventListener("click", e => {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const id = b.dataset.id;
  cart[id] += b.dataset.act === "plus" ? 1 : -1;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
});

$("open").onclick = () => openDrawer(true);
$("close").onclick = () => openDrawer(false);
$("ov").onclick = () => openDrawer(false);

$("send").onclick = async () => {
  const name = $("name").value.trim();
  const notes = $("notes").value.trim();
  let total = 0;
  const lines = Object.keys(cart).map(id => {
    const p = PRODUCTS.find(x => x.id == id), q = cart[id];
    total += p.price * q;
    return `• ${q} x ${p.name} (${money(p.price * q)})`;
  });
  const msg = `¡Hola Las Papitas! Quiero hacer un pedido${name ? " a nombre de " + name : ""}:\n\n` +
    lines.join("\n") + `\n\nTotal: ${money(total)}` + (notes ? `\n\nAclaraciones: ${notes}` : "");
  try { await navigator.clipboard.writeText(msg); toast("Pedido copiado, pegalo en el chat"); }
  catch { toast("Abrí el chat y escribí tu pedido"); }
  window.open(`https://ig.me/m/${IG_USER}`, "_blank", "noopener");
};

$("iglink").href = `https://instagram.com/${IG_USER}`;
renderGrid();
renderCart();
