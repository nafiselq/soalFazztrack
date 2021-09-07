const { query } = require("express");
const express = require("express");
const app = express();
app.use(express.static("public"));
const mysql = require("mysql");
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "naqr1628",
  password: "skfkrndY69!",
  database: "naqr1628_fazztrack",
});

connection.connect(function (err) {
  if (err) {
    console.log("error connecting" + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/index", (req, res) => {
  connection.query("SELECT * FROM produk", (error, results) => {
    res.render("index.ejs", { items: results });
    // console.log(results);
  });
});

// route untuk menuju ke halaman penambahan item
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/create", (req, res) => {
  // query untuk menambahkan data ke database
  connection.query(
    "INSERT INTO produk (nama_produk, keterangan, harga, jumlah) VALUES (?,?,?,?)",
    [
      req.body.itemName,
      req.body.itemKeterangan,
      req.body.itemHarga,
      req.body.itemJumlah,
    ],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  // code untuk mendapatkan item yang dipilih dari database
  connection.query(
    "SELECT * FROM produk WHERE id_produk = ?",
    [req.params.id],
    (error, results) => {
      res.render("edit.ejs", { item: results[0] });
      console.log(results);
    }
  );
});

app.post("/update/:id", (req, res) => {
  // Ketik code untuk memperbarui item yang dipilih
  connection.query(
    "UPDATE produk SET nama_produk = ?, keterangan = ?, harga = ?, jumlah = ? WHERE id_produk = ?",
    [
      req.body.itemName,
      req.body.itemKeterangan,
      req.body.itemHarga,
      req.body.itemJumlah,
      req.params.id,
    ],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  // code untuk menghapus data di database
  connection.query(
    "DELETE FROM produk WHERE id_produk = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

app.listen(3000);
