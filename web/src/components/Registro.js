import React, { useState, useEffect } from 'react';
import '../styles/registro.css'
const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [password, setPassword] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    // Obtener la lista de departamentos desde el servidor al cargar el componente
    fetch('http://localhost:5000/departamentos')
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) => console.error('Error al obtener la lista de departamentos:', error));
  }, []);

  useEffect(() => {
    // Obtener la lista de ciudades por departamento desde el servidor cuando se seleccione un departamento
    if (departamento) {
      fetch(`http://localhost:5000/ciudades/${departamento}`)
        .then((response) => response.json())
        .then((data) => setCiudades(data))
        .catch((error) => console.error('Error al obtener la lista de ciudades:', error));
    }
  }, [departamento]);

  const handleRegistro = async () => {
    try {
      // Verificar que todos los campos estén completos
      if (!nombre || !correo || !departamento || !ciudad || !password) {
        console.error('Por favor, complete todos los campos');
        return;
      }



      // Construir el objeto de datos del nuevo usuario a enviar al backend
      const nuevoUsuario = {
        nombre_usuario: nombre,
        correo_electronico: correo,
        id_ciudad: ciudad,
        contrasena: password,
        rol: 'user',
      };

      console.log('Nuevo usuario:', nuevoUsuario);

      // Realizar la solicitud POST al backend para registrar el nuevo usuario
      const response = await fetch('http://localhost:5000/reg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoUsuario) 
  });

      const data = await response.json();

      // Verificar si el registro fue exitoso
      if (data.success) {
        console.log('Registro exitoso:', data.message);
        // Aquí puedes redirigir al usuario a una página de inicio de sesión o mostrar un mensaje de éxito
      } else {
        console.error('Error al registrar al usuario:', data.message);
        // Aquí puedes mostrar un mensaje de error al usuario si el registro no fue exitoso
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }

    window.location.href = '/';  
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
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegistro}>Registrarse</button>
    </div>
  );
};

export default Registro;
