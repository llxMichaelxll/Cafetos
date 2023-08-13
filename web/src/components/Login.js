import React, { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = ({ setRol }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = () => {
    const userData = {
      correo_electronico: email,
      contrasena: password,
    };

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Inicio de sesión exitoso. Rol del usuario:', data.rol, data.nombre);
          setRol(data.rol, data.nombre, data.token); // Passing the token to the setRol function
          history('/'); // Navigating back to the main page

        } else {
          console.error('Credenciales inválidas:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
      });
  };

  const handleCancel = () => {
    setRol('guest');
    history('/');
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
      <button className="accept" onClick={handleLogin}>
        Aceptar
      </button>
      <button className="cancel" onClick={handleCancel}>
        Cancelar
      </button>
    </div>
  );
};

export default Login;
