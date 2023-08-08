import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = ({ setRol, setNombre }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate(); // Obtener el objeto de historial de navegación
  // const [lDatos, setLdatos] = useState([])

  const handleLogin = () => {
    // Objeto que contiene los datos a enviar al servidor
    const userData = {
      correo_electronico: email,
      contrasena: password,
    };

    // Realizar la solicitud POST al backend
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Aquí puedes manejar la respuesta del servidor después del inicio de sesión
        if (data.success) {
          // Login exitoso, puedes redirigir a una nueva página o mostrar un mensaje de éxito
          console.log('Inicio de sesión exitoso. Rol del usuario:', data.rol,data.nombre);
          setRol(data.rol); // Utilizamos el nombre correcto de la función setUserRol
          setNombre(data.nombre_usuario);
        } else {
          // Credenciales inválidas, muestra un mensaje de error
          console.error('Credenciales inválidas:', data.message);
        }
      })
      .catch((error) => {
        // Manejar errores en caso de que la solicitud falle
        console.error('Error al realizar la solicitud:', error);
      });
  };

  const handleCancel = () => {
    setRol('guest'); // Actualizar el rol del usuario a 'guest'
    history('/'); // Redirigir al componente Menu usando useNavigate
  };

  

  return (
    <div className="Login">
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* <a href="/olvidar-contraseña">¿Olvidaste tu contraseña?</a> */}
      <button className="accept" onClick={handleLogin}>Aceptar</button>
      <button className="cancel" onClick={handleCancel}>Cancelar</button>
    </div>
  );

};

export default Login;
