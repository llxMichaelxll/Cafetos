import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useCart } from "../context/ContextCarrito";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const { setIdUsuario, setUserRol } = useCart();
  const [Alerta, setAlerta] = useState(false);
  const [texAlert, SetTexAlert] = useState("");
  const [clase, stepClase] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      stepClase("alerta-roja-login");
      SetTexAlert("Debes completar todos los campos");
      setAlerta(true);
      setTimeout(() => {
        setAlerta(false);
      }, 3000);
    } else {
      const userData = {
        correo_electronico: email,
        contrasena: password,
      };

      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // console.log('Inicio de sesión exitoso. Rol del usuario:', data.rol, data.nombre,data.id_usuario);
            localStorage.setItem("user", JSON.stringify(data));
            setIdUsuario(data.id_usuario);
            history("/"); // Navigating back to the main page
          } else {
            SetTexAlert("Correo y/o contraseña invalidas");
            stepClase("alerta-roja-login");
            setAlerta(true);
            setTimeout(() => {
              setAlerta(false);
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
        });
    }
  };
  const handleCancel = () => {
    // setRol('guest');
    history("/");
  };

  return (
    <div className="Login">
      <h2 className="Login-h2">Iniciar Sesión</h2>
      <input
        className="Login-input"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="Login-input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="acceptar Login-button" onClick={handleLogin}>
        Aceptar
      </button>
      <button className="cancel Login-button" onClick={handleCancel}>
        Cancelar
      </button>
      <p
        className="p-login-recu"
        onClick={() => history("/Recuperar-contraseña")}
      >
        ¿Olvidaste la contraseña?
      </p>
      {Alerta && <p className={clase}>{texAlert}</p>}
    </div>
  );
};

export default Login;
