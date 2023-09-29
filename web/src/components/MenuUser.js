import React, { useState } from "react";
import { Link } from "react-router-dom";
import CarritoModal from "./ventanaModal/ModalCarrito";
import CarouselComponent from "./Carousel";
import ProductosConImagenes from "./ProductosConImagen";
import Footer from "./Footer";
import "../styles/menu.css";
import Categorias from "./Categorias";


const MenuUser = ({ userToken, userId }) => {

  const [mostrarBotones,setMostrarBotones] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriasVisible, setCategoriasVisible] = useState(false);
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  const [menuUl, setMenuUl] = useState('menuUser-ul')
  const [ocultar,setOcultar] = useState('menuUser-li-ocultar')

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setCategoriasVisible(false);
  };

  return (
    <>
      <div className="menuUser-container">

        <ul className={menuUl}>

          <li className="li-user-logo">
            <img className="User-logo" src="http://localhost:5000/uploads/Cafetos-Navbar-Logo.png"/>
          </li>
          <div onClick={()=>{ocultar==='menuUser-li-ocultar'?setOcultar('menuUser-li'):setOcultar('menuUser-li-ocultar');menuUl==='menuUser-ul'?setMenuUl('menuUser-ul2'):setMenuUl('menuUser-ul')}} className="depliegue-menuUser">
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
            {categoriasVisible? (
            <ul className="opciones-categorias">
              <li onClick={() => handleCategoriaChange(null)}>
                Todos los Productos
              </li>
              <li onClick={() => handleCategoriaChange(1)}>Detal</li>
              <li onClick={() => handleCategoriaChange(2)}>Por mayor</li>
            </ul>
          ):'Categorias'}
          </li>
          
          
            <li className={ocultar}>
              <Link className="menuUser-li-Link" to="/noticias">Noticias</Link>
              </li>
          
          
            <li className={ocultar}>
              <Link className="menuUser-li-Link" to="/pedidos-usuario">Pedidos</Link>
            </li>
          
          <li className={ocultar}>
            <Link className="menuUser-li-Link" to={'/contacto'}>Contacto</Link>
          </li>

          <div className="Contenedor-user-butons-li">
          <li className="menuUser-li">
            <img
              onClick={()=>{mostrarBotones ? setMostrarBotones(false) : setMostrarBotones(true);}}
              className="menuUser-img-perfil"
              src="http://localhost:5000/uploads/icono Usuario.png"
              alt="Usuario"
            />
          </li>
          <li className="menuUser-li"> <CarritoModal userId={userId} /></li>
          </div>
        </ul>

       {mostrarBotones&&(<div className="menuUser-botones-contenedor">

        <button className=" botones-sesion User-mi-perfil"><Link className="menuUser-li-Link"  to={'/perfil'}>Mi Perfil</Link></button>
        <button
          className=" botones-sesion User-cerrar-sesion"
          onClick={handleLogoutClick}
        >
          Salir
        </button>
       </div>)}
      </div>

      <CarouselComponent />
      {categoriaSeleccionada !== null ? (
        <Categorias categoria={categoriaSeleccionada} />
      ) : (
        <ProductosConImagenes userId={userId} />
      )}
      <Footer />
    </>
  );
};

export default MenuUser;
