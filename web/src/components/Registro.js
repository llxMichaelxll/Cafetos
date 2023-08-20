import React, { useState, useEffect } from "react";
import "../styles/registro.css";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [password, setPassword] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [correoExistente, setCorreoExistente] = useState(false);
  const [codigoValidacion, setCodigoValidacion] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValido, setCodigoValido] = useState(false);

  useEffect(() => {
    // Obtener la lista de departamentos desde el servidor al cargar el componente
    fetch("http://localhost:5000/departamentos")
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) =>
        console.error("Error al obtener la lista de departamentos:", error)
      );
  }, []);

  useEffect(() => {
    // Obtener la lista de ciudades por departamento desde el servidor cuando se seleccione un departamento
    if (departamento) {
      fetch(`http://localhost:5000/ciudades/${departamento}`)
        .then((response) => response.json())
        .then((data) => setCiudades(data))
        .catch((error) =>
          console.error("Error al obtener la lista de ciudades:", error)
        );
    }
  }, [departamento]);

  //Crea carrito de usuario
  const createCartForUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/create-cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Carrito creado para el usuario:', userId);
      } else {
        console.error('Error al crear el carrito:', data.message);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const handleRegistro = async () => {
    try {
      // Verificar que todos los campos estén completos
      if (!nombre || !correo || !departamento || !ciudad || !direccion || !password) {
        alert("Por favor, complete todos los campos");
        return;
      }
      if (!correo.includes("@")) {
        alert('El correo electrónico debe contener el símbolo "@"');
        return;
      }

      // Realizar la solicitud POST al backend para verificar si el correo ya existe
      const verificaCorreoResponse = await fetch("http://localhost:5000/verificar-correo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico: correo }),
      });

      const verificaCorreoData = await verificaCorreoResponse.json();

      if (verificaCorreoData.existe) {
        setCorreoExistente(true);
        return;
      }

      // Si el correo no existe, generar y enviar el código de validación
      const codigoResponse = await fetch("http://localhost:5000/generar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico: correo }),
      });

      const codigoData = await codigoResponse.json();

      if (codigoData.success) {
        setCodigoEnviado(true);
        alert("Se ha enviado un código de validación a tu correo electrónico.");
      } else {
        console.error("Error al generar el código de validación:", codigoData.message);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleEnviarCodigo = async () => {
    try {
      const codigoResponse = await fetch("http://localhost:5000/verificar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico: correo,
          codigo_validacion: codigoValidacion,
        }),
      });

      const codigoData = await codigoResponse.json();

      if (codigoData.success) {
        alert("registro completo");
        // Construir el objeto de datos del nuevo usuario a enviar al backend
      const nuevoUsuario = {
        nombre_usuario: nombre,
        correo_electronico: correo,
        id_ciudad: ciudad,
        contrasena: password,
        rol: "user",
        direccion: direccion,
      };
        // Realizar la solicitud POST al backend para insertar al usuario
        const insertarUsuarioResponse = await fetch("http://localhost:5000/reg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoUsuario),
        });

        const insertarUsuarioData = await insertarUsuarioResponse.json();

        if (insertarUsuarioData.success) {
          console.log("Usuario insertado exitosamente:", insertarUsuarioData.message);

          // Obtener el ID del usuario recién insertado
          const userId = insertarUsuarioData.userId;

          // Crear el carrito para el usuario
          await createCartForUser(userId);
          window.location.href = '/';
        } else {
          console.error("Error al insertar usuario:", insertarUsuarioData.message);
        }
      } else {
        console.error("Código de validación incorrecto:", codigoData.message);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <select
        value={departamento}
        onChange={(e) => setDepartamento(e.target.value)}
      >
        <option value="">Seleccionar Departamento</option>
        {departamentos.map((dep) => (
          <option key={dep.id_departamento} value={dep.id_departamento}>
            {dep.nombre_departamento}
          </option>
        ))}
      </select>
      {departamento && (
        <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
          <option value="">Seleccionar Ciudad</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
              {ciudad.nombre_ciudad}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {correoExistente && (
        <div className="alerta-correo">
          El correo electrónico ya está registrado.
        </div>
      )}
      {codigoEnviado ? (
  <>
    {codigoValido ? (
      // Si el código es válido, insertar usuario, crear carrito y redirigir al inicio
      <>
        {handleRegistro()}
      </>
    ) : (
      // Si el código no es válido, muestra el campo de código y botón de enviar
      <>
        <input
          type="text"
          placeholder="Código de Verificación"
          value={codigoValidacion}
          onChange={(e) => setCodigoValidacion(e.target.value)}
        />
        <button onClick={handleEnviarCodigo}>Enviar Código</button>
      </>
    )}
        </>
      ) : (
        <button onClick={handleRegistro}>Registrarse</button>
      )}
    </div>
  );
};

export default Registro;
