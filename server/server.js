const express = require("express");
const cors = require("cors"); //se usa cuando se usan dos puertos distintos
const mysql = require("mysql2/promise");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const jwt = require("jsonwebtoken"); //para generar tokens
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');

const app = express();

// Configurar middleware
app.use(express.json());
app.use(cors());

//------------------

// Configurar conexión a la base de datos MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123",
  database: "bdcafe",
};
// static para que se muestren las imagenes
app.use("/uploads", express.static("uploads"));
//subir magenes server
app.use(
  fileUpload({
    createParentPath: true,
    tempFileDir: "uploads",
    useTempFiles: true,
    debug: false,
  })
);

// Ruta para autenticar al usuario
app.post("/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar el usuario por correo y contraseña
    const [rows] = await connection.execute(
      "SELECT nombre_usuario, correo_electronico, id_ciudad, rol FROM usuarios WHERE correo_electronico = ? AND contrasena = ?",
      [correo_electronico, contrasena]
    );

    connection.end();

    if (rows.length === 1) {
      // Login exitoso, generar un token JWT
      const token = jwt.sign(
        { userId: rows[0].id_usuario, role: rows[0].rol },
        "qpwoeiruty", // Reemplazar 'secretKey' con una clave segura
        { expiresIn: "1h" } // Opcional: expiración del token
      );

      //console.log("Token generado:", token); // Agrega esta línea para mostrar el token en la consola

      res.json({
        success: true,
        nombre: rows[0].nombre_usuario,
        rol: rows[0].rol,
        token: token, // Enviar el token al cliente
      });
    } else {
      // Credenciales inválidas
      res.json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    console.error("Error al autenticar al usuario:", err);
    res
      .status(500)
      .json({ success: false, message: "Error al autenticar al usuario" });
  }
});

//Ruta para traer Productos

app.get("/productos", async (req, res) => {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar la lista de productos
    const [rows] = await connection.execute("SELECT * FROM productos");

    connection.end();

    // Enviar la lista de productos como respuesta
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener la lista de productos:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener la lista de productos",
      });
  }
});

// Ruta para eliminar un producto por su ID
app.delete("/productos/:idProducto", async (req, res) => {
  const { idProducto } = req.params;

  try {
    // Crear conexión a la base de datos utilizando un pool de conexiones
    const connection = await mysql.createPool(dbConfig).getConnection();

    // Eliminar el producto por su ID
    await connection.execute("DELETE FROM productos WHERE id_producto = ?", [
      idProducto,
    ]);

    connection.release(); // Liberar la conexión al pool

    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el producto" });
  }
});

// Ruta para actualizar un producto existente
app.put("/productos/:idProducto", async (req, res) => {
  const idProducto = req.params.idProducto;
  const {
    nombre_producto,
    descripcion,
    precio,
    id_categoria,
    url_imagen,
    existencias,
  } = req.body;

  try {
    // Crear conexión a la base de datos utilizando un pool de conexiones
    const connection = await mysql.createPool(dbConfig).getConnection();

    await connection.execute(
      "UPDATE productos SET nombre_producto = ?, descripcion = ?, precio = ?, id_categoria = ?, url_imagen = ?, existencias = ? WHERE id_producto = ?",
      [
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        url_imagen,
        existencias,
        idProducto,
      ]
    );

    connection.release(); // Liberar la conexión al pool

    res.json({ success: true, message: "Producto actualizado" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el producto" });
  }
});

// Ruta para registrar un nuevo usuario
app.post("/reg", async (req, res) => {
  const { nombre_usuario, correo_electronico, id_ciudad, contrasena, rol } =
    req.body;

  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Verificar si el correo electrónico ya existe en la tabla de usuarios
    const [rows] = await connection.execute(
      "SELECT correo_electronico FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (rows.length > 0) {
      // El correo electrónico ya existe, enviar una respuesta de error
      connection.end();
      return res
        .status(400)
        .json({
          success: false,
          message: "El correo electrónico ya está registrado",
        });
    }

    // Insertar el nuevo usuario en la tabla de usuarios
    await connection.execute(
      "INSERT INTO usuarios (nombre_usuario, correo_electronico, id_ciudad, contrasena,rol) VALUES (?, ?, ?, ?,?)",
      [nombre_usuario, correo_electronico, id_ciudad, contrasena, rol] // Puedes asignar un rol predeterminado al nuevo usuario
    );

    connection.end();

    // Registro exitoso, enviar una respuesta de éxito
    res.json({ success: true, message: "Registro exitoso" });
  } catch (err) {
    console.error("Error al registrar al usuario:", err);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar al usuario" });
  }
});
// Ruta para obtener la lista de categorías
app.get("/categorias", async (req, res) => {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar la lista de categorías
    const [rows] = await connection.execute(
      "SELECT id_categoria, nombre_categoria FROM categorias_productos"
    );

    connection.end();

    // Enviar la lista de categorías como respuesta
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener la lista de categorías:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener la lista de categorías",
      });
  }
});

