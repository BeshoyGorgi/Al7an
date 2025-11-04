const tbody = document.querySelector("#kinderDetails tbody");

// Kinder aus der DB laden
async function ladeKinderDetails() {
  try {
    const response = await fetch("http://localhost:3000/api/kinder");
    if (!response.ok) throw new Error("Fehler beim Laden der Kinder");

    const kinderListe = await response.json();

    tbody.innerHTML = ""; // Tabelle leeren

    kinderListe.forEach(kind => {
      const tr = document.createElement("tr");
      tr.dataset.id = kind.id; // <-- ID speichern
      tr.innerHTML = `
        <td>${kind.name}</td>
        <td contenteditable="true">${kind.klasse || ""}</td>
        <td contenteditable="true">${kind.eltern || ""}</td>
        <td contenteditable="true">${kind.telefon || ""}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='4'>Fehler beim Laden der Kinder</td></tr>";
  }
}

// Änderungen speichern beim Verlassen der Zelle
tbody.addEventListener("blur", async (e) => {
  const td = e.target;
  if (!td.matches("td[contenteditable='true']")) return; // Nur editable-Zellen
  const tr = td.parentElement;
  const id = tr.dataset.id;
  if (!id) return;

  const spaltenIndex = td.cellIndex;
  let feldName;
  if (spaltenIndex === 1) feldName = "klasse";
  if (spaltenIndex === 2) feldName = "eltern";
  if (spaltenIndex === 3) feldName = "telefon";
  if (!feldName) return;

  const wert = td.textContent.trim();

  try {
    await fetch(`http://localhost:3000/api/kinder/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [feldName]: wert })
    });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
}, true);

// Enter-Taste speichert automatisch
tbody.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
});

// Funktion direkt aufrufen
ladeKinderDetails();

// Zurück-Button
document.getElementById("zurueckButton").addEventListener("click", () => {
  window.location.href = "/frontend/main/index.html";
});
