import React, { useState } from "react";
import { Link } from "react-router-dom";
import CarritoModal from "./ventanaModal/ModalCarrito";
import ProductosConImagenes from "./ProductosConImagen"; // Corregido el nombre del import
import Footer from "./Footer";
import RegistroModal from "./ventanaModal/ModalRegistro";

import CarouselComponent from "./Carousel";
import "../styles/menu.css";

const Menu = ({ userRole, onLogoutClick }) => {
  const [showUser, setShowUser] = useState(false);

  const showOnAndOff = () => {
    // Corregido el operador ternario
    setShowUser(!showUser);
  };

  return (
    <>
      <div className="menu-container">
        <div className="Logo">
          <img src="http://localhost:5000/uploads/Logo.png" alt="Logo" />
        </div>
        <div className="menu-nav">
          <ul>
            <li>Categorías</li>
            <li>
              <Link to="/noticias">Noticias</Link>
            </li>{" "}
            {/* Corregido el orden de las etiquetas */}
          </ul>
        </div>
        <div className="menu-iconos">
          <div className="menu-iconos-container">
            <img
              className="menu-iconos-img-perfil"
              src="http://localhost:5000/uploads/usuario.png"
              alt="Usuario"
            />

            <div className="botones-perfil">
              {userRole === "guest" ? (
                <Link to="/login">
                  <button className="login__boton">Login</button>
                </Link>
              ) : (
                <button
                  className="cerrar-sesion"
                  onClick={onLogoutClick}
                >
                  Cerrar Sesión
                </button>
              )}
              <RegistroModal/>
            </div>
            {/* Agregado un valor por defecto cuando showUser no es true */}
          </div>
          <CarritoModal />
        </div>
      </div>
      <CarouselComponent />
      <ProductosConImagenes />
      <Footer />
    </>
  );
};

export default Menu;