// Ruta para obtener la lista de departamentos
app.get("/departamentos", async (req, res) => {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar la lista de departamentos
    const [rows] = await connection.execute(
      "SELECT id_departamento, nombre_departamento FROM departamentos"
    );

    connection.end();

    // Enviar la lista de departamentos como respuesta
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener la lista de departamentos:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener la lista de departamentos",
      });
  }
});

// Ruta para subir productos
app.post("/productos", async (req, res) => {
  const {
    nombre_producto,
    descripcion,
    precio,
    id_categoria,
    url_imagen,
    existencias,
  } = req.body;

  try {
    // Crear conexión a la base de datos utilizando un pool de conexiones
    const connection = await mysql.createPool(dbConfig).getConnection();

    await connection.execute(
      "INSERT INTO productos (nombre_producto, descripcion, precio, id_categoria, url_imagen,existencias) VALUES (?, ?, ?, ?, ?,?)",
      [
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        url_imagen,
        existencias,
      ]
    );

    connection.release(); // Liberar la conexión al pool

    res.json({ success: true, message: "Producto guardado" });
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al guardar el producto" });
  }
});
//--------------------------------

// subir imagenes ruta
app.post("/uploadFiles", async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files["file"];
      let fileuri = `uploads/${new Date().getTime()}${avatar.name}`.replace(
        /[^a-zA-Z0-9.\\\/]+/g,
        ""
      );
      avatar.mv(fileuri, async (err) => {
        if (err) {
          next(err);
          return;
        }

        res.json({
          base64: `data:${avatar.mimetype};base64, ${fs.readFileSync(fileuri, {
            encoding: "base64",
          })}`,
          url: fileuri.replace(/\\/g, "/"),
        });
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error al procesar archivo, intente de nuevo." });
  }
});
//--------------------------------
// Ruta para obtener la lista de imágenes
app.get("/obtenerImagenes", (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    // Obtener la ruta completa del directorio 'uploads'
    const uploadsDir = path.join(__dirname, "uploads");

    // Leer los archivos en el directorio 'uploads'
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        console.error("Error al leer el directorio de imágenes:", err);
        res
          .status(500)
          .json({
            success: false,
            message: "Error al obtener la lista de imágenes",
          });
      } else {
        // Crear un array con las rutas completas de las imágenes
        const imagenes = files.map(
          (file) => `http://localhost:5000/uploads/${file}`
        );

        // Enviar la lista de imágenes como respuesta en formato JSON
        res.json(imagenes);
      }
    });
  } catch (err) {
    console.error("Error al obtener la lista de imágenes:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener la lista de imágenes",
      });
  }
});

// Ruta para obtener la lista de ciudades por departamento
app.get("/ciudades/:idDepartamento", async (req, res) => {
  const { idDepartamento } = req.params;
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar la lista de ciudades por departamento
    const [rows] = await connection.execute(
      "SELECT id_ciudad, nombre_ciudad FROM ciudades WHERE id_departamento = ?",
      [idDepartamento]
    );

    connection.end();

    // Enviar la lista de ciudades como respuesta
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener la lista de ciudades:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener la lista de ciudades",
      });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`)
);
