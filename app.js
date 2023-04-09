const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password.123",
  database: "apirest",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.send("ruta de inicio api");
});

app.get("/api/articulos", (req, res) => {
  connection.query("SELECT * FROM articulos", (error, filas) => {
    if (error) {
      throw error;
    } else {
      res.send(filas);
    }
  });
});

app.get("/api/articulos/:id", (req, res) => {
  connection.query(
    "SELECT * FROM articulos WHERE id = ?",
    [req.params.id],
    (error, fila) => {
      if (error) {
        throw error;
      } else {
        res.send(fila);
      }
    }
  );
});

app.post("/api/articulos", (req, res) => {
  let data = {
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    stock: req.body.stock,
  };

  let sql = "INSERT INTO articulos SET ?";

  connection.query(sql, data, (error, result) => {
    if (error) {
      throw error.message;
    } else {
      // obtenemos el ID del registro insertado
      const id = result.insertId;

      // realizamos una consulta para obtener los datos del registro insertado
      connection.query(
        "SELECT * FROM articulos WHERE id = ?",
        id,
        (error, results) => {
          if (error) {
            throw error.message;
          } else {
            // enviamos los datos del registro insertado como respuesta
            res.send(results[0]);
          }
        }
      );
    }
  });
});

app.put("/api/articulos/:id", (req, res) => {
  let id = req.params.id;
  let descripcion = req.body.descripcion;
  let precio = req.body.precio;
  let stock = req.body.stock;
  let sql =
    "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";

  connection.query(sql, [descripcion, precio, stock, id], (error, results) => {
    if (error) {
      throw error.message;
    } else {
      res.send(results.insertId);
    }
  });
});

app.delete("/api/articulos/:id", (req, res) => {
  connection.query(
    "DELETE FROM articulos WHERE id = ? ",
    [req.params.id],
    (error, filas) => {
      if (error) {
        throw error.message;
      } else {
        res.send(filas);
      }
    }
  );
});

app.listen("3000", function () {
  console.log(`servidor ok`);
});
