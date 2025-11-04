import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// === Alle Kinder abrufen ===
app.get("/api/kinder", (req, res) => {
  db.query("SELECT * FROM kinder", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// === Neues Kind hinzufügen ===
app.post("/api/kinder", (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name ist erforderlich" });
  }

  db.query("SELECT * FROM kinder WHERE LOWER(name) = LOWER(?)", [name], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length > 0) {
      return res.status(400).json({ error: `Das Kind "${name}" existiert bereits.` });
    }

    db.query(
      "INSERT INTO kinder (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: result.insertId,
          name,
          hymne: 0,
          verhalten: 0,
          anwesenheit_G: 0,
          anwesenheit_U: 0,
          gesamt: 0,
        });
      }
    );
  });
});

// === Kind aktualisieren (Name + Punkte) ===
app.put("/api/kinder/:id", (req, res) => {
  const { id } = req.params;
  const { name, hymne, verhalten, anwesenheit_G, anwesenheit_U, gesamt } = req.body;

  db.query(
    "UPDATE kinder SET name=?, hymne=?, verhalten=?, anwesenheit_G=?, anwesenheit_U=?, gesamt=? WHERE id=?",
    [name, hymne, verhalten, anwesenheit_G, anwesenheit_U, gesamt, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});


// === Kind löschen ===
app.delete("/api/kinder/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM kinder WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log("✅ Server läuft auf http://localhost:3000"));






// === KINDER DETAILS ===

// === GET /api/kinder ===
app.get("/api/kinder", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kinder");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// === POST /api/kinder ===
app.post("/api/kinder", (req, res) => {
  const { name, klasse = "", eltern = "", telefon = "" } = req.body;
  if (!name) return res.status(400).json({ error: "Name ist erforderlich" });

  db.query(
    "INSERT INTO kinder (name, hymne, verhalten, anwesenheit_G, anwesenheit_U, gesamt, klasse, eltern, telefon) VALUES (?, 0, 0, 0, 0, 0, ?, ?, ?)",
    [name, klasse, eltern, telefon],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: result.insertId,
        name,
        hymne: 0,
        verhalten: 0,
        anwesenheit_G: 0,
        anwesenheit_U: 0,
        gesamt: 0,
        klasse,
        eltern,
        telefon
      });
    }
  );
});


// === PUT /api/kinder/:id ===
app.put("/api/kinder/:id", async (req, res) => {
  const { id } = req.params;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);

  if (fields.length === 0) return res.status(400).json({ error: "Keine Felder zum Aktualisieren" });

  const setString = fields.map(f => `${f} = ?`).join(", ");

  try {
    await db.query(`UPDATE kinder SET ${setString} WHERE id = ?`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// === DELETE /api/kinder/:id ===
app.delete("/api/kinder/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM kinder WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



