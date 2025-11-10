import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gradwork",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar con MySQL:", err.message);
  } else {
    console.log("Conectado a la base de datos GradWork");
  }
});

export default connection;
