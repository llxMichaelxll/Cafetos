//todo eso es instalado

const express = require("express");
const cors = require("cors"); //se usa cuando se usan dos puertos distintos
const mysql = require("mysql2/promise");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const jwt = require("jsonwebtoken"); //para generar tokens
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const { connect } = require("http2");

//-----------------------------------------------------------

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

//Recuperar contraseña

// Endpoint para enviar un código de recuperación de contraseña
// app.get('/recuperar-contrasena/:email', async (req, res) => {
//   const { email } = req.params;

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     // Verificar si el correo electrónico está registrado en la base de datos
//     const [rows] = await connection.execute(
//       'SELECT COUNT(*) as count FROM clientes WHERE correo_electronico = ?',
//       [email]
//     );

//     if (rows[0].count === 0) {
//       // El correo electrónico no está registrado
//       res.json({
//         success: false,
//         message: 'El correo electrónico no está registrado',
//       });
//       return;
//     }

//     // Generar un código de recuperación de contraseña
//     const codigoRecuperacion = generateRandomCode();

//     // Guardar el código en la tabla codigos_validacion
//     await connection.execute(
//       'INSERT INTO codigos_validacion (codigo, correo_electronico, creado_en) VALUES (?, ?, NOW())',
//       [codigoRecuperacion, email]
//     );

//     // Enviar el código de recuperación por correo electrónico
//     const mailOptions = {
//       from: 'cafeCafetosCoff@hotmail.com',
//       to: email,
//       subject: 'Código de Recuperación de Contraseña',
//       text: `Tu código de recuperación de contraseña es: ${codigoRecuperacion}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error al enviar el correo electrónico:', error);
//         res.status(500).json({
//           success: false,
//           message: 'Error al enviar el código de recuperación por correo electrónico',
//         });
//         return;
//       }

//       console.log('Código de recuperación enviado:', info.response);

//       res.json({
//         success: true,
//         message: 'Código de recuperación enviado por correo electrónico',
//       });
//     });
//   } catch (error) {
//     console.error('Error al procesar la solicitud:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al generar el código de recuperación de contraseña',
//     });
//   }
// });

// // Endpoint para verificar el código y obtener los datos del usuario
// app.post('/verificar-codigo', async (req, res) => {
//   const { email, codigo } = req.body;

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     // Verificar si el código es válido para el correo electrónico dado
//     const [rows] = await connection.execute(
//       'SELECT * FROM codigos_validacion WHERE correo_electronico = ? AND codigo = ? AND TIMESTAMPDIFF(HOUR, creado_en, NOW()) <= 24',
//       [email, codigo]
//     );

//     if (rows.length === 0) {
//       // Código no válido o ha expirado
//       return res.json({
//         success: false,
//         message: 'Código de recuperación no válido o ha expirado',
//       });
//     }

//     // Código válido, obtén los datos del usuario
//     const [userData] = await connection.execute(
//       'SELECT * FROM clientes WHERE correo_electronico = ?',
//       [email]
//     );

//     if (userData.length === 0) {
//       // El correo electrónico no está registrado
//       return res.json({
//         success: false,
//         message: 'El correo electrónico no está registrado',
//       });
//     }

//     // Devuelve los datos del usuario para permitir la edición de la contraseña
//     res.json({
//       success: true,
//       message: 'Código de recuperación válido',
//       userData: userData[0],
//     });
//   } catch (error) {
//     console.error('Error al verificar el código y obtener los datos del usuario:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al verificar el código de recuperación',
//     });
//   }
// });

// // Endpoint para actualizar la contraseña
// app.post('/actualizar-contraseña', async (req, res) => {
//   const { email, nuevaContraseña } = req.body;

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     // Actualiza la contraseña del usuario en la base de datos
//     await connection.execute(
//       'UPDATE clientes SET contraseña = ? WHERE correo_electronico = ?',
//       [nuevaContraseña, email]
//     );

//     // Elimina el código de recuperación utilizado
//     await connection.execute(
//       'DELETE FROM codigos_validacion WHERE correo_electronico = ?',
//       [email]
//     );

