import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",      // oder 127.0.0.1 --> http://localhost:3000/api/kinder
  user: "root",           // dein MySQL-Benutzername
  password: "IHIBHE10d.", // ersetze das durch dein MySQL-Passwort
  database: "al7an_punkte"  // der Name deiner Datenbank
});

db.connect((err) => {
  if (err) {
    console.error("Fehler bei der Datenbankverbindung:", err.message);
  } else {
    console.log("Erfolgreich mit MySQL verbunden!");
  }
});

export default db;
