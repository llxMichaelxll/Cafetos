// MenuUser.js
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CarritoModal from "./ventanaModal/ModalCarrito";
import ContactoModal from "./ventanaModal/ModalContacto";
import CarouselComponent from "./Carousel";
import ProductosConImagenes from "./ProductosConImagen";
import Footer from "./Footer";
import "../styles/menu.css";

const MenuUser = ({ userToken, userId }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <div className="menu-container">
  <ul className="menu">
    <li>Categorías</li>
    <Link to="/noticias">
      <li>Noticias</li>
    </Link>
    <Link to="/pedidos-usuario">
      <li>Pedidos</li>
    </Link>
    <ContactoModal />
  </ul>
  <div className="menu-iconos">
    <div className="menu-iconos-container">
      <img
        className="menu-iconos-img-perfil"
        src="http://localhost:5000/uploads/usuario.png"
        alt="Usuario"
      />
      <div className="botones-perfil">
        <button className="cerrar-sesion botones-perfil" onClick={handleLogoutClick}>
          Cerrar Sesión
        </button>
        <button className="mi-perfil botones-perfil">Mi Perfil</button>
      </div>
    </div>
    <CarritoModal userId={userId} />
  </div>
</div>


      <CarouselComponent />
      <ProductosConImagenes userId={userId} />
      <Footer />
    </>
  );
};

export default MenuUser;