//     res.json({
//       success: true,
//       message: 'Contraseña actualizada con éxito',
//     });
//   } catch (error) {
//     console.error('Error al actualizar la contraseña:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al actualizar la contraseña',
//     });
//   }
// });

/****************************** */

app.get('/recuperar-contrasena/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verificar si el correo electrónico está registrado en la base de datos
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM clientes WHERE correo_electronico = ?',
      [email]
    );

    if (rows[0].count === 0) {
      // El correo electrónico no está registrado
      res.json({
        success: false,
        message: 'El correo electrónico no está registrado',
      });
      return;
    }

    // Generar un código de recuperación de contraseña
    const codigoRecuperacion = generateRandomCode();

    // Guardar el código en la tabla codigos_validacion
    await connection.execute(
      'INSERT INTO codigos_validacion (codigo, correo_electronico, creado_en) VALUES (?, ?, NOW())',
      [codigoRecuperacion, email]
    );

    // Enviar el código de recuperación por correo electrónico
    const mailOptions = {
      from: 'cafeCafetosCoff@hotmail.com',
      to: email,
      subject: 'Código de Recuperación de Contraseña',
      text: `Tu código de recuperación de contraseña es: ${codigoRecuperacion}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).json({
          success: false,
          message: 'Error al enviar el código de recuperación por correo electrónico',
        });
        return;
      }

      console.log('Código de recuperación enviado:', info.response);

      res.json({
        success: true,
        message: 'Código de recuperación enviado por correo electrónico',
      });
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el código de recuperación de contraseña',
    });
  }
});

//traer clientes
app.get('/traer-cliente/:id_cliente', async (req, res) => {
  const { id_cliente } = req.params;
  
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar los detalles del cliente por su ID
    const [rows] = await connection.execute(
      'SELECT id_cliente, nombre_cliente, correo_electronico, id_ciudad, direccion, contrasena FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    );

    connection.end();

    // Comprobar si se encontró un cliente con el ID especificado
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado',
      });
    }

    // Enviar los detalles del cliente como respuesta
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener los detalles del cliente:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles del cliente',
    });
  }
});

// verificar codigo para recuperar contraseña
app.post('/verificar-codigo', async (req, res) => {
  const { email, codigo, nuevaContraseña } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verificar si el código es válido para el correo electrónico dado
    const [rows] = await connection.execute(
      'SELECT * FROM codigos_validacion WHERE correo_electronico = ? AND codigo = ? AND TIMESTAMPDIFF(HOUR, creado_en, NOW()) <= 24',
      [email, codigo]
    );

    if (rows.length === 0) {
      // Código no válido o ha expirado
      return res.json({
        success: false,
        message: 'Código de recuperación no válido o ha expirado',
      });
    }

    // Código válido, obtén los datos del usuario
    const [userData] = await connection.execute(
      'SELECT * FROM clientes WHERE correo_electronico = ?',
      [email]
    );

    if (userData.length === 0) {
      // El correo electrónico no está registrado
      return res.json({
        success: false,
        message: 'El correo electrónico no está registrado',
      });
    }

    // Actualiza la contraseña del usuario en la base de datos
    await connection.execute(
      'UPDATE clientes SET contrasena = ? WHERE correo_electronico = ?',
      [nuevaContraseña, email]
    );

    // Elimina el código de recuperación utilizado
    await connection.execute(
      'DELETE FROM codigos_validacion WHERE correo_electronico = ?',
      [email]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada con éxito',
    });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la contraseña',
    });
  }
});

/********************************** */
//Verificar
app.post("/verificar-codigo-registro", async (req, res) => {
  const { correo_electronico, codigo_validacion } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para verificar si el código de validación es correcto para el correo electrónico dado
    const [rows] = await connection.execute(
      "SELECT * FROM codigos_validacion WHERE  codigo = ? AND correo_electronico = ?",
      [codigo_validacion, correo_electronico]
    );

    connection.end();

    // Si hay un resultado en las filas, el código es válido; de lo contrario, no es válido
    const codigoValido = rows.length > 0;

    res.json({
      success: codigoValido,
      message: codigoValido
        ? "Código de validación correcto"
        : "Código de validación incorrecto",
    });
  } catch (err) {
    console.error("Error al verificar el código de validación:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al verificar el código de validación",
      });
  }
});

//mensajes enviar nodemiler
app.post("/enviar-respuesta", async (req, res) => {
  try {
    const { correo, mensaje } = req.body;

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "cafeCafetosCoff@hotmail.com",
        pass: "CaFeToSs4menos1",
      },
    });

    const mailOptions = {
      from: "cafeCafetosCoff@hotmail.com",
      to: correo,
      subject: "Respuesta a tu mensaje",
      text: mensaje,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar el correo" });
  }
});
// Configuración del transporter de nodemailer (debes llenar con tus propios datos)
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "cafeCafetosCoff@hotmail.com",
    pass: "CaFeToSs4menos1",
  },
});

// Endpoint para generar y enviar un código de validación
app.post("/generar-codigo", async (req, res) => {
  const { correo_electronico } = req.body;

  const codigo = generateRandomCode(); // Función para generar un código aleatorio

  const query =
    "INSERT INTO codigos_validacion (codigo, correo_electronico) VALUES (?, ?)";

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(query, [codigo, correo_electronico]);

    connection.end();

    // Enviar el código por correo electrónico
    const mailOptions = {
      from: "cafeCafetosCoff@hotmail.com",
      to: correo_electronico,
      subject: "Código de Validación",
      text: `Tu código de validación es: ${codigo} si no has intentado registrarte en nuestra pagina, Caffetoscafe.co ignora este mensaje`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
        res
          .status(500)
          .json({
            success: false,
            message: "Error al enviar el código por correo electrónico",
          });
        return;
      }

      console.log("Código de validación enviado:", info.response);
      res.json({
        success: true,
        message: "Código de validación enviado por correo electrónico",
      });
    });
  } catch (err) {
    console.error("Error al insertar el código en la base de datos:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al generar el código de validación",
      });
  }
});

// Función para generar un código aleatorio
function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
// Ruta para autenticar al usuario
app.post("/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar el usuario por correo y contraseña
    const [rows] = await connection.execute(
      "SELECT nombre_cliente, correo_electronico, id_cliente, rol FROM clientes WHERE correo_electronico = ? AND contrasena = ?",
      [correo_electronico, contrasena]
    );

    connection.end();

    if (rows.length === 1) {
      // Login exitoso, generar un token JWT
      const token = jwt.sign(
        { userId: rows[0].id_cliente, role: rows[0].rol },
        "qpwoeiruty", // Reemplazar 'secretKey' con una clave segura
        { expiresIn: "1h" } // Opcional: expiración del token
      );

      //console.log("Token generado:", token); // Agrega esta línea para mostrar el token en la consola

      res.json({
        success: true,
        nombre: rows[0].nombre_cliente,
        rol: rows[0].rol,
        token: token, // Enviar el token al cliente,
        id_usuario: rows[0].id_cliente,
      });
    } else {
      // Credenciales inválidas
      res.json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    console.error("Error al autenticar al cliente:", err);
    res
      .status(500)
      .json({ success: false, message: "Error al autenticar al cliente" });
  }
});

// Ruta guardar mensajes
app.post("/guardar-mensaje", async (req, res) => {
  try {
    const { nombre, correo, solicitud, asunto } = req.body;

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      "INSERT INTO mensajes (nombre, correo, asunto, solicitud) VALUES (?, ?, ?, ?)",
      [nombre, correo, asunto, solicitud]
    );

    connection.end();

    res.json({ success: true, message: "Mensaje guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al guardar el mensaje" });
  }
});

// traer mensajes
app.get("/obtener-mensajes", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * FROM mensajes");

    connection.end();

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener mensajes" });
  }
});

//Ruta para eliminar mensajes
app.delete("/eliminar-mensaje/:id", async (req, res) => {
  try {
    const messageId = req.params.id;

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute("DELETE FROM mensajes WHERE id = ?", [messageId]);

    connection.end();

    res.json({ success: true, message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el mensaje" });
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
    res.status(500).json({
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

app.post("/verificar-correo", async (req, res) => {
  const { correo_electronico } = req.body;

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultar si el correo electrónico ya está registrado
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM clientes WHERE correo_electronico = ?",
      [correo_electronico]
    );

    // Cerrar la conexión a la base de datos
    connection.close();

    const count = rows[0].count;

    if (count > 0) {
      // El correo electrónico ya está registrado
      res.json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    } else {
      // El correo electrónico no está registrado
      res.json({
        success: true,
        message: "El correo electrónico está disponible",
      });
    }
  } catch (error) {
    console.error("Error al verificar el correo electrónico:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al verificar el correo electrónico",
      });
  }
});
// Ruta para registrar un nuevo usuario
app.post("/reg", async (req, res) => {
  const {
    nombre_usuario,
    correo_electronico,
    id_ciudad,
    contrasena,
    rol,
    direccion,
    codigo_validacion, // Agregar este campo
  } = req.body;

  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Insertar el nuevo usuario en la tabla de usuarios
    const [result] = await connection.execute(
      "INSERT INTO clientes (nombre_cliente, correo_electronico, id_ciudad, contrasena, rol, direccion) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre_usuario,
        correo_electronico,
        id_ciudad,
        contrasena,
        rol,
        direccion,
      ]
    );

    connection.end();

    // Obtén el ID del usuario recién registrado
    const userId = result.insertId;

    // Registro exitoso, enviar una respuesta de éxito con el ID del usuario
    res.json({ success: true, message: "Registro exitoso", userId });
  } catch (err) {
    console.error("Error al registrar al cliente:", err);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar al cliente" });
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
    res.status(500).json({
      success: false,
      message: "Error al obtener la lista de categorías",
    });
  }
});


// Ruta para actualizar cliente desde la compra
app.put('/clientes/:id_cliente', async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;
    const { direccion, nombre_cliente, id_ciudad } = req.body;

    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta SQL para actualizar los datos del cliente
    const sql = 'UPDATE clientes SET direccion = ?, nombre_cliente = ?, id_ciudad = ? WHERE id_cliente = ?';
    const values = [direccion, nombre_cliente, id_ciudad, id_cliente];

    // Ejecutar la consulta
    const [result] = await connection.execute(sql, values);

    // Cerrar la conexión a la base de datos
    connection.end();

    res.json({ success: true,message: 'Cliente actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar el cliente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    res.status(500).json({
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
    let cantidad; 
     id_categoria === '2' ? cantidad=10 : cantidad=1;
    const connection = await mysql.createPool(dbConfig).getConnection();

    await connection.execute(
      "INSERT INTO productos (nombre_producto, descripcion, precio, id_categoria, url_imagen,existencias,cantidad) VALUES (?, ?, ?, ?, ?,?,?)",
      [
        nombre_producto,
        descripcion,
        precio,
        id_categoria,
        url_imagen,
        existencias,
        cantidad
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
        res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: "Error al obtener la lista de imágenes",
    });
  }
});

//Ruta traer datos cliente
app.get('/datos-cliente/:id_cliente', async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute('SELECT correo_electronico,direccion,nombre_cliente,id_ciudad FROM clientes WHERE id_cliente=?', [id_cliente]);
    connection.end();

    if (rows.length > 0) {
      const id_ciudad = rows[0].id_ciudad;
      const connectionCiudad = await mysql.createConnection(dbConfig); // Usar una variable diferente
      const [ciudadRows] = await connectionCiudad.execute('SELECT nombre_ciudad FROM ciudades WHERE id_ciudad=?', [id_ciudad]);
      connectionCiudad.end();

      if (ciudadRows.length > 0) {
        res.json({ success: true, ciudad: ciudadRows[0].nombre_ciudad, rows });
      } else {
        res.json({ success: false, message: 'Ciudad no encontrada' });
      }
    } else {
      res.json({ success: false, message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
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
    res.status(500).json({
      success: false,
      message: "Error al obtener la lista de ciudades",
    });
  }
});

// app.post('/nuevo-pedido', async (req, res) => {
//   const { id_usuario, monto_total, productos, estado,detalles } = req.body;

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [result] = await connection.execute('INSERT INTO pedidos (id_cliente, monto_total, productos, estado, detalles) VALUES (?, ?, ?, ?, ?)', [id_usuario, monto_total, productos, estado, detalles]);

//     const id_pedido = result.insertId; // Obtén la ID del pedido recién insertado

//     // Traer email
//     const [clienteEmailRows] = await connection.execute('Select correo_electronico from clientes where  id_cliente = ? ', [id_usuario]);
// if (clienteEmailRows.length > 0) {
//   const clienteEmail = clienteEmailRows[0].correo_electronico;

//   connection.execute('select monto_total,fecha_pedido,productos from pedidos where id_pedido = ?',[id_pedido])

//   const mensajeCliente = 'Gracias por tu compra. Tu pedido ha sido confirmado.';
//   await enviarCorreoCliente(clienteEmail, 'Confirmación de Pedido', mensajeCliente);
// } else {
//   console.error('No se encontró la dirección de correo electrónico del cliente.');
//   // Maneja el caso en el que no se encuentra la dirección de correo electrónico del cliente.
// }
//     // Envía el correo electrónico al administrador
//     const mensajeAdmin = 'Se ha realizado un nuevo pedido en la tienda.';
//     await enviarCorreoAdministrador('Nuevo Pedido', mensajeAdmin);

//     connection.end();
//     res.json({ success: true, message: "pedido completo" });
//   } catch (error) {
//     console.error("Error al guardar el pedido:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error al guardar el pedido" });
//   }
// });

app.post('/nuevo-pedido', async (req, res) => {
  const { id_usuario, monto_total, productos, estado, detalles } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Inserta el pedido en la base de datos y obtén su ID
    const [result] = await connection.execute('INSERT INTO pedidos (id_cliente, monto_total, productos, estado, detalles) VALUES (?, ?, ?, ?, ?)', [id_usuario, monto_total, productos, estado, detalles]);
    const id_pedido = result.insertId;

    // Traer email
    const [clienteEmailRows] = await connection.execute('SELECT correo_electronico FROM clientes WHERE id_cliente = ?', [id_usuario]);
    if (clienteEmailRows.length > 0) {
      const clienteEmail = clienteEmailRows[0].correo_electronico;

      // Obtén los detalles adicionales del pedido
      const [pedidoDetailsRows] = await connection.execute('SELECT monto_total, fecha_pedido FROM pedidos WHERE id_pedido = ?', [id_pedido]);

      if (pedidoDetailsRows.length > 0) {
        const pedidoDetails = pedidoDetailsRows[0];
        const { monto_total, fecha_pedido } = pedidoDetails;

        // Crea el mensaje para el cliente con los detalles del pedido en formato HTML
        const productosFormateadosHTML = productos.map(producto => `
          <p>Producto: ${producto.nombre_producto}</p>
          <p>Cantidad: ${producto.cantidad} unidades</p>
        `).join('<br>');

        const mensajeClienteHTML = `
          <p>Gracias por tu compra. Tu pedido ha sido confirmado.</p>
          <h2>Detalles del pedido:</h2>
          ${productosFormateadosHTML}
          <p>Monto Total: ${monto_total}</p>
          <p>Fecha del Pedido: ${fecha_pedido}</p>
        `;

        // Envía el correo electrónico al cliente con contenido HTML
        await enviarCorreoCliente(clienteEmail, 'Confirmación de Pedido', mensajeClienteHTML);
      } else {
        console.error('No se encontraron detalles del pedido.');
        // Maneja el caso en el que no se encuentran detalles del pedido.
      }
    } else {
      console.error('No se encontró la dirección de correo electrónico del cliente.');
      // Maneja el caso en el que no se encuentra la dirección de correo electrónico del cliente.
    }

    // Envía el correo electrónico al administrador
    const mensajeAdmin = 'Se ha realizado un nuevo pedido en la tienda.';
    await enviarCorreoAdministrador('Nuevo Pedido', mensajeAdmin);

    connection.end();
    res.json({ success: true, message: "pedido completo" });
  } catch (error) {
    console.error("Error al guardar el pedido:", error);
    res.status(500).json({ success: false, message: "Error al guardar el pedido" });
  }
});


app.get('/traer-pedidos-usuario/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params; // Aquí obtén el valor del parámetro idUsuario

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM pedidos WHERE id_cliente = ?', [idUsuario]);

    connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    res.status(500).json({ success: false, message: "Error al cargar pedidos" });
  }
});

app.get('/traer-pedidos-admin', async (req,res)=>{

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('select * from pedidos')
    connection.end()

    res.json(rows)
  } catch (error) {
    console.log('error al traer pedidos' + error)
    res.status(500).json({success: false, message: "Error al traer pedidos"})
  }
})

// Ruta para agregar una nueva noticia
app.post('/nueva-noticia', async (req, res) => {
  try {
    const { encabezado, url_imagen, texto_noticia } = req.body;

    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Insertar la nueva noticia en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO noticias (encabezado, url_imagen, texto_noticia) VALUES (?, ?, ?)',
      [encabezado, url_imagen, texto_noticia]
    );

    connection.end();

    res.status(201).json({ message: 'Noticia agregada correctamente', insertedId: result.insertId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Hubo un error al agregar la noticia' });
  }
});

// Ruta para eliminar una noticia por ID
app.delete('/eliminar-noticia/:id', async (req, res) => {
  try {
    const noticiaId = req.params.id;

    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Eliminar la noticia de la base de datos
    const [result] = await connection.execute(
      'DELETE FROM noticias WHERE id = ?',
      [noticiaId]
    );

    connection.end();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Noticia no encontrada' });
    } else {
      res.status(200).json({ message: 'Noticia eliminada correctamente' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar la noticia' });
  }
});

// Ruta para obtener todas las noticias
app.get('/noticias', async (req, res) => {
  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Obtener todas las noticias de la base de datos
    const [rows] = await connection.execute('SELECT * FROM noticias');

    connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Hubo un error al obtener las noticias' });
  }
});

//Ruta para traer productos por categorias
app.get('/producto-categoria/:categoria', async (req, res) => {
  const { categoria } = req.params;

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta SQL para seleccionar productos por categoría
    const [rows] = await connection.execute('SELECT * FROM productos WHERE id_categoria = ?', [categoria]);

    // Cerrar la conexión a la base de datos
    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para editar una noticia por ID
app.put('/editar-noticia/:id', async (req, res) => {
  try {
    const noticiaId = req.params.id;
    const { encabezado, url_imagen, texto_noticia } = req.body;

    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Actualizar la noticia en la base de datos
    const [result] = await connection.execute(
      'UPDATE noticias SET encabezado = ?, url_imagen = ?, texto_noticia = ? WHERE id = ?',
      [encabezado, url_imagen, texto_noticia, noticiaId]
    );

    connection.end();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Noticia no encontrada' });
    } else {
      res.status(200).json({ message: 'Noticia editada correctamente' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Hubo un error al editar la noticia' });
  }
});

//proceso para enviar mensaje de nuevo pedido

// Función para enviar el correo electrónico al cliente
async function enviarCorreoCliente(destinatario, asunto, contenidoHTML) {
  const mailOptions = {
    from: 'cafeCafetosCoff@hotmail.com', // Cambia esto por tu dirección de correo electrónico
    to: destinatario,
    subject: asunto,
    html: contenidoHTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado al cliente con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico al cliente:', error);
  }
};

// Función para enviar el correo electrónico al administrador
const enviarCorreoAdministrador = async (asunto, contenido) => {
  const mailOptions = {
    from: 'cafeCafetosCoff@hotmail.com',
    to: 'llvvvastolordvvll@gmail.com',
    subject: asunto,
    html: contenido,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado al administrador con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico al administrador:', error);
  }
};

//registrar venta
app.post('/registrar-venta', async (req, res) => {
  const { id_producto, cantidad_vendida, subtotal } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [productoRows] = await connection.execute('SELECT nombre_producto FROM productos WHERE id_producto = ?', [id_producto]);
    
    if (productoRows.length === 0) {
      connection.end();
      return res.status(404).json({ success: false, message: "El producto no fue encontrado" });
    }

    const productoNombre = productoRows[0].nombre_producto;

    const [ventaRows] = await connection.execute('SELECT id_venta, cantidad_vendida, subtotal FROM registro_ventas WHERE id_producto = ?', [id_producto]);
    
    if (ventaRows.length === 0) {
      // No se encontró un registro existente, por lo que se inserta uno nuevo
      await connection.execute('INSERT INTO registro_ventas (id_producto, cantidad_vendida, subtotal, nombre_producto) VALUES (?, ?, ?, ?)', [id_producto, cantidad_vendida, subtotal, productoNombre]);
      connection.end();
      return res.json({ success: true, message: "Venta registrada correctamente" });
    }
 
    // Ya existe un registro con la misma id_producto, actualiza la cantidad_vendida y subtotal
    const existingRecord = ventaRows[0];
    const updatedCantidadVendida = existingRecord.cantidad_vendida + cantidad_vendida;
    // const updatedSubtotal = existingRecord.subtotal + subtotal;
     const updatedSubtotal = parseInt(existingRecord.subtotal) + parseInt(subtotal);
   

    console.log("subtotal enviado:", subtotal, " subtotal en base: ", existingRecord.subtotal, " suma: ",updatedSubtotal )
    await connection.execute('UPDATE registro_ventas SET cantidad_vendida = ?, subtotal = ? WHERE id_venta = ?', [updatedCantidadVendida, updatedSubtotal, existingRecord.id_venta]);

    connection.end();
    res.json({ success: true, message: "Venta registrada correctamente (registro actualizado)" });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ success: false, message: "Error al registrar la venta" });
  }
});


// app.post('/registrar-venta', async (req, res) => {
//   const { id_producto, cantidad_vendida, subtotal } = req.body;

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute('SELECT nombre_producto FROM productos WHERE id_producto = ?', [id_producto]);
    
//     if (rows.length === 0) {
//       connection.end();
//       return res.status(404).json({ success: false, message: "El producto no fue encontrado" });
//     }

//     const productoNombre = rows[0].nombre_producto;

//     await connection.execute('INSERT INTO registro_ventas (id_producto, cantidad_vendida, subtotal, nombre_producto) VALUES (?, ?, ?, ?)', [id_producto, cantidad_vendida, subtotal, productoNombre]);

//     connection.end();
//     res.json({ success: true, message: "Venta registrada correctamente" });
//   } catch (error) {
//     console.error("Error al registrar la venta:", error);
//     res.status(500).json({ success: false, message: "Error al registrar la venta" });
//   }
// });


app.get('/ventas', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los datos de ventas
    const [rows] = await connection.execute('SELECT * FROM registro_ventas');

    connection.end();

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener los datos de ventas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los datos de ventas' });
  }
});

app.put("/actualizar-estado/:idPedido", async (req, res) => {
  const { idPedido } = req.params;
  const { estado } = req.body; // Supongamos que el nuevo estado se recibe en el cuerpo de la solicitud

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Realizar la actualización del estado en la base de datos
    const updateQuery = "UPDATE pedidos SET estado = ? WHERE id_pedido = ?";
    const [result] = await connection.execute(updateQuery, [estado,idPedido ]);

    // Verificar si se realizó la actualización correctamente
    if (result.affectedRows === 1) {
      res.status(200).json({ message: "Estado actualizado exitosamente", success: true });
    } else {
      res.status(404).json({ success: false,message: "Pedido no encontrado" });
    }

    // Cerrar la conexión
    connection.end();
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
app.put('/act-cliente/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const { nombre_cliente, id_ciudad, contrasena, direccion } = req.body;

    // Aquí debes escribir la lógica para actualizar el cliente en tu base de datos.
    // Puedes utilizar una consulta SQL o el ORM que estés utilizando.

    // Ejemplo con consulta SQL (usando el paquete mysql2):
    const updateQuery = `
      UPDATE clientes
      SET nombre_cliente = ?, id_ciudad = ?, contrasena = ?, direccion = ?
      WHERE id_cliente = ?
    `;

    const connection = await mysql.createConnection(dbConfig)
    // Ejecutar la consulta
     connection.execute(updateQuery, [nombre_cliente, id_ciudad, contrasena, direccion, id_cliente]);

     connection.end()

    res.status(200).json({ success: true, message: 'Cliente actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el cliente' });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`)
);
