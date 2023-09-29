import React, { useState } from "react";
import { Link } from "react-router-dom";
import CarritoModal from "./ventanaModal/ModalCarrito";
import ProductosConImagenes from "./ProductosConImagen";
import Footer from "./Footer";
import CarouselComponent from "./Carousel";
import Categorias from "./Categorias";
import "../styles/menu.css";

const Menu = ({ userRole, onLogoutClick }) => {
  const [showUser, setShowUser] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(null);
  const [ocultar,setOcultar] = useState('noUser-li-ocultar')
  const [menuUl,setMenuUl] = useState('noUser-menu-ul')

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriasVisible, setCategoriasVisible] = useState(false);
  const showOnAndOff = () => {
    // Corregido el operador ternario
    setShowUser(!showUser);
  };
  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setCategoriasVisible(false);
  };

  return (
    <>
      <div className="noUser-menu-container">
        <ul className={menuUl}>
          <li className="noUser-li-logo-contenedor">
            <img className="noUser-img-logo"
              src="http://localhost:5000/uploads/Cafetos-Navbar-Logo.png"
              alt="Logo"
            />
          </li>
          <div onClick={()=>{ocultar==='noUser-li-ocultar'?setOcultar('noUser-li'):setOcultar('noUser-li-ocultar');menuUl==='noUser-menu-ul'?setMenuUl('noUser-menu-ul2'):setMenuUl('noUser-menu-ul')}} className="depliegue-menu">
            <div className="menu-forma"></div>
            <div className="menu-forma"></div>
            <div className="menu-forma"></div>
          </div>
          <li
             className={ocultar}
            onClick={() => {
              setCategoriasVisible(!categoriasVisible);
            }}
          >
            {categoriasVisible ? (
            <ul className="categoria-no-sesion">
              <li onClick={() => handleCategoriaChange(null)}>
                Todos los Productos
              </li>
              <li onClick={() => handleCategoriaChange(1)}>Detal</li>
              <li onClick={() => handleCategoriaChange(2)}>Por mayor</li>
            </ul>
          ):'Categorias'}
          </li>
          
          <li  className={ocultar}>
            <Link className="noUser-li-Link" to="/noticias">
              Noticias
            </Link>
          </li>
          <li  className={ocultar}>
            <Link className="noUser-li-Link" to={'/contacto'}>Contacto</Link>
          </li>
          <div className="contenedor-noUser-botones">
            <li className="noUser-li">
              <img
                onClick={() => {
                  mostrarBotones
                    ? setMostrarBotones(false)
                    : setMostrarBotones(true);
                }}
                className="menu-iconos-img-perfil"
                src="http://localhost:5000/uploads/icono Usuario.png"
                alt="Usuario"
              />
            </li>
            <li className="noUser-li">
              <CarritoModal />
            </li>
          </div>
        </ul>
        {mostrarBotones && (
          <div className="noUser-botones-contenedor">
            <button className="<noUser-botones 
            noUser-login">
              <Link className="noUser-li-Link sesion-b" to="/login">Login</Link>
            </button>
            <button className="noUser-botones noUser-registro-boton">
              <Link className="noUser-li-Link" to="/registro">Registrarse</Link>
            </button>
          </div>
        )}
      </div>

      <CarouselComponent />
      {categoriaSeleccionada !== null ? (
        <Categorias categoria={categoriaSeleccionada} />
      ) : (
        <ProductosConImagenes />
      )}
      <Footer />
    </>
  );
};

export default Menu;
