const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite"); // async/await avec sqlite3
const path = require("path");
const fs = require("fs");

const app = express();

// --- CORS ---
app.use(cors());

app.use(express.json());
app.use(fileUpload());

// --- DB ---
const DB_PATH = path.join("/app/data", "db.sqlite");

async function initDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    )
  `);

  return db;
}

initDb().then((db) => {
  // --- Routes ---

  app.get("/api/products", async (req, res) => {
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const { name, price } = req.body;
    const file = req.files?.image;

    let filename = null;
    if (file) {
      filename = file.name;
      const uploadPath = path.join("/app/frontend/images", filename);
      await file.mv(uploadPath);
    }

    await db.run("INSERT INTO products (name, price, image) VALUES (?, ?, ?)", [
      name,
      price,
      filename,
    ]);

    res.json({ status: "OK" });
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = req.params.id;

    const row = await db.get("SELECT image FROM products WHERE id = ?", [id]);
    if (row?.image) {
      const imgPath = path.join("/app/frontend/images", row.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.run("DELETE FROM products WHERE id = ?", [id]);
    res.json({ status: "deleted" });
  });

  // --- Lancer serveur ---
  const PORT = 8000;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
