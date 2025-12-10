/*const API = "http://localhost:8000"*/
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://192.168.56.10:8000";

async function loadProducts() {
  const res = await fetch(`${API}/api/products`);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((p) => {
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
            <img src="/images/${p.image}">
            <h3>${p.name}</h3>
            <p>${p.price} €</p>
            <button onclick="deleteProduct(${p.id})">Supprimer</button>
        `;
    container.appendChild(el);
  });
}

async function deleteProduct(id) {
  await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
  loadProducts();
}

document.getElementById("addForm").onsubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  await fetch(`${API}/api/products`, {
    method: "POST",
    body: data,
  });

  e.target.reset();
  loadProducts();
};

loadProducts();
