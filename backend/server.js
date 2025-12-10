const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: "http://192.168.56.10:8080",
  })
);
app.use(express.json());
app.use(fileUpload());

// --- DB ---
const db = new Database("db.sqlite");
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT
    )
`);

// --- GET produits ---
app.get("/api/products", (req, res) => {
  const rows = db.prepare("SELECT * FROM products").all();
  res.json(rows);
});

// --- POST produit + upload image ---
app.post("/api/products", (req, res) => {
  const { name, price } = req.body;
  const img = req.files?.image;

  if (!name || !price || !img)
    return res.status(400).json({ error: "Missing fields" });

  const imgName = Date.now() + "-" + img.name;
  const imgPath = path.join("/frontend/images", imgName);

  img.mv(imgPath);

  db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)").run(
    name,
    price,
    imgName
  );

  res.json({ status: "OK" });
});

// --- DELETE produit ---
app.delete("/api/products/:id", (req, res) => {
  const row = db
    .prepare("SELECT image FROM products WHERE id = ?")
    .get(req.params.id);

  if (row?.image) {
    const fullPath = "/frontend/images/" + row.image;
    try {
      require("fs").unlinkSync(fullPath);
    } catch {}
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);

  res.json({ status: "deleted" });
});

const PORT = 8000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
